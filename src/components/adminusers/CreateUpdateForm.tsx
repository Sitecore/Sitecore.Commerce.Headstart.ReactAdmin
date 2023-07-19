import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  SimpleGrid,
  theme,
  VStack
} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {AdminUserGroups, AdminUsers, User} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {useState} from "react"
import {isEqual, sortBy, difference, pick} from "lodash"
import {IAdminUser} from "types/ordercloud/IAdminUser"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import {AdminPermissionTable} from "./AdminPermissionTable"
import {string, boolean} from "yup"
import {getObjectDiff} from "utils"

export {CreateUpdateForm}
interface CreateUpdateFormProps {
  user?: User
  assignedPermissions?: string[]
}
function CreateUpdateForm({user, assignedPermissions}: CreateUpdateFormProps) {
  const [originaluser, setOriginalUser] = useState(user)

  let router = useRouter()
  const formShape = {
    Username: string().max(100).required("Username is required"),
    FirstName: string().required("First Name is required"),
    LastName: string().required("Last Name is required"),
    Email: string().email("Email is invalid").required("Email is required"),
    Phone: string(),
    Active: boolean()
  }

  const [permissions, setPermissions] = useState(assignedPermissions || [])

  const handlePermissionChange = (updatedPermissions: string[]) => {
    setPermissions(updatedPermissions)
  }

  const {successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<User>(
    user,
    formShape,
    createUser,
    updateUser
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  async function createUser(fields: User) {
    const createdUser = await AdminUsers.Create<IAdminUser>(fields)
    setOriginalUser(createdUser)
    const permissionsToAdd = permissions.map((permission) =>
      AdminUserGroups.SaveUserAssignment({UserGroupID: permission, UserID: createdUser.ID})
    )
    await Promise.all(permissionsToAdd)
    successToast({
      description: "User created successfully."
    })
    router.back()
  }

  async function updateUser(fields: User) {
    const formFields = Object.keys(formShape)
    const diff = getObjectDiff(originaluser, pick(fields, formFields))
    const updatedUser = await AdminUsers.Patch<IAdminUser>(fields.ID, diff)
    setOriginalUser(updatedUser)
    const permissionsChanged = !isEqual(sortBy(assignedPermissions), sortBy(permissions))
    let successMessage = "User updated successfully."
    if (permissionsChanged) {
      const permissionsToAdd = difference(permissions, assignedPermissions).map((permission) =>
        AdminUserGroups.SaveUserAssignment({UserGroupID: permission, UserID: updatedUser.ID})
      )
      const permissionsToRemove = difference(assignedPermissions, permissions).map((permission) =>
        AdminUserGroups.DeleteUserAssignment(permission, updatedUser.ID)
      )

      await Promise.all([...permissionsToAdd, ...permissionsToRemove])
      successMessage += " Please note, user will need to log out and back in for permission changes to take effect."
    }
    successToast({
      description: successMessage
    })
    router.back()
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
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
          flexWrap={{base: "wrap", lg: "nowrap"}}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
        >
          <VStack flexBasis={"container.lg"} gap={4} maxW={{xl: "container.md"}}>
            <SwitchControl name="Active" label="Active" control={control} />
            <InputControl name="Username" label="Username" control={control} isRequired />
            <SimpleGrid gap={4} w="100%" gridTemplateColumns={{lg: "1fr 1fr"}}>
              <InputControl name="FirstName" label="First name" control={control} isRequired />
              <InputControl name="LastName" label="Last name" control={control} isRequired />
              <InputControl name="Email" label="Email" control={control} isRequired />
              <InputControl name="Phone" label="Phone" control={control} />
            </SimpleGrid>
          </VStack>
          <Box border={`1px solid ${theme.colors.gray[200]}`} flexGrow="1" borderRadius="md">
            <AdminPermissionTable
              onPermissionChange={handlePermissionChange}
              assignedPermissions={assignedPermissions || []}
            />
          </Box>
        </CardBody>
      </Card>
    </Container>
  )
}
