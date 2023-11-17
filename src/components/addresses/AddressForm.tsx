import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  UseDisclosureProps
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {InputControl} from "components/react-hook-form"
import {useRouter} from "hooks/useRouter"
import {Address, Addresses, AdminAddresses, SupplierAddresses} from "ordercloud-javascript-sdk"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {FormEvent, useEffect, useState} from "react"
import {object, string} from "yup"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"

interface AddressFormProps {
  address?: Address
  addressType: "buyer" | "supplier" | "admin"
  parentId?: string // used for buyer and supplier addresses
  onCreate?: (address: IAdminAddress) => void
  onUpdate?: (address: IAdminAddress) => void
  disclosureProps?: UseDisclosureProps
}
export function AddressForm({address, addressType, parentId, onCreate, onUpdate, disclosureProps}: AddressFormProps) {
  const isAddressManager = useHasAccess(
    addressType === "admin"
      ? appPermissions.AdminAddressManager
      : addressType === "supplier"
      ? appPermissions.SupplierAddressManager
      : false // don't currently have buyer addresses in the app so disallow for now
  )
  const variant = disclosureProps ? "modal" : "default"
  const {onClose, isOpen} = disclosureProps || {}
  const [currentAddress, setCurrentAddress] = useState(address)
  const [isCreating, setIsCreating] = useState(!address?.ID)
  let router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!address?.ID)
  }, [address?.ID])

  const defaultValues: Partial<IAdminAddress> = {}

  const validationSchema = object().shape({
    AddressName: string().nullable().max(100),
    CompanyName: string().nullable().max(100),
    FirstName: string().nullable().max(100),
    LastName: string().nullable().max(100),
    Street1: string().max(100).required(),
    Street2: string().nullable().max(100),
    City: string().max(100).required(),
    State: string().max(100).required(),
    Zip: string().max(100).required(),
    Country: string().max(2).min(2).required(),
    Phone: string().nullable().max(100)
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: address || defaultValues,
    mode: "onBlur"
  })

  const createOrderCloudAddress = async (fields: IAdminAddress) => {
    if (addressType === "buyer") {
      return await Addresses.Create(parentId, fields)
    } else if (addressType === "supplier") {
      return await SupplierAddresses.Create(parentId, fields)
    } else {
      return await AdminAddresses.Create(fields)
    }
  }

  const updateOrderCloudAddress = async (fields: Partial<IAdminAddress>) => {
    if (addressType === "buyer") {
      return await Addresses.Patch(parentId, fields.ID, fields)
    } else if (addressType === "supplier") {
      return await SupplierAddresses.Patch(parentId, fields.ID, fields)
    } else {
      return await AdminAddresses.Patch(fields.ID, fields)
    }
  }

  async function createAddress(fields: IAdminAddress) {
    const createdAddress = await createOrderCloudAddress(fields)
    if (onCreate) {
      await onCreate(createdAddress)
      setCurrentAddress(address)
      reset(address)
    } else {
      successToast({
        description: "Address created successfully."
      })
      if (addressType === "buyer") {
        router.replace(`/buyers/${parentId}/addresses/${createdAddress.ID}`)
      } else if (addressType === "supplier") {
        router.replace(`/suppliers/${parentId}/addresses/${createdAddress.ID}`)
      } else {
        router.replace(`/settings/adminaddresses/${createdAddress.ID}`)
      }
    }
  }

  async function updateAddress(fields: IAdminAddress) {
    const diff = getObjectDiff(currentAddress, fields)
    const updatedAddress = await updateOrderCloudAddress(diff)
    if (onUpdate) {
      await onUpdate(updatedAddress)
    } else {
      successToast({
        description: "Address updated successfully"
      })
    }
    setCurrentAddress(updatedAddress)
    reset(updatedAddress)
  }

  async function onSubmit(fields: IAdminAddress) {
    if (isCreating) {
      await createAddress(fields)
    } else {
      await updateAddress(fields)
    }
  }

  const handleSubmitPreventBubbling = async (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    await handleSubmit(onSubmit)(event)
  }

  const formFields = (
    <>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl
          name="FirstName"
          label="First Name"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="LastName"
          label="Last Name"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl
          name="AddressName"
          label="Address Name"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="CompanyName"
          label="Company Name"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl
          name="Street1"
          label="Street 1"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="Street2"
          label="Street 2"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr 1fr"}}>
        <InputControl
          name="City"
          label="City"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="State"
          label="State"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="Zip"
          label="Zip"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl
          name="Country"
          label="Country"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
        <InputControl
          name="Phone"
          label="Phone"
          control={control}
          validationSchema={validationSchema}
          isDisabled={!isAddressManager}
        />
      </SimpleGrid>
    </>
  )

  return variant === "default" ? (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={isAddressManager}>
            <ButtonGroup>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
            </ButtonGroup>
          </ProtectedContent>
        </CardHeader>
        <CardBody
          display="flex"
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
          maxW="container.lg"
        >
          {formFields}
        </CardBody>
      </Card>
    </Container>
  ) : (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
        <ModalHeader>{isCreating ? "Create" : "Update"}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{formFields}</ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button onClick={onClose}>Cancel</Button>
          <ButtonGroup>
            <ResetButton control={control} reset={reset} variant="outline">
              Discard Changes
            </ResetButton>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Submit
            </SubmitButton>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
