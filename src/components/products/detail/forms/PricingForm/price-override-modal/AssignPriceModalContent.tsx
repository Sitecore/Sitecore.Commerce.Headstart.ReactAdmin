import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Badge,
  Box,
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
import {Control, FieldValues, useController, useForm, useFormState} from "react-hook-form"
import {array, object, string} from "yup"
import {FormEvent, useState} from "react"
import {Buyers, ProductAssignment, UserGroups} from "ordercloud-javascript-sdk"
import {compact, debounce, rest, uniq, uniqWith} from "lodash"
import AsyncSelect from "react-select/async"
import Select from "react-select"
import SelectAsyncControl from "@/components/react-hook-form/select-async-control"
import {TbX} from "react-icons/tb"
import {isRequiredField} from "utils"
import FormControl from "@/components/react-hook-form/form-control"

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
  const selectOptionShemaOptional = object().shape({label: string(), value: string()})
  const selectOptionSchemaRequired = object().shape({label: string().required(), value: string().required()})
  const validationSchema = object()
    .shape({
      BuyerAssignments: array().of(selectOptionSchemaRequired),
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

  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: getAsyncDefaultValues as any
  })

  const {errors} = useFormState({control})

  async function getAsyncDefaultValues() {
    // get buyer assignments data
    const buyerAssignments = productAssignments.filter((assignment) => !assignment.UserGroupID)
    const allBuyerIds = uniq(compact(productAssignments.map((assignment) => assignment.BuyerID)))
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
      BuyerAssignments: buyerAssignments.map((assignment) => {
        const buyer = allBuyers.Items.find((buyer) => buyer.ID === assignment.BuyerID)
        return {label: buyer.Name, value: buyer.ID}
      }),
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
    const buyerProductAssignments = data.BuyerAssignments.map((option) => ({
      BuyerID: option.value
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

  const loadBuyers = async (search: string) => {
    const buyers = await Buyers.List({search})
    return buyers.Items.map((buyer) => ({label: buyer.Name, value: buyer.ID}))
  }

  return (
    <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
      <ModalHeader>Assign Price</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Box marginBottom={5}>
          <SelectAsyncControl
            name="BuyerAssignments"
            label="Assign to buyer organizations"
            control={control}
            maxWidth="50%"
            selectProps={{isMulti: true, defaultOptions: true, loadOptions: loadBuyers}}
          />
        </Box>
        <UserGroupSelect control={control} name="UserGroupAssignments" label="Assign to usergroups" />
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
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Save changes
            </SubmitButton>
          </HStack>
        </HStack>
      </ModalFooter>
    </ModalContent>
  )
}

interface UserGroupSelectProps {
  control: Control<FieldValues, any>
  name: string
  label: string
  validationSchema?: any
}
// custom select component that handles usergroup assignment selection
function UserGroupSelect({control, name, label, validationSchema}: UserGroupSelectProps) {
  const [currentBuyer, setCurrentBuyer] = useState({label: "", value: ""})
  const [userGroupOptions, setUserGroupOptions] = useState([])
  const [isLoadingUserGroupOptions, setIsLoadingUserGroupOptions] = useState(false)
  const {
    field,
    formState: {isSubmitting}
  } = useController({
    name,
    control
  })

  const loadBuyers = async (search: string) => {
    const buyers = await Buyers.List({search})
    return buyers.Items.map((buyer) => ({label: buyer.Name, value: buyer.ID}))
  }

  const handleBuyerChange = (newBuyer) => {
    setCurrentBuyer(newBuyer)
    loadUserGroups("", newBuyer.value)
  }

  const loadUserGroups = async (search: string, buyer?: string) => {
    try {
      setIsLoadingUserGroupOptions(true)
      if (!buyer && !currentBuyer.value) return []
      const userGroups = await UserGroups.List(buyer || currentBuyer.value, {search})
      const options = userGroups.Items.filter((userGroup) => {
        const alreadyAssigned = (field.value || []).some((assignment) => assignment.UserGroup.value === userGroup.ID)
        return !alreadyAssigned
      }).map((userGroup) => ({label: userGroup.Name, value: userGroup.ID}))
      setUserGroupOptions(options)
    } finally {
      setIsLoadingUserGroupOptions(false)
    }
  }

  const isRequired = isRequiredField(validationSchema, field.name)

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
      <FormControl name={name} control={control} label={label} isRequired={isRequired} {...rest}>
        <HStack>
          <AsyncSelect
            styles={{container: (baseStyles) => ({...baseStyles, width: "100%"})}}
            isDisabled={isSubmitting}
            placeholder="Select buyer"
            defaultOptions
            loadOptions={loadBuyers}
            onChange={handleBuyerChange}
          />
          <Select
            styles={{
              container: (baseStyles) => ({...baseStyles, width: "100%"})
            }}
            options={userGroupOptions}
            placeholder="Select usergroups in buyer"
            name={field.name}
            isDisabled={isSubmitting || !currentBuyer.value}
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
            leftIcon={<TbX />}
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
