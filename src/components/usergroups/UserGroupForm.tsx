import {Button, ButtonGroup, Card, CardBody, CardHeader, Container, Divider} from "@chakra-ui/react"
import {InputControl, TextareaControl} from "components/react-hook-form"
import {
  AdminUserGroups,
  PartialDeep,
  SecurityProfileAssignment,
  SecurityProfiles,
  SupplierUserGroups,
  UserGroup,
  UserGroups
} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import {array, object, string} from "yup"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {differenceBy, isEmpty, isEqual} from "lodash"
import {SecurityProfileAssignmentTabs} from "../security-profiles/assignments/SecurityProfileAssignmentTabs"

interface FormFieldValues {
  UserGroup: UserGroup
  SecurityProfileAssignments: SecurityProfileAssignment[]
}

interface UserGroupFormFormProps {
  userGroup?: UserGroup
  userGroupType: "buyer" | "supplier" | "admin"
  parentId?: string
  securityProfileAssignments: SecurityProfileAssignment[]
  refresh?: () => void
}
export function UserGroupFormForm({
  userGroup,
  userGroupType,
  parentId,
  securityProfileAssignments = [],
  refresh
}: UserGroupFormFormProps) {
  const isCreating = !userGroup?.ID
  const router = useRouter()
  const successToast = useSuccessToast()
  const isUserGroupManager = useHasAccess(
    userGroupType === "buyer"
      ? appPermissions.BuyerUserGroupManager
      : userGroupType === "supplier"
      ? appPermissions.SupplierUserGroupManager
      : appPermissions.AdminUserGroupManager
  )

  const defaultValues: PartialDeep<FormFieldValues> = {
    UserGroup: {},
    SecurityProfileAssignments: securityProfileAssignments
  }

  const validationSchema = object().shape({
    UserGroup: object().shape({
      Name: string().max(100).required("Name is required"),
      Description: string().nullable().max(100)
    }),
    SecurityProfileAssignments: array().of(
      object().shape({
        SecurityProfileID: string().required("Security Profile is required")
      })
    )
  })

  const {handleSubmit, control, reset} = useForm<FormFieldValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: userGroup?.ID
      ? {UserGroup: userGroup, SecurityProfileAssignments: securityProfileAssignments}
      : defaultValues,
    mode: "onBlur"
  })

  const createOrderCloudUserGroup = async (userGroup: UserGroup) => {
    if (userGroupType === "buyer") {
      return await UserGroups.Create(parentId, userGroup)
    } else if (userGroupType === "supplier") {
      return await SupplierUserGroups.Create(parentId, userGroup)
    } else {
      return await AdminUserGroups.Create(userGroup)
    }
  }

  const updateOrderCloudUserGroup = async (fields: Partial<UserGroup>) => {
    if (userGroupType === "buyer") {
      return await UserGroups.Patch(parentId, userGroup.ID, fields)
    } else if (userGroupType === "supplier") {
      return await SupplierUserGroups.Patch(parentId, userGroup.ID, fields)
    } else {
      return await AdminUserGroups.Patch(userGroup.ID, fields)
    }
  }

  async function createUserGroup(fields: FormFieldValues) {
    const createdUserGroup = await createOrderCloudUserGroup(fields.UserGroup)
    const assignmentRequests = fields.SecurityProfileAssignments.map((assignment) => {
      assignment.UserGroupID = createdUserGroup.ID
      return SecurityProfiles.SaveAssignment(assignment)
    })
    await Promise.all(assignmentRequests)
    successToast({
      description: "Usergroup created successfully."
    })
    if (router.query.buyerid) {
      router.replace(`/buyers/${parentId}/usergroups/${createdUserGroup.ID}`)
    } else if (router.query.supplierid) {
      router.replace(`/suppliers/${parentId}/usergroups/${createdUserGroup.ID}`)
    } else {
      router.replace(`/settings/adminusergroups/${createdUserGroup.ID}`)
    }
  }

  async function updateUserGroup(fields: FormFieldValues) {
    const userGroupDiff = getObjectDiff(userGroup, fields.UserGroup)
    if (!isEmpty(userGroupDiff)) {
      await updateOrderCloudUserGroup(userGroupDiff)
    }

    if (!isEqual(securityProfileAssignments, fields.SecurityProfileAssignments)) {
      await updateSecurityProfileAssignments(fields.SecurityProfileAssignments)
    }

    successToast({
      description: "Usergroup updated successfully."
    })

    refresh()
  }

  async function updateSecurityProfileAssignments(newAssignments: SecurityProfileAssignment[]) {
    const addAssignments = differenceBy(
      newAssignments,
      securityProfileAssignments,
      (ass) => ass.BuyerID + ass.SecurityProfileID + ass.SupplierID + ass.UserGroupID + ass.UserID
    )
    const deleteAssignments = differenceBy(
      securityProfileAssignments,
      newAssignments,
      (ass) => ass.BuyerID + ass.SecurityProfileID + ass.SupplierID + ass.UserGroupID + ass.UserID
    )

    const addAssignmentRequests = addAssignments.map((assignment) => SecurityProfiles.SaveAssignment(assignment))
    const deleteAssignmentRequests = deleteAssignments.map((assignment) =>
      SecurityProfiles.DeleteAssignment(assignment.SecurityProfileID, {
        buyerID: assignment.BuyerID,
        supplierID: assignment.SupplierID,
        userGroupID: assignment.UserGroupID,
        userID: assignment.UserID
      })
    )

    await Promise.all([...addAssignmentRequests, ...deleteAssignmentRequests])
  }

  async function onSubmit(fields: FormFieldValues) {
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
          <Button onClick={() => router.back()} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={isUserGroupManager}>
            <ButtonGroup>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
            </ButtonGroup>
          </ProtectedContent>
        </CardHeader>
        <CardBody display="flex" flexDirection={"column"} gap={4} maxW={{xl: "container.md"}}>
          <InputControl
            name="UserGroup.Name"
            label="User Group Name"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isUserGroupManager}
          />
          <TextareaControl
            name="UserGroup.Description"
            label="Description"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isUserGroupManager}
          />
          <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
            <>
              <Divider my={6} />
              <SecurityProfileAssignmentTabs
                control={control}
                commerceRole={userGroupType}
                assignmentLevel="group"
                parentId={parentId}
                assignmentLevelId={userGroup?.ID}
                showAssignedTab={false}
              />
            </>
          </ProtectedContent>
        </CardBody>
      </Card>
    </Container>
  )
}
