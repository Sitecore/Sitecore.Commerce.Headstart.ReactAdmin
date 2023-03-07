import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, NumberInputControl, PercentComplete, SelectControl, SwitchControl} from "components/formik"
import {Buyer, Buyers, Catalog, Catalogs} from "ordercloud-javascript-sdk"
import Card from "../card/Card"
import {Formik} from "formik"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {useEffect, useState} from "react"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IBuyer} from "types/ordercloud/IBuyer"

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
  const {isCreating, successToast, errorToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<Buyer>(
    buyer,
    formShape,
    createBuyer,
    updateBuyer
  )
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
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
          {({
            // most of the useful available Formik props
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm
          }) => (
            <Box as="form" onSubmit={handleSubmit as any}>
              <Stack spacing={5}>
                <InputControl name="Name" label="Buyer Name" />
                <SwitchControl name="Active" label="Active" />
                <SelectControl
                  name="DefaultCatalogID"
                  label="Default Catalog"
                  selectProps={{placeholder: "Select option"}}
                >
                  {catalogs.map((catalog) => (
                    <option value={catalog.ID} key={catalog.ID}>
                      {catalog.Name}
                    </option>
                  ))}
                </SelectControl>
                <NumberInputControl name="xp_MarkupPercent" label="Markup percent" />
                <InputControl name="xp_URL" label="Url" />

                {isCreating ? <PercentComplete /> : <InputControl name="DateCreated" label="Date created" isReadOnly />}
                <ButtonGroup>
                  <Button variant="primaryButton" type="submit" isLoading={isSubmitting}>
                    Save
                  </Button>
                  <Button
                    onClick={() => {
                      resetForm()
                    }}
                    type="reset"
                    variant="secondaryButton"
                    isLoading={isSubmitting}
                  >
                    Reset
                  </Button>
                  <Button onClick={() => router.push("/buyers")} variant="secondaryButton" isLoading={isSubmitting}>
                    Cancel
                  </Button>
                </ButtonGroup>
              </Stack>
            </Box>
          )}
        </Formik>
      </Flex>
    </Card>
  )
}
