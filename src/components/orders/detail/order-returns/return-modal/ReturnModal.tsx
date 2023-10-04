import {
  Button,
  ButtonProps,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  MenuItem,
  MenuItemProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import {FormEvent, PropsWithChildren, useEffect, useState} from "react"
import {ILineItem} from "types/ordercloud/ILineItem"
import {emptyStringToNull, getObjectDiff, priceHelper} from "utils"
import {IOrder} from "types/ordercloud/IOrder"
import {IOrderReturn} from "types/ordercloud/IOrderReturn"
import {array, number, object, string} from "yup"
import {useForm, useWatch} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {InputControl, RadioGroupControl, TextareaControl} from "@/components/react-hook-form"
import {ReturnItemsTable} from "./ReturnItemsTable"
import {OrderReturns} from "ordercloud-javascript-sdk"
import {get} from "lodash"

interface ReturnModalProps extends PropsWithChildren {
  order: IOrder
  allOrderReturns: IOrderReturn[]
  lineItems: ILineItem[]
  onUpdate: () => void
  orderReturn?: IOrderReturn
  buttonProps?: ButtonProps
  menuItemProps?: MenuItemProps
  as: "button" | "menuitem"
}
export function ReturnModal({
  order,
  allOrderReturns,
  orderReturn,
  lineItems,
  onUpdate,
  as,
  buttonProps,
  menuItemProps,
  children
}: ReturnModalProps) {
  const [currentOrderReturn, setCurrentOrderReturn] = useState<IOrderReturn | null>(orderReturn)
  const {isOpen, onOpen, onClose} = useDisclosure()

  const defaultValues = {
    ReturnType: "ReturnItems",
    OrderID: order.ID,
    RefundAmount: "",
    Comments: "",
    ItemsToReturn: lineItems.map((lineItem) => {
      const orderReturnItem = (currentOrderReturn?.ItemsToReturn || []).find((item) => item.LineItemID === lineItem.ID)
      return {
        LineItemID: lineItem.ID,
        Quantity: orderReturnItem?.Quantity || "",
        RefundAmount: orderReturnItem?.RefundAmount || "",
        Comments: orderReturnItem?.Comments || ""
      }
    })
  }
  const existingRefund = allOrderReturns.reduce((acc, curr) => acc + curr.RefundAmount || 0, 0)
  const maxRefund = order.Total - existingRefund

  const validationSchema = object().shape({
    ReturnType: string().oneOf(["ReturnItems", "CsRefund"]).required("Please select a return type"),
    RefundAmount: number()
      .transform(emptyStringToNull)
      .nullable()
      .when("ReturnType", {
        is: "CsRefund",
        then: (schema) =>
          schema
            .min(0, "Refund amount must be greater than or equal to 0")
            .max(
              maxRefund,
              `The max refund amount is ${priceHelper.formatPrice(maxRefund)} (order total - existing refunds)`
            )
      }),
    ItemsToReturn: array()
      .of(
        object().shape({
          LineItemID: string().required("Please select a line item"),
          Quantity: number().transform(emptyStringToNull).nullable().min(0),
          RefundAmount: number().transform(emptyStringToNull).nullable().min(0),
          Comments: string().max(500, "Comments must be less than 500 characters")
        })
      )
      .test({
        name: "return-items-max-refund-amount",
        test: (itemsToReturn = [], {path, createError}) => {
          const refundAmount = itemsToReturn.reduce((acc, curr) => acc + curr.RefundAmount || 0, 0)
          if (refundAmount > maxRefund) {
            return createError({
              path,
              message: `The max refund amount is ${priceHelper.formatPrice(maxRefund)} (order total - existing refunds)`
            })
          }
          return true
        }
      })
      .when("ReturnType", {
        is: "ReturnItems",
        then: (schema) =>
          schema.test({
            name: "at-least-one-return-item",
            message: "Please select at least one item to return",
            test: (itemsToReturn = []) => {
              const validItems = itemsToReturn.filter((item) => item.Quantity > 0 && item.RefundAmount)
              return validItems.length > 0
            }
          })
      })
  })

  const {
    handleSubmit,
    control,
    reset,
    formState: {errors}
  } = useForm<any>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: currentOrderReturn || defaultValues
  })
  const itemsToReturnErrors = get(errors, "ItemsToReturn") as any
  const returnType = useWatch({name: "ReturnType", control})

  useEffect(() => {
    // if order return data is refreshed from parent
    // then update the current order return
    setCurrentOrderReturn(orderReturn)
  }, [orderReturn])

  const handleCancel = () => {
    onClose()
    setCurrentOrderReturn(orderReturn) // reset to initial order return
    reset(orderReturn) // reset form to initial order return
  }

  const onSubmit = async (updatedReturn: IOrderReturn) => {
    if (returnType === "CsRefund") {
      updatedReturn.ItemsToReturn = []
    } else {
      updatedReturn.RefundAmount = null
    }
    updatedReturn.ItemsToReturn = updatedReturn.ItemsToReturn.filter((item) => item.Quantity > 0 && item.RefundAmount)
    const diff = getObjectDiff(currentOrderReturn, updatedReturn) as Partial<IOrderReturn>
    if (Object.keys(diff).length === 0) {
      return handleCancel()
    }

    // update or create order return
    if (updatedReturn?.ID) {
      await OrderReturns.Patch(currentOrderReturn.ID, diff)
    } else {
      const createdReturn = await OrderReturns.Create(diff as IOrderReturn)
      // Here we're combining create/submit into one step
      // it is possible to add a seller approval rule here as well
      // but we're skipping that for now to keep things simple
      await OrderReturns.Submit(createdReturn.ID)
    }

    onUpdate()
    onClose()
  }

  const handleSubmitPreventBubbling = async (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    await handleSubmit(onSubmit)(event)
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {children}
        </Button>
      ) : (
        <MenuItem onClick={onOpen} {...menuItemProps}>
          {children}
        </MenuItem>
      )}
      <Modal size="4xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
          <ModalHeader>{currentOrderReturn?.ID ? "Update Return" : "Create Return"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3}>
              <RadioGroupControl name="ReturnType" control={control} validationSchema={validationSchema}>
                <Radio value="ReturnItems">Return Items</Radio>
                <Radio value="CsRefund">Customer service Refund</Radio>
              </RadioGroupControl>
              <Divider my={3} />
              {returnType === "CsRefund" && (
                <InputControl
                  name="RefundAmount"
                  label="Refund Amount"
                  control={control}
                  validationSchema={validationSchema}
                  inputProps={{type: "number"}}
                  leftAddon="$"
                />
              )}
              {returnType === "ReturnItems" && (
                <ReturnItemsTable
                  control={control}
                  validationSchema={validationSchema}
                  lineItems={lineItems}
                  allOrderReturns={allOrderReturns}
                  existingReturn={currentOrderReturn}
                />
              )}

              <TextareaControl name="Comments" label="Comments" control={control} validationSchema={validationSchema} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent="space-between" w="100%">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <HStack>
                {/* Display top level (item to returns) errors */}
                {Boolean(itemsToReturnErrors?.message) && (
                  <FormControl isInvalid={true}>
                    <FormErrorMessage>{itemsToReturnErrors.message}</FormErrorMessage>
                  </FormControl>
                )}
                <SubmitButton control={control} variant="solid" colorScheme="primary">
                  {currentOrderReturn?.ID ? "Update return" : "Create return"}
                </SubmitButton>
              </HStack>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
