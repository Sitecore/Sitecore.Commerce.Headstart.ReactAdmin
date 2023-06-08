import * as Yup from "yup"
import {Box, Button, ButtonGroup, Card, CardBody, CardHeader, Container, Flex, Stack} from "@chakra-ui/react"
import {InputControl, NumberInputControl, SelectControl, SwitchControl} from "components/react-hook-form"
import {Buyer, Buyers, Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IBuyer} from "types/ordercloud/IBuyer"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  buyer?: Buyer
}

function CreateUpdateForm({buyer}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required"),
    xp_MarkupPercent: Yup.number()
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<Buyer>(
    buyer,
    formShape,
    createBuyer,
    updateBuyer
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  const [catalogs, setCatalogs] = useState([] as Catalog[])

  useEffect(() => {
    initCatalogsData()
  }, [])

  async function initCatalogsData() {
    const response = await Catalogs?.List<ICatalog>()
    setCatalogs(response?.Items)
  }

  async function createBuyer(fields: Buyer) {
    await Buyers?.Create<IBuyer>(fields)
    successToast({
      description: "Buyer created successfully."
    })
    router.push(".")
  }

  async function updateBuyer(fields: Buyer) {
    await Buyers.Save<IBuyer>(fields.ID, fields)
    successToast({
      description: "Buyer updated successfully."
    })
    router.push(".")
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card>
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
        <CardBody
          display="flex"
          flexDirection={"column"}
          as="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          gap={4}
          maxW={{xl: "container.md"}}
        >
          <SwitchControl name="Active" label="Active" control={control} />
          <InputControl name="Name" label="Buyer Name" control={control} isRequired />
          <SelectControl
            name="DefaultCatalogID"
            label="Default Catalog"
            selectProps={{placeholder: "Select option"}}
            control={control}
          >
            {catalogs.map((catalog) => (
              <option value={catalog.ID} key={catalog.ID}>
                {catalog.Name}
              </option>
            ))}
          </SelectControl>
          <NumberInputControl name="xp_MarkupPercent" label="Markup percent" control={control} />
          <InputControl name="xp_URL" label="Url" control={control} />
          {!isCreating && <InputControl name="DateCreated" label="Date Created" control={control} isReadOnly />}
        </CardBody>
      </Card>
    </Container>
  )
}
