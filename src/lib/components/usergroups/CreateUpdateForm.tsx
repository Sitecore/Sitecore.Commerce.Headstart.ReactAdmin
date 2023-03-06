import * as Yup from "yup"
import {Box, Button, ButtonGroup, Card, Flex, Stack} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "formik-chakra-ui"
import {Formik} from "formik"
import {UserGroup} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  userGroup?: UserGroup
  ocService: any
}
function CreateUpdateForm({userGroup, ocService}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  }
  const {successToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<UserGroup>(
    userGroup,
    formShape,
    createUserGroup,
    updateUserGroup
  )

  let parentId
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid

  async function createUserGroup(fields: UserGroup) {
    await ocService.create(parentId, fields)
    successToast({
      description: "User Group created successfully."
    })
    router.back()
  }

  async function updateUserGroup(fields: UserGroup) {
    await ocService.update(parentId, router.query.usergroupid, fields)
    successToast({
      description: "Buyer updated successfully."
    })
    router.back()
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
                  <InputControl name="Name" label="User Group Name" />
                  <TextareaControl name="Description" label="Description" />
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
    </>
  )
}
