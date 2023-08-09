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
  SimpleGrid
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {InputControl} from "components/react-hook-form"
import {useRouter} from "hooks/useRouter"
import {SupplierAddresses} from "ordercloud-javascript-sdk"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {ISupplierAddress} from "types/ordercloud/ISupplierAddress"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {object, string} from "yup"
import {FormEvent, useEffect, useState} from "react"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"

interface SupplierAddressFormProps {
  address?: ISupplierAddress
  supplierId: string
  onCreate?: (address: ISupplierAddress) => void
  onUpdate?: (address: ISupplierAddress) => void
  variant?: "default" | "modal"
  isOpen?: boolean // only used when variant === "modal"
  onClose?: () => void // only used when variant === "modal"
  modalTitle?: string // only used when variant === "modal"
}
export function SupplierAddressForm({
  address,
  onCreate,
  onUpdate,
  variant = "default",
  isOpen,
  onClose,
  modalTitle,
  supplierId
}: SupplierAddressFormProps) {
  const [currentAddress, setCurrentAddress] = useState(address)
  const [isCreating, setIsCreating] = useState(!address?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentAddress?.ID)
  }, [currentAddress?.ID])

  const defaultValues = {}

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

  async function createAddress(fields: ISupplierAddress) {
    const createdAddress = await SupplierAddresses.Create<ISupplierAddress>(supplierId, fields)
    if (onCreate) {
      await onCreate(createdAddress)
      setCurrentAddress(address)
      reset(address)
    } else {
      successToast({
        description: "Address created successfully."
      })
      router.push(`/suppliers/${supplierId}/addresses/${createdAddress.ID}`)
    }
  }

  async function updateAddress(fields: ISupplierAddress) {
    const diff = getObjectDiff(currentAddress, fields)
    const updatedAddress = await SupplierAddresses.Patch<ISupplierAddress>(supplierId, fields.ID, diff)
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

  async function onSubmit(fields: ISupplierAddress) {
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
        <InputControl name="FirstName" label="First Name" control={control} validationSchema={validationSchema} />
        <InputControl name="LastName" label="Last Name" control={control} validationSchema={validationSchema} />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl name="AddressName" label="Address Name" control={control} validationSchema={validationSchema} />
        <InputControl name="CompanyName" label="Company Name" control={control} validationSchema={validationSchema} />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl name="Street1" label="Street 1" control={control} validationSchema={validationSchema} />
        <InputControl name="Street2" label="Street 2" control={control} validationSchema={validationSchema} />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr 1fr"}}>
        <InputControl name="City" label="City" control={control} validationSchema={validationSchema} />
        <InputControl name="State" label="State" control={control} validationSchema={validationSchema} />
        <InputControl name="Zip" label="Zip" control={control} validationSchema={validationSchema} />
      </SimpleGrid>
      <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
        <InputControl name="Country" label="Country" control={control} validationSchema={validationSchema} />
        <InputControl name="Phone" label="Phone" control={control} validationSchema={validationSchema} />
      </SimpleGrid>
    </>
  )

  return variant === "default" ? (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="outline" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ButtonGroup>
            <ResetButton control={control} reset={reset} variant="outline">
              Discard Changes
            </ResetButton>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Save
            </SubmitButton>
          </ButtonGroup>
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
        <ModalHeader>{modalTitle}</ModalHeader>
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
