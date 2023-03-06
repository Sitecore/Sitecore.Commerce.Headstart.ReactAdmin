import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {Formik} from "formik"
import {InputControl} from "formik-chakra-ui"
import Card from "../card/Card"
import {Address, AdminAddresses} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"
import {pick} from "lodash"

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

  const {successToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<Address>(
    address,
    formShape,
    createAddress,
    updateAddress
  )

  async function createAddress(fields: Address) {
    await AdminAddresses.Create(fields)
    successToast({
      description: "Address created successfully."
    })
    router.back()
  }

  async function updateAddress(fields: Address) {
    const formFields = Object.keys(formShape)
    await AdminAddresses.Patch(fields.ID, pick(fields, formFields))
    successToast({
      description: "Address updated successfully"
    })
    router.back()
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
                <InputControl name="AddressName" label="Address Name" />
                <InputControl name="CompanyName" label="Company Name" />
                <InputControl name="FirstName" label="First Name" />
                <InputControl name="LastName" label="Last Name" />
                <InputControl name="Street1" label="Street 1" />
                <InputControl name="Street2" label="Street 2" />
                <InputControl name="City" label="City" />
                <InputControl name="State" label="State" />
                <InputControl name="Zip" label="Zip" />
                <InputControl name="Country" label="Country" />
                <InputControl name="Phone" label="Phone" />
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
                  <Button onClick={() => router.back()} variant="secondaryButton" isLoading={isSubmitting}>
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
