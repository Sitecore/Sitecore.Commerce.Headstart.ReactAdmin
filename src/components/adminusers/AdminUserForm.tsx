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
import {useEffect, useState} from "react"
import {isEqual, sortBy, difference} from "lodash"
import {IAdminUser} from "types/ordercloud/IAdminUser"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import {AdminPermissionTable} from "./AdminPermissionTable"
import {string, boolean, object} from "yup"
import {getObjectDiff} from "utils"
import {useSuccessToast} from "hooks/useToast"

interface AdminUserFormProps {
  user?: User
  assignedPermissions?: string[]
}
export function AdminUserForm({user, assignedPermissions}: AdminUserFormProps) {
  const [currentUser, setCurrentUser] = useState(user)
  const [isCreating, setIsCreating] = useState(!user?.ID)

  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentUser?.ID)
  }, [currentUser?.ID])

  const defaultValues = {
    Active: true
  }

  const validationSchema = object().shape({
    Username: string().max(100).required("Username is required"),
    FirstName: string().required("First Name is required"),
    LastName: string().required("Last Name is required"),
    Email: string().email("Email is invalid").required("Email is required"),
    Phone: string().nullable(),
    Active: boolean()
  })

  const [permissions, setPermissions] = useState(assignedPermissions || [])

  const handlePermissionChange = (updatedPermissions: string[]) => {
    setPermissions(updatedPermissions)
  }

  const {handleSubmit, control, reset} = useForm<IAdminUser>({
    resolver: yupResolver(validationSchema),
    defaultValues: user || defaultValues,
    mode: "onBlur"
  })

  async function createUser(fields: IAdminUser) {
    const createdUser = await AdminUsers.Create<IAdminUser>(fields)
    setCurrentUser(createdUser)
    const permissionsToAdd = permissions.map((permission) =>
      AdminUserGroups.SaveUserAssignment({UserGroupID: permission, UserID: createdUser.ID})
    )
    await Promise.all(permissionsToAdd)
    successToast({
      description: "User created successfully."
    })
    router.push(`/settings/adminusers/${createdUser.ID}`)
  }

  async function updateUser(fields: IAdminUser) {
    const diff = getObjectDiff(currentUser, fields)
    const updatedUser = await AdminUsers.Patch<IAdminUser>(fields.ID, diff)
    setCurrentUser(updatedUser)

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

    setCurrentUser(updatedUser)
    reset(updatedUser)
  }

  async function onSubmit(fields: IAdminUser) {
    if (isCreating) {
      await createUser(fields)
    } else {
      await updateUser(fields)
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
        <CardBody
          display="flex"
          flexWrap={{base: "wrap", lg: "nowrap"}}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
        >
          <VStack flexBasis={"container.lg"} gap={4} maxW={{xl: "container.md"}}>
            <SwitchControl name="Active" label="Active" control={control} validationSchema={validationSchema} />
            <InputControl name="Username" label="Username" control={control} validationSchema={validationSchema} />
            <SimpleGrid gap={4} w="100%" gridTemplateColumns={{lg: "1fr 1fr"}}>
              <InputControl name="FirstName" label="First name" control={control} validationSchema={validationSchema} />
              <InputControl name="LastName" label="Last name" control={control} validationSchema={validationSchema} />
              <InputControl name="Email" label="Email" control={control} validationSchema={validationSchema} />
              <InputControl name="Phone" label="Phone" control={control} validationSchema={validationSchema} />
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
