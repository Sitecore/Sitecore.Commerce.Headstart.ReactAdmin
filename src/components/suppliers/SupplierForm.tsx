import {Card, Button, ButtonGroup, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {Suppliers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ISupplier} from "types/ordercloud/ISupplier"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import {boolean, object, string} from "yup"
import {useEffect, useState} from "react"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"

interface SupplierFormProps {
  supplier?: ISupplier
}

export function SupplierForm({supplier}: SupplierFormProps) {
  const [currentSupplier, setCurrentSupplier] = useState(supplier)
  const [isCreating, setIsCreating] = useState(!supplier?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentSupplier?.ID)
  }, [currentSupplier?.ID])

  const defaultValues = {
    Active: true
  }

  const validationSchema = object().shape({
    Name: string().required("Name is required"),
    Active: boolean(),
    AllBuyersCanOrder: boolean()
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: supplier || defaultValues,
    mode: "onBlur"
  })

  async function createSupplier(fields: ISupplier) {
    const createdSupplier = await Suppliers.Create<ISupplier>(fields)
    successToast({
      description: "Supplier created successfully."
    })
    router.push(`/suppliers/${createdSupplier.ID}`)
  }

  async function updateSupplier(fields: ISupplier) {
    const diff = getObjectDiff(currentSupplier, fields)
    const createdSupplier = await Suppliers.Patch<ISupplier>(fields.ID, diff)
    successToast({
      description: "Supplier updated successfully."
    })
    setCurrentSupplier(createdSupplier)
    reset(createdSupplier)
  }

  async function onSubmit(fields: ISupplier) {
    if (isCreating) {
      await createSupplier(fields)
    } else {
      await updateSupplier(fields)
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.push("/suppliers")} variant="outline" leftIcon={<TbChevronLeft />}>
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
          <SwitchControl name="Active" label="Active" control={control} validationSchema={validationSchema} />
          <InputControl name="Name" label="Supplier Name" control={control} validationSchema={validationSchema} />
          <SwitchControl
            name="AllBuyersCanOrder"
            label="All Buyers Can Order"
            control={control}
            validationSchema={validationSchema}
          />
          {!isCreating && (
            <InputControl
              name="DateCreated"
              label="Date created"
              isReadOnly
              control={control}
              validationSchema={validationSchema}
            />
          )}
        </CardBody>
      </Card>
    </Container>
  )
}
