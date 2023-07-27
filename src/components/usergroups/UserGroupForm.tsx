import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "components/react-hook-form"
import {AdminUserGroups, SupplierUserGroups, UserGroup, UserGroups} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import {object, string} from "yup"
import {useEffect, useState} from "react"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"

interface UserGroupFormFormProps {
  userGroup?: UserGroup
  userGroupService: typeof UserGroups | typeof AdminUserGroups | typeof SupplierUserGroups
}
export function UserGroupFormForm({userGroup, userGroupService}: UserGroupFormFormProps) {
  const [currentUserGroup, setCurrentUserGroup] = useState(userGroup)
  const [isCreating, setIsCreating] = useState(!userGroup?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentUserGroup?.ID)
  }, [currentUserGroup?.ID])

  const defaultValues: Partial<UserGroup> = {}

  const validationSchema = object().shape({
    Name: string().max(100).required("Name is required"),
    Description: string().nullable().max(100)
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: userGroup || defaultValues,
    mode: "onBlur"
  })

  let parentId: any
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid.toString()
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid.toString()
  const userGroupId = router.query.usergroupid.toString() as any

  async function createUserGroup(fields: UserGroup) {
    const createdUserGroup = await userGroupService.Create(parentId, fields)
    successToast({
      description: "User Group created successfully."
    })
    setCurrentUserGroup(createdUserGroup)
    reset(createdUserGroup)
  }

  async function updateUserGroup(fields: UserGroup) {
    const diff = getObjectDiff(currentUserGroup, fields)
    const updatedUserGroup = await userGroupService.Patch(parentId, userGroupId, diff)
    successToast({
      description: "User Group updated successfully."
    })
    setCurrentUserGroup(updatedUserGroup)
    reset(updatedUserGroup)
  }

  async function onSubmit(fields: UserGroup) {
    if (isCreating) {
      await createUserGroup(fields)
    } else {
      await updateUserGroup(fields)
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="outline" leftIcon={<TbChevronLeft />}>
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
          <InputControl name="Name" label="User Group Name" control={control} validationSchema={validationSchema} />
          <TextareaControl
            name="Description"
            label="Description"
            control={control}
            validationSchema={validationSchema}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
