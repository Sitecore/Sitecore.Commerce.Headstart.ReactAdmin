import {Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react"
import {ApiRole} from "ordercloud-javascript-sdk"
import {SecurityProfileSummary} from "./SecurityProfileSummary"
import {orderCloudRoles} from "constants/ordercloud-roles"
import {SecurityProfileAssignmentLevel} from "types/ordercloud/SecurityProfileAssignmentLevel"
import {SecurityProfileAssignmentList} from "./SecurityProfileAssignmentList"
import {OverlayScrollbarsComponent} from "overlayscrollbars-react"
import {useController} from "react-hook-form"

interface SecurityProfileAssignmentsProps {
  assignedRoles?: string[] // assigned roles including both api roles and custom roles
  assignmentLevel: SecurityProfileAssignmentLevel
  assignmentLevelId: string
  commerceRole: "buyer" | "supplier" | "admin"
  parentId?: string
  control: any
  showAssignedTab: boolean
}
export function SecurityProfileAssignmentTabs({
  assignedRoles = [],
  assignmentLevel,
  commerceRole,
  assignmentLevelId,
  parentId,
  control,
  showAssignedTab
}: SecurityProfileAssignmentsProps) {
  const apiRoles = assignedRoles.filter((role: ApiRole) => orderCloudRoles.includes(role)) as ApiRole[]
  const customRoles = assignedRoles.filter((role: ApiRole) => !orderCloudRoles.includes(role))
  const {
    field: {value: assignments, onChange: onAssignmentsChange}
  } = useController({control, name: "SecurityProfileAssignments"})

  return (
    <>
      <Tabs variant="enclosed" width="full">
        <TabList>
          {showAssignedTab && <Tab>Assigned Roles</Tab>}
          <Tab>Security Profile Assignments</Tab>
        </TabList>
        <TabPanels>
          {showAssignedTab && (
            <TabPanel>
              <Text fontStyle="italic" color="gray.500" marginBottom={5}>
                A flat view of all of the roles assigned to the user, regardless of which level they are assigned at
              </Text>
              <SecurityProfileSummary roles={apiRoles} customRoles={customRoles} commerceRole={commerceRole} />
            </TabPanel>
          )}
          <TabPanel
            as={OverlayScrollbarsComponent}
            defer
            options={{
              overflow: {
                x: "hidden",
                y: "scroll"
              }
            }}
            h={"50vh"}
          >
            <Text fontStyle="italic" color="gray.500" marginBottom={5}>
              A list of the assigned security profiles. Only the security profiles that are assigned at the current
              level can be modified. Inherited assignments must be modified at the level they are assigned at.
            </Text>
            <SecurityProfileAssignmentList
              assignments={assignments}
              onAssignmentsChange={onAssignmentsChange}
              assignmentLevel={assignmentLevel}
              commerceRole={commerceRole}
              parentId={parentId}
              assignmentLevelId={assignmentLevelId}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
