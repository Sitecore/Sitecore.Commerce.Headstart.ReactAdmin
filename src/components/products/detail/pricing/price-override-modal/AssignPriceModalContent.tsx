import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Button,
  ButtonGroup,
  FormErrorMessage,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  FormControl as ChakraFormControl
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {Control, useController, useForm, useFormState} from "react-hook-form"
import {array, object, string} from "yup"
import {FormEvent, useCallback, useState} from "react"
import {Buyers, ProductAssignment, UserGroups} from "ordercloud-javascript-sdk"
import {compact, debounce, rest, uniq, uniqWith} from "lodash"
import {AsyncSelect, Select} from "chakra-react-select"
import {TbX} from "react-icons/tb"
import FormControl from "@/components/react-hook-form/form-control"
import {SelectControl} from "@/components/react-hook-form"
import {IBuyer} from "types/ordercloud/IBuyer"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

interface AssignPriceFormModel {
  BuyerAssignments: string[]
  UserGroupAssignments: {Buyer: {label: string; value: string}; UserGroup: {label: string; value: string}}[]
}

interface AssignPriceModalContentProps {
  productAssignments: ProductAssignment[]
  onUpdate: (data: ProductAssignment[]) => void
  onStepChange: (step: "editprice" | "assignprice") => void
  onCancelModal: () => void
}
export function AssignPriceModalContent({
  productAssignments = [],
  onUpdate,
  onStepChange,
  onCancelModal
}: AssignPriceModalContentProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  const selectOptionShemaOptional = object().shape({label: string(), value: string()})
  const selectOptionSchemaRequired = object().shape({label: string().required(), value: string().required()})
  const validationSchema = object()
    .shape({
      BuyerAssignments: array().of(string()),
      UserGroupAssignments: array()
        .of(
          object().shape({
            Buyer: selectOptionSchemaRequired,
            UserGroup: selectOptionShemaOptional
          })
        )
        .test(
          "unique",
          "Price assignment must be unique",
          (assignments = []) =>
            compact(
              uniqWith(
                assignments,
                (a, b) => a.Buyer.value === b.Buyer.value && a.UserGroup.value === b.UserGroup.value
              )
            ).length === assignments.length
        )
    })
    .nullable()
    .test(
      "min-one-assignment",
      "Please create at least one assignment",
      (result) => result && (result.BuyerAssignments.length > 0 || result.UserGroupAssignments.length > 0)
    )

  const {handleSubmit, control, reset} = useForm<AssignPriceFormModel>({
    mode: "onBlur",
    resolver: yupResolver(validationSchema) as any,
    defaultValues: getAsyncDefaultValues
  })

  const {errors} = useFormState({control})

  async function getAsyncDefaultValues() {
    // get buyer assignments data
    const buyerAssignments = productAssignments.filter((assignment) => !assignment.UserGroupID)
    const allBuyerIds = uniq(compact(productAssignments.map((assignment) => assignment.BuyerID)))
    if (!allBuyerIds.length) {
      return {BuyerAssignments: [], UserGroupAssignments: []}
    }
    const allBuyers = await Buyers.List({filters: {ID: allBuyerIds.join("|")}})

    // get usergroup assignment data
    const userGroupAssignments = productAssignments.filter((assignment) => assignment.UserGroupID)
    const getUserGroup = async (buyerId: string, userGroupId: string) => {
      const userGroup = await UserGroups.Get(buyerId, userGroupId)
      return {Buyer: allBuyers.Items.find((b) => b.ID === buyerId), UserGroup: userGroup}
    }
    const userGroupRequests = userGroupAssignments.map((assignment) =>
      getUserGroup(assignment.BuyerID, assignment.UserGroupID)
    )
    const userGroupResponses = await Promise.all(userGroupRequests)

    const response = {
      BuyerAssignments: buyerAssignments.map((assignment) => assignment.BuyerID),
      UserGroupAssignments: userGroupAssignments.map((assignment) => {
        const response = userGroupResponses.find(
          (r) => r.UserGroup.ID === assignment.UserGroupID && r.Buyer.ID === assignment.BuyerID
        )
        return {
          Buyer: {label: response.Buyer.Name, value: response.Buyer.ID},
          UserGroup: {label: response.UserGroup.Name, value: response.UserGroup.ID}
        }
      })
    }
    return response
  }

  const onSubmit = (data) => {
    const buyerProductAssignments = data.BuyerAssignments.map((optionValue) => ({
      BuyerID: optionValue
    }))
    const userGroupProductAssignments = data.UserGroupAssignments.map((option) => ({
      BuyerID: option.Buyer.value,
      UserGroupID: option.UserGroup.value
    }))
    onUpdate([...buyerProductAssignments, ...userGroupProductAssignments])
  }

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onCancelModal()
    reset()
  }

  const loadBuyers = useCallback(async (search: string) => {
    const buyers = await Buyers.List({search})
    return buyers.Items.map((buyer) => ({label: <BuyerLabel buyer={buyer} />, value: buyer.ID}))
  }, [])

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Assign Price</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <SelectControl
          name="BuyerAssignments"
          label="Assign to buyer organizations"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isProductManager}
          maxWidth="50%"
          selectProps={{
            isMulti: true,
            loadOptions: loadBuyers,
            chakraStyles: {
              container: (baseStyles) => ({...baseStyles, marginBottom: 5}),
              multiValueLabel: (baseStyles) => ({...baseStyles, backgroundColor: "transparent"}),
              multiValue: (baseStyles) => ({...baseStyles, backgroundColor: "transparent"})
            }
          }}
        />
        <UserGroupSelect control={control} label="Assign to usergroups" />
      </ModalBody>
      <ModalFooter>
        <HStack justifyContent="space-between" w="100%">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <HStack>
            {/* Display top level (multi-field) errors */}
            {errors && Boolean(errors[""]) && (
              <ChakraFormControl isInvalid={true}>
                <FormErrorMessage>{(errors as any)[""].message}</FormErrorMessage>
              </ChakraFormControl>
            )}
            <Button onClick={() => onStepChange("editprice")}>Edit Price</Button>
            <SubmitButton control={control} variant="solid" colorScheme="primary" isDisabled={!isProductManager}>
              Save changes
            </SubmitButton>
          </HStack>
        </HStack>
      </ModalFooter>
    </ModalContent>
  )
}

interface UserGroupSelectProps {
  control: Control<AssignPriceFormModel>
  label: string
  validationSchema?: any
}
// custom select component that handles usergroup assignment selection
function UserGroupSelect({control, label, validationSchema}: UserGroupSelectProps) {
  const inputName = "UserGroupAssignments" as "UserGroupAssignments"
  const [currentBuyer, setCurrentBuyer] = useState({label: "", value: ""})
  const [userGroupOptions, setUserGroupOptions] = useState([])
  const [isLoadingUserGroupOptions, setIsLoadingUserGroupOptions] = useState(false)
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name: inputName,
    control
  })

  const loadBuyers = async (search: string) => {
    const buyers = await Buyers.List({search})
    return buyers.Items.map((buyer) => ({
      label: buyer.Name,
      value: buyer.ID
    }))
  }

  const handleBuyerChange = (newBuyer) => {
    setCurrentBuyer(newBuyer)
    loadUserGroups("", newBuyer.value)
  }

  const loadUserGroups = async (search: string, buyerId?: string) => {
    try {
      setIsLoadingUserGroupOptions(true)
      if (!buyerId && !currentBuyer.value) return []
      const userGroups = await UserGroups.List(buyerId || currentBuyer.value, {search})
      const options = userGroups.Items.filter((userGroup) => {
        const alreadyAssigned = (field.value || []).some((assignment) => assignment.UserGroup.value === userGroup.ID)
        return !alreadyAssigned
      }).map((userGroup) => ({label: userGroup.Name, value: userGroup.ID}))
      setUserGroupOptions(options)
    } finally {
      setIsLoadingUserGroupOptions(false)
    }
  }

  const handleRemove = (index: number) => {
    const update = field.value.filter((value, i) => i !== index)
    field.onChange(update)
  }

  const debouncedLoadUserGroups = debounce(loadUserGroups, 500)

  const handleUserGroupInputChange = (searchTerm) => {
    debouncedLoadUserGroups(searchTerm)
  }

  const handleUserGroupChange = (newUserGroup) => {
    field.onChange([...(field.value || []), {Buyer: currentBuyer, UserGroup: newUserGroup}])
  }

  return (
    <>
      <FormControl name={inputName} control={control} label={label} validationSchema={validationSchema} {...rest}>
        <HStack>
          <AsyncSelect
            chakraStyles={{container: (baseStyles) => ({...baseStyles, width: "100%"})}}
            isDisabled={isSubmitting || !isProductManager}
            placeholder="Select buyer"
            defaultOptions
            loadOptions={loadBuyers}
            onChange={handleBuyerChange}
          />
          <Select
            chakraStyles={{
              container: (baseStyles) => ({...baseStyles, width: "100%"})
            }}
            options={userGroupOptions}
            placeholder="Select usergroups in buyer"
            name={field.name}
            isDisabled={isSubmitting || !currentBuyer.value || !isProductManager}
            onChange={handleUserGroupChange}
            closeMenuOnSelect={true}
            onInputChange={handleUserGroupInputChange}
            controlShouldRenderValue={false}
            isLoading={isLoadingUserGroupOptions}
            hideSelectedOptions={true}
          ></Select>
        </HStack>
      </FormControl>
      <ButtonGroup display="flex" flexWrap="wrap" gap={2} marginTop={2}>
        {(Array.isArray(field.value) ? field.value : []).map((option, index) => (
          <Button
            key={index}
            rightIcon={<TbX />}
            variant="solid"
            fontWeight={"normal"}
            size="sm"
            borderRadius={"full"}
            onClick={() => handleRemove(index)}
            backgroundColor="accent.100"
            style={{margin: 0}}
          >
            {option.Buyer.label} <Text marginX={3}>|</Text> {option.UserGroup.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}

function BuyerLabel({buyer}: {buyer: IBuyer}) {
  return (
    <Button
      variant="solid"
      fontWeight={"normal"}
      size="sm"
      borderRadius={"full"}
      backgroundColor="primary.100"
      style={{margin: 0}}
    >
      <Text>{buyer.Name} </Text>
    </Button>
  )
}
