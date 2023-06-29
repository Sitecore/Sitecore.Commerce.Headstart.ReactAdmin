import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, SelectControl, SwitchControl} from "components/react-hook-form"
import {Buyer, Buyers, Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IBuyer} from "types/ordercloud/IBuyer"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import {boolean, number, object, string} from "yup"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"

interface CreateUpdateBuyerProps {
  initialBuyer?: IBuyer
}
export function CreateUpdateBuyer({initialBuyer}: CreateUpdateBuyerProps) {
  const [buyer, setBuyer] = useState(initialBuyer)
  const [isCreating, setIsCreating] = useState(!buyer?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    console.log("hit")
    setIsCreating(!buyer?.ID)
  }, [buyer?.ID])

  const defaultValues = {
    Active: true,
    Name: "",
    DefaultCatalogID: "",
    xp: {
      MarkupPercent: 0,
      URL: ""
    }
  } as any

  const validationSchema = object().shape({
    Active: boolean(),
    Name: string().required("Name is required"),
    DefaultCatalogID: string(),
    xp: object().shape({
      MarkupPercent: number(),
      URL: string()
    })
  })

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues: buyer || defaultValues, mode: "onBlur"})

  const [catalogs, setCatalogs] = useState([] as Catalog[])

  useEffect(() => {
    initCatalogsData()
  }, [])

  async function initCatalogsData() {
    const response = await Catalogs?.List<ICatalog>()
    setCatalogs(response?.Items)
  }

  async function createBuyer(fields: Buyer) {
    const createdBuyer = await Buyers?.Create<IBuyer>(fields)
    successToast({
      description: "Buyer created successfully."
    })
    router.push(`/buyers/${createdBuyer.ID}`)
  }

  async function updateBuyer(fields: Buyer) {
    const diff = getObjectDiff(buyer, fields)
    const updatedBuyer = await Buyers.Patch<IBuyer>(buyer.ID, diff)
    successToast({
      description: "Buyer updated successfully."
    })
    setBuyer(updatedBuyer)
    reset(updatedBuyer)
  }

  async function onSubmit(buyer: IBuyer) {
    if (isCreating) {
      await createBuyer(buyer)
    } else {
      await updateBuyer(buyer)
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button
            onClick={() => router.push("/buyers")}
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
          <SwitchControl name="Active" label="Active" control={control} />
          <InputControl name="Name" label="Buyer Name" control={control} isRequired />
          <SelectControl
            name="DefaultCatalogID"
            label="Default Catalog"
            selectProps={{
              placeholder: "Select option",
              options: catalogs.map(({ID, Name}) => ({value: ID, label: Name}))
            }}
            control={control}
          />

          {!isCreating && <InputControl name="DateCreated" label="Date Created" control={control} isReadOnly />}
        </CardBody>
      </Card>
    </Container>
  )
}
