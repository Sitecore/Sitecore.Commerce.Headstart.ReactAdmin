import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, SelectControl, SwitchControl} from "components/react-hook-form"
import {Buyers, Catalogs} from "ordercloud-javascript-sdk"
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

interface BuyerFormProps {
  buyer?: IBuyer
}
export function BuyerForm({buyer}: BuyerFormProps) {
  const [currentBuyer, setCurrentBuyer] = useState(buyer)
  const [isCreating, setIsCreating] = useState(!buyer?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentBuyer?.ID)
  }, [currentBuyer?.ID])

  const defaultValues: Partial<IBuyer> = {
    Active: true
  }

  const validationSchema = object().shape({
    Active: boolean(),
    Name: string().required("Name is required"),
    DefaultCatalogID: string(),
    xp: object().shape({
      MarkupPercent: number(),
      URL: string()
    })
  })

  const {handleSubmit, control, reset} = useForm<IBuyer>({
    resolver: yupResolver(validationSchema),
    defaultValues: buyer || defaultValues,
    mode: "onBlur"
  })

  async function createBuyer(fields: IBuyer) {
    const createdBuyer = await Buyers?.Create<IBuyer>(fields)
    successToast({
      description: "Buyer created successfully."
    })
    router.push(`/buyers/${createdBuyer.ID}`)
  }

  async function updateBuyer(fields: IBuyer) {
    const diff = getObjectDiff(currentBuyer, fields)
    const updatedBuyer = await Buyers.Patch<IBuyer>(currentBuyer.ID, diff)
    successToast({
      description: "Buyer updated successfully."
    })
    setCurrentBuyer(updatedBuyer)
    reset(updatedBuyer)
  }

  async function onSubmit(fields: IBuyer) {
    if (isCreating) {
      await createBuyer(fields)
    } else {
      await updateBuyer(fields)
    }
  }

  const loadCatalogs = async (inputValue: string) => {
    const allCatalogs = await Catalogs.List<ICatalog>({
      search: inputValue,
      pageSize: 5
    })
    return allCatalogs.Items.map((catalog) => ({label: catalog.Name, value: catalog.ID}))
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.push("/buyers")} variant="outline" leftIcon={<TbChevronLeft />}>
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
          <InputControl name="Name" label="Buyer Name" control={control} validationSchema={validationSchema} />
          <SelectControl
            name="DefaultCatalogID"
            label="Default Catalog"
            selectProps={{
              placeholder: "Select option",
              loadOptions: loadCatalogs
            }}
            control={control}
            validationSchema={validationSchema}
          />

          {!isCreating && (
            <InputControl
              name="DateCreated"
              label="Date Created"
              control={control}
              validationSchema={validationSchema}
              isReadOnly
            />
          )}
        </CardBody>
      </Card>
    </Container>
  )
}
