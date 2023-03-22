import * as Yup from "yup"
import {Box, Button, ButtonGroup, Card, Flex, Stack} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "components/react-hook-form"
import {UserGroup} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"

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
  const {successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<UserGroup>(
    userGroup,
    formShape,
    createUserGroup,
    updateUserGroup
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting, isValid, isDirty},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues})

  let parentId
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid

  async function createUserGroup(fields: UserGroup) {
    await ocService.Create(parentId, fields)
    successToast({
      description: "User Group created successfully."
    })
    router.back()
  }

  async function updateUserGroup(fields: UserGroup) {
    await ocService.Save(parentId, router.query.usergroupid, fields)
    successToast({
      description: "User Group updated successfully."
    })
    router.back()
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <InputControl name="Name" label="User Group Name" control={control} isRequired />
              <TextareaControl name="Description" label="Description" control={control} />
              <ButtonGroup>
                <Button
                  variant="primaryButton"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !isDirty}
                >
                  Save
                </Button>
                <Button onClick={reset} type="reset" variant="secondaryButton" isLoading={isSubmitting}>
                  Reset
                </Button>
                <Button onClick={() => router.back()} variant="secondaryButton" isLoading={isSubmitting}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        </Flex>
      </Card>
    </>
  )
}
