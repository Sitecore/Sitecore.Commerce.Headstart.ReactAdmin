import {TableContainer, Table, Tbody, Tr, Td, Heading, Switch} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {startCase} from "lodash"
import {useState} from "react"
import {textHelper} from "utils"

interface AdminPermissionTableProps {
  assignedPermissions?: string[]
  onPermissionChange: (permissions: string[]) => void
}
export function AdminPermissionTable(props: AdminPermissionTableProps) {
  const isAdminUserManager = useHasAccess(appPermissions.AdminUserManager)
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
    <TableContainer padding={4} maxWidth={"lg"}>
      <Table>
        <Tbody>
          <Tr>
            <Td colSpan={2}>
              <Heading size="md">Permissions</Heading>
            </Td>
          </Tr>
          {allPermissions.map((permission) => (
            <Tr key={permission}>
              <Td>{startCase(permission)}</Td>
              <Td textAlign="right">
                <Switch
                  colorScheme={"primary"}
                  isChecked={assignedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                  isDisabled={!isAdminUserManager}
                ></Switch>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
