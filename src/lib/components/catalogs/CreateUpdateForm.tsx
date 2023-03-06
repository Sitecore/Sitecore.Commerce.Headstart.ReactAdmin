import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, SwitchControl, TextareaControl} from "formik-chakra-ui"
import Card from "../card/Card"
import {Catalog} from "ordercloud-javascript-sdk"
import {Formik} from "formik"
import {catalogsService} from "lib/api"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  catalog?: Catalog
}
function CreateUpdateForm({catalog}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  }
  const {isCreating, successToast, errorToast, validationSchema, initialValues, onSubmit} =
    useCreateUpdateForm<Catalog>(catalog, formShape, createCatalog, updateCatalog)

  async function createCatalog(fields: Catalog) {
    const createdCatalog = await catalogsService.create(fields)
    await catalogsService.saveAssignment(router.query.buyerid, createdCatalog.ID)
    successToast({
      description: "Catalog created successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs`)
  }

  async function updateCatalog(fields: Catalog) {
    const updatedCatalog = await catalogsService.update(fields)
    await catalogsService.saveAssignment(router.query.buyerid, updatedCatalog.ID)
    successToast({
      description: "Catalog updated successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs`)
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
                <InputControl name="Name" label="Catalog Name" />
                <TextareaControl name="Description" label="Description" />
                <SwitchControl name="Active" label="Active" />
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
                  <Button
                    onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
                    variant="secondaryButton"
                    isLoading={isSubmitting}
                  >
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
