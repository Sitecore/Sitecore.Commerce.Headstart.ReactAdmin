import {
  Button,
  ButtonProps,
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
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import {FormEvent, useState} from "react"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {array, bool, number, object, string} from "yup"
import {InputControl, SwitchControl} from "@/components/react-hook-form"
import {SpecOptionTable} from "./SpecOptionTable"
import {compact, uniqBy} from "lodash"
import {SpecFieldValues} from "types/form/SpecFieldValues"
import {ISpec} from "types/ordercloud/ISpec"

const specFormSchema = object().shape({
  Name: string().required(),
  DefinesVariant: bool(),
  Required: bool().when("DefinesVariant", {
    is: true,
    then: (schema) => schema.oneOf([true], "Spec must be required if Defines Variant")
  }),
  Options: array()
    .of(
      object().shape({
        Value: string().required("Option value is required"),
        ListOrder: number(),
        PriceMarkupType: string().oneOf(["NoMarkup", "AmountPerQuantity", "AmountTotal", "Percentage"]).nullable(),
        PriceMarkup: number().nullable()
      })
    )
    .test({
      name: "is-unique-price",
      message: "One or more options have the same value",
      test: (options = []) => compact(uniqBy(options, "Value")).length === options.length
    })
    .min(1, "Must have at least one option")
})

export const specFormDefaultValues = {
  Name: "",
  DefinesVariant: true,
  Required: true,
  Options: [
    {
      Value: "",
      ListOrder: 0,
      PriceMarkupType: "NoMarkup",
      PriceMarkup: 0
    }
  ]
}

interface SpecUpdateModalProps {
  initialSpec?: SpecFieldValues
  onUpdate: (spec: SpecFieldValues) => void
  as: "button" | "menuitem"
  buttonProps?: ButtonProps
  menuItemProps?: MenuItemProps
}
export function SpecUpdateModal({
  initialSpec,
  onUpdate,
  as = "button",
  buttonProps,
  menuItemProps
}: SpecUpdateModalProps) {
  const [spec, setSpec] = useState<SpecFieldValues | null>(initialSpec)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const {handleSubmit, control, trigger, reset} = useForm<SpecFieldValues>({
    mode: "onBlur",
    resolver: yupResolver(specFormSchema) as any,
    defaultValues: spec || specFormDefaultValues
  })

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onClose()
  }

  const onSubmit = (update: SpecFieldValues) => {
    onUpdate(update)
    setSpec(initialSpec) // reset spec to initial
    reset(specFormDefaultValues) // reset form
    onClose()
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {buttonProps.children || "Add spec"}
        </Button>
      ) : (
        <MenuItem onClick={onOpen} {...menuItemProps} />
      )}

      <Modal size="5xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
          <ModalHeader>{spec ? "Edit Spec" : "Create Spec"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" gap={3}>
              <InputControl
                maxWidth="md"
                name="Name"
                label="Name"
                control={control}
                validationSchema={specFormSchema}
              />
              <SwitchControl
                maxWidth="md"
                name="DefinesVariant"
                label="Defines Variant"
                control={control}
                validationSchema={specFormSchema}
              />
              <SwitchControl
                maxWidth="md"
                name="Required"
                label="Required"
                control={control}
                validationSchema={specFormSchema}
              />
              <SpecOptionTable control={control} validationSchema={specFormSchema} trigger={trigger} />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent="space-between" w="100%">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Submit
              </SubmitButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
