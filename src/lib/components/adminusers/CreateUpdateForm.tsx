import * as Yup from "yup"
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  Stack,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr
} from "@chakra-ui/react"
import {Formik} from "formik"
import {InputControl, SwitchControl} from "formik-chakra-ui"
import Card from "../card/Card"
import {AdminUserGroups, AdminUsers, User} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"
import {useState} from "react"
import {textHelper} from "lib/utils"
import {appPermissions} from "lib/constants/app-permissions.config"
import {isEqual, sortBy, difference, pick} from "lodash"

interface PermissionTableProps {
  assignedPermissions?: string[]
  onPermissionChange: (permissions: string[]) => void
}
const PermissionsTable = (props: PermissionTableProps) => {
  const allPermissions = Object.keys(appPermissions)
  const [assignedPermissions, setAssignedPermissions] = useState(props.assignedPermissions || [])

  const handlePermissionChange = (permission: string) => {
    let updatedPermissions = []
    if (assignedPermissions.includes(permission)) {
      updatedPermissions = assignedPermissions.filter((p) => p !== permission)
    } else {
      updatedPermissions = [...assignedPermissions, permission]
    }
    setAssignedPermissions(updatedPermissions)
    props.onPermissionChange(updatedPermissions)
  }

  return (
    <TableContainer padding={5} backgroundColor="bodyBg" maxWidth={600}>
      <Table>
        <Tbody>
          <Tr>
            <Td colSpan={2}>
              <Heading size="md">Permissions</Heading>
            </Td>
          </Tr>
          {allPermissions.map((permission) => (
            <Tr key={permission}>
              <Td>{textHelper.camelCaseToTitleCase(permission)}</Td>
              <Td textAlign="right">
                <Switch
                  isChecked={assignedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                ></Switch>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}

export {CreateUpdateForm}
interface CreateUpdateFormProps {
  user?: User
  assignedPermissions?: string[]
}
function CreateUpdateForm({user, assignedPermissions}: CreateUpdateFormProps) {
  let router = useRouter()
  const formShape = {
    Username: Yup.string().max(100).required("Username is required"),
    FirstName: Yup.string().required("First Name is required"),
    LastName: Yup.string().required("Last Name is required"),
    Email: Yup.string().email("Email is invalid").required("Email is required"),
    Phone: Yup.string(),
    Active: Yup.boolean()
  }

  const [permissions, setPermissions] = useState(assignedPermissions || [])

  const handlePermissionChange = (updatedPermissions: string[]) => {
    setPermissions(updatedPermissions)
  }

  const {successToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<User>(
    user,
    formShape,
    createUser,
    updateUser
  )

  async function createUser(fields: User) {
    const createdUser = await AdminUsers.Create(fields)
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
    const updatedUser = await AdminUsers.Patch(fields.ID, pick(fields, formFields))
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
                <InputControl name="Username" label="Username" />
                <InputControl name="FirstName" label="First name" />
                <InputControl name="LastName" label="Last name" />
                <InputControl name="Email" label="Email" />
                <InputControl name="Phone" label="Phone" />
                <SwitchControl name="Active" label="Active" marginBottom={5} />
                <PermissionsTable
                  onPermissionChange={handlePermissionChange}
                  assignedPermissions={assignedPermissions || []}
                />
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
