import * as Yup from "yup"
import {Card, Button, ButtonGroup, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {Supplier, Suppliers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {ISupplier} from "types/ordercloud/ISupplier"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  supplier?: Supplier
}

function CreateUpdateForm({supplier}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required"),
    Active: Yup.bool(),
    AllBuyersCanOrder: Yup.bool()
  }
  const {isCreating, successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<Supplier>(
    supplier,
    formShape,
    createSupplier,
    updateSupplier
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  async function createSupplier(fields: Supplier) {
    await Suppliers.Create<ISupplier>(fields)
    successToast({
      description: "Supplier created successfully."
    })
    router.push(".")
  }

  async function updateSupplier(fields: Supplier) {
    await Suppliers.Save<ISupplier>(fields.ID, fields)
    successToast({
      description: "Supplier updated successfully."
    })
    router.push(".")
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button
            onClick={() => router.push("/suppliers")}
            variant="outline"
            isLoading={isSubmitting}
            leftIcon={<TbChevronLeft />}
          >
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
        <CardBody display="flex" flexDirection={"column"} gap={4} maxW={{xl: "container.md"}}>
          <InputControl name="Name" label="Supplier Name" control={control} isRequired />
          <SwitchControl name="Active" label="Active" control={control} />
          <SwitchControl name="AllBuyersCanOrder" label="All Buyers Can Order" control={control} />
          {!isCreating && <InputControl name="DateCreated" label="Date created" isReadOnly control={control} />}
        </CardBody>
      </Card>
    </Container>
  )
}

// <>
//   <Card variant="primaryCard">
//     <Flex flexDirection="column" p="10">
//       <Box as="form" onSubmit={handleSubmit(onSubmit)}>
//         <Stack spacing={5}>
// <InputControl name="Name" label="Supplier Name" control={control} isRequired />
// <SwitchControl name="Active" label="Active" control={control} />
// <SwitchControl name="AllBuyersCanOrder" label="All Buyers Can Order" control={control} />
// {!isCreating && <InputControl name="DateCreated" label="Date created" isReadOnly control={control} />}
//           <ButtonGroup>
//             <SubmitButton control={control} variant="solid" colorScheme="primary">
//               Save
//             </SubmitButton>
//             <ResetButton control={control} reset={reset} variant="outline">
//               Discard Changes
//             </ResetButton>
//             <Button onClick={() => router.push("/suppliers")} variant="outline" isLoading={isSubmitting}>
//               Cancel
//             </Button>
//           </ButtonGroup>
//         </Stack>
//       </Box>
//     </Flex>
//   </Card>
// </>
