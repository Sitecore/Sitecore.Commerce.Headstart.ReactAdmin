import * as Yup from "yup"
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  theme,
  VStack
} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {Address, AdminAddresses} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {pick} from "lodash"
import {IAdminAddress} from "types/ordercloud/IAdminAddress"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import AdminUserXpCard from "../adminusers/AdminUserXpCard"

export {CreateUpdateForm}
interface CreateUpdateFormProps {
  address?: Address
}
function CreateUpdateForm({address}: CreateUpdateFormProps) {
  let router = useRouter()
  const formShape = {
    AddressName: Yup.string().max(100),
    CompanyName: Yup.string().max(100),
    FirstName: Yup.string().max(100),
    LastName: Yup.string().max(100),
    Street1: Yup.string().max(100).required(),
    Street2: Yup.string().max(100),
    City: Yup.string().max(100).required(),
    State: Yup.string().max(100).required(),
    Zip: Yup.string().max(100).required(),
    Country: Yup.string().max(2).min(2).required(),
    Phone: Yup.string().max(100)
  }

  const {successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<Address>(
    address,
    formShape,
    createAddress,
    updateAddress
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  async function createAddress(fields: Address) {
    await AdminAddresses.Create<IAdminAddress>(fields)
    successToast({
      description: "Address created successfully."
    })
    router.back()
  }

  async function updateAddress(fields: Address) {
    const formFields = Object.keys(formShape)
    await AdminAddresses.Patch<IAdminAddress>(fields.ID, pick(fields, formFields))
    successToast({
      description: "Address updated successfully"
    })
    router.back()
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="outline" isLoading={isSubmitting} leftIcon={<TbChevronLeft />}>
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
          as="form"
          alignItems={"flex-start"}
          justifyContent="space-between"
          onSubmit={handleSubmit(onSubmit)}
          gap={6}
          maxW="container.lg"
        >
          <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
            <InputControl name="FirstName" label="First Name" control={control} />
            <InputControl name="LastName" label="Last Name" control={control} />
          </SimpleGrid>
          <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
            <InputControl name="AddressName" label="Address Name" control={control} />
            <InputControl name="CompanyName" label="Company Name" control={control} />
          </SimpleGrid>
          <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
            <InputControl name="Street1" label="Street 1" control={control} isRequired />
            <InputControl name="Street2" label="Street 2" control={control} />
          </SimpleGrid>
          <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr 1fr"}}>
            <InputControl name="City" label="City" control={control} isRequired />
            <InputControl name="State" label="State" control={control} isRequired />
            <InputControl name="Zip" label="Zip" control={control} isRequired />
          </SimpleGrid>
          <SimpleGrid gap={4} w="100%" gridTemplateColumns={{md: "1fr 1fr"}}>
            <InputControl name="Country" label="Country" control={control} isRequired />
            <InputControl name="Phone" label="Phone" control={control} />
          </SimpleGrid>
        </CardBody>
      </Card>
    </Container>
  )
}
