import * as Yup from "yup"
import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "components/react-hook-form"
import {UserGroup} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"

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
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

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
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="outline" isLoading={isSubmitting} leftIcon={<TbChevronLeft />}>
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
          onSubmit={handleSubmit(onSubmit)}
          gap={4}
          maxW={{xl: "container.md"}}
        >
          <InputControl name="Name" label="User Group Name" control={control} isRequired />
          <TextareaControl name="Description" label="Description" control={control} />
        </CardBody>
      </Card>
    </Container>
  )
}
