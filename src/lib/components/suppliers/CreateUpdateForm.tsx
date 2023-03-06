import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, PercentComplete, SwitchControl} from "formik-chakra-ui"
import Card from "../card/Card"
import {Formik} from "formik"
import {Supplier} from "ordercloud-javascript-sdk"
import {suppliersService} from "../../api"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"

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
  const {isCreating, successToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<Supplier>(
    supplier,
    formShape,
    createSupplier,
    updateSupplier
  )

  async function createSupplier(fields: Supplier) {
    await suppliersService.create(fields)
    successToast({
      description: "Supplier created successfully."
    })
    router.push(".")
  }

  async function updateSupplier(fields: Supplier) {
    await suppliersService.update(fields)
    successToast({
      description: "Supplier updated successfully."
    })
    router.push(".")
  }

  return (
    <>
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
                  <InputControl name="Name" label="Supplier Name" />
                  <SwitchControl name="Active" label="Active" />
                  <SwitchControl name="AllBuyersCanOrder" label="All Buyers Can Order" />
                  {isCreating ? (
                    <PercentComplete />
                  ) : (
                    <InputControl name="DateCreated" label="Date created" isReadOnly />
                  )}
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
                      onClick={() => router.push("/suppliers")}
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
    </>
  )
}
