import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, NumberInputControl, SelectControl, SwitchControl} from "components/react-hook-form"
import {Buyer, Buyers, Catalog, Catalogs} from "ordercloud-javascript-sdk"
import Card from "../card/Card"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IBuyer} from "types/ordercloud/IBuyer"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"

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
    formState: {isSubmitting, isValid, isDirty},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues})

  const [catalogs, setCatalogs] = useState([] as Catalog[])

  useEffect(() => {
    initCatalogsData()
  }, [])

  async function initCatalogsData() {
    const response = await Catalogs.List<ICatalog>()
    setCatalogs(response.Items)
  }

  async function createBuyer(fields: Buyer) {
    await Buyers.Create<IBuyer>(fields)
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
    <Card variant="primaryCard">
      <Flex flexDirection="column" p="10">
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={5}>
            <InputControl name="Name" label="Buyer Name" control={control} isRequired />
            <SwitchControl name="Active" label="Active" control={control} />
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

            {!isCreating && <InputControl name="DateCreated" label="Date created" control={control} isReadOnly />}
            <ButtonGroup>
              <Button variant="primaryButton" type="submit" isLoading={isSubmitting} isDisabled={!isValid || !isDirty}>
                Save
              </Button>
              <Button onClick={reset} type="reset" variant="secondaryButton" isLoading={isSubmitting}>
                Reset
              </Button>
              <Button onClick={() => router.push("/buyers")} variant="secondaryButton" isLoading={isSubmitting}>
                Cancel
              </Button>
            </ButtonGroup>
          </Stack>
        </Box>
      </Flex>
    </Card>
  )
}
