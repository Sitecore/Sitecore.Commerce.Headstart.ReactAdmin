import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Icon,
  IconButton,
  SimpleGrid,
  VStack
} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {
  AdminUsers,
  PartialDeep,
  SecurityProfileAssignment,
  SecurityProfiles,
  SupplierUsers,
  User,
  Users
} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import {string, boolean, object, array, ref} from "yup"
import {emptyStringToNull, getObjectDiff, orderCloudPasswordRegex} from "utils"
import {useSuccessToast} from "hooks/useToast"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"
import {SecurityProfileAssignmentTabs} from "../security-profiles/assignments/SecurityProfileAssignmentTabs"
import {differenceBy, isEmpty, isEqual, omit} from "lodash"
import {useState} from "react"
import {FaEye, FaEyeSlash} from "react-icons/fa"
import {FakePasswordInput} from "./FakePasswordInput"

interface FormFieldValues {
  User: User & {ConfirmPassword: string}
  SecurityProfileAssignments: SecurityProfileAssignment[]
}

interface UserFormProps {
  user?: User
  userType: "buyer" | "supplier" | "admin"
  parentId?: string
  securityProfileAssignments: SecurityProfileAssignment[]
  refresh?: () => void
}
export function UserForm({user, userType, parentId, securityProfileAssignments = [], refresh}: UserFormProps) {
  const router = useRouter()
  const successToast = useSuccessToast()
  const isCreating = !user?.ID
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showRealPasswordInputs, setShowRealShowPasswordInputs] = useState(isCreating)

  const isUserManager = useHasAccess(
    userType === "admin"
      ? appPermissions.AdminUserManager
      : userType === "supplier"
      ? appPermissions.SupplierUserManager
      : appPermissions.BuyerUserManager
  )

  const defaultValues: PartialDeep<FormFieldValues> = {
    User: {
      Active: true
    },
    SecurityProfileAssignments: securityProfileAssignments
  }

  const validationSchema = object().shape({
    User: object().shape({
      Active: boolean(),
      Username: string().max(100).required("Username is required"),
      Password: string()
        .transform(emptyStringToNull)
        .nullable()
        .test({
          name: "password",
          message:
            "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and a number",
          test: (val) => {
            // setting a password is optional, only validate password is there a value to validate against
            if (val?.length > 0) {
              return orderCloudPasswordRegex.test(val)
            } else {
              return true
            }
          }
        }),
      ConfirmPassword: string()
        .transform(emptyStringToNull)
        .nullable()
        .when("Password", {
          // setting a password is optional, but if it's set, confirm password is required
          is: (val) => val?.length > 0,
          then: (schema) => schema.required("Must confirm password if password is set")
        })
        .oneOf([ref("Password")], "Passwords do not match"),
      FirstName: string().required("First Name is required"),
      LastName: string().required("Last Name is required"),
      Email: string().email("Email is invalid").required("Email is required"),
      Phone: string().nullable()
    }),
    SecurityProfileAssignments: array().of(
      object().shape({
        SecurityProfileID: string().required("Security Profile is required")
      })
    )
  })

  const {handleSubmit, control, reset, setFocus} = useForm<FormFieldValues>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: user?.ID ? {User: user, SecurityProfileAssignments: securityProfileAssignments} : defaultValues,
    mode: "onBlur"
  })

  const createOrderCloudUser = async (fields: User) => {
    if (userType === "buyer") {
      return await Users.Create(parentId, fields)
    } else if (userType === "supplier") {
      return await SupplierUsers.Create(parentId, fields)
    } else {
      return await AdminUsers.Create(fields)
    }
  }

  const updateOrderCloudUser = async (fields: Partial<User>) => {
    if (userType === "buyer") {
      return await Users.Patch(parentId, user.ID, fields)
    } else if (userType === "supplier") {
      return await SupplierUsers.Patch(parentId, user.ID, fields)
    } else {
      return await AdminUsers.Patch(user.ID, fields)
    }
  }

  async function createUser(fields: FormFieldValues) {
    const createdUser = await createOrderCloudUser(fields.User)
    const assignmentRequests = fields.SecurityProfileAssignments.map((assignment) => {
      assignment.UserID = createdUser.ID
      return SecurityProfiles.SaveAssignment(assignment)
    })
    await Promise.all(assignmentRequests)
    successToast({
      description: "User created successfully."
    })
    if (router.query.buyerid) {
      router.replace(`/buyers/${parentId}/users/${createdUser.ID}`)
    } else if (router.query.supplierid) {
      router.replace(`/suppliers/${parentId}/users/${createdUser.ID}`)
    } else {
      router.replace(`/settings/adminusers/${createdUser.ID}`)
    }
  }

  async function updateUser(fields: FormFieldValues) {
    const userDiff = omit(getObjectDiff(user, fields.User), "AvailableRoles") as Partial<User>
    if (!isEmpty(userDiff)) {
      await updateOrderCloudUser(userDiff)
    }

    if (!isEqual(securityProfileAssignments, fields.SecurityProfileAssignments)) {
      await updateSecurityProfileAssignments(fields.SecurityProfileAssignments)
    }

    successToast({
      description: "User updated successfully."
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
      await createUser(fields)
    } else {
      await updateUser(fields)
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const handleFakePasswordClick = (field: "User.Password" | "User.ConfirmPassword") => {
    setShowRealShowPasswordInputs(true)

    setTimeout(() => {
      setFocus(field)
    })
  }

  const passwordTooltipText =
    "For security reasons it is recommended to not set user passwords here, and instead have them set their own passwords via the forgot password flow"

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={isUserManager}>
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
        <CardBody
          display="flex"
          flexWrap={{base: "wrap", lg: "nowrap"}}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
        >
          <VStack flexBasis={"container.lg"} gap={4} maxW={{xl: "container.md"}}>
            <SwitchControl
              name="User.Active"
              label="Active"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isUserManager}
            />
            <InputControl
              name="User.Username"
              label="Username"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isUserManager}
            />
            <SimpleGrid gap={4} w="100%" gridTemplateColumns={{lg: "1fr 1fr"}}>
              {showRealPasswordInputs ? (
                <>
                  <InputControl
                    name="User.Password"
                    label="Password"
                    tooltipText={passwordTooltipText}
                    control={control}
                    validationSchema={validationSchema}
                    isDisabled={!isUserManager}
                    inputProps={{type: showPassword ? "text" : "password", autoComplete: "off", autoCapitalize: "off"}}
                    rightElement={
                      <IconButton
                        onClick={handleTogglePasswordVisibility}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={showPassword ? <Icon as={FaEyeSlash} size="20px" /> : <Icon as={FaEye} size="20px" />}
                      ></IconButton>
                    }
                  />
                  <InputControl
                    name="User.ConfirmPassword"
                    label="Confirm Password"
                    control={control}
                    validationSchema={validationSchema}
                    isDisabled={!isUserManager}
                    inputProps={{
                      type: showConfirmPassword ? "text" : "password",
                      autoComplete: "off",
                      autoCapitalize: "off"
                    }}
                    rightElement={
                      <IconButton
                        onClick={handleToggleConfirmPasswordVisibility}
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        icon={
                          showConfirmPassword ? <Icon as={FaEyeSlash} size="20px" /> : <Icon as={FaEye} size="20px" />
                        }
                      ></IconButton>
                    }
                  />
                </>
              ) : (
                <>
                  <FakePasswordInput
                    label="Password"
                    onClick={() => handleFakePasswordClick("User.Password")}
                    tooltipText={passwordTooltipText}
                    isDisabled={!isUserManager}
                  />
                  <FakePasswordInput
                    label="Confirm Password"
                    onClick={() => handleFakePasswordClick("User.ConfirmPassword")}
                    isDisabled={!isUserManager}
                  />
                </>
              )}
              <InputControl
                name="User.FirstName"
                label="First name"
                control={control}
                validationSchema={validationSchema}
                isDisabled={!isUserManager}
              />
              <InputControl
                name="User.LastName"
                label="Last name"
                control={control}
                validationSchema={validationSchema}
                isDisabled={!isUserManager}
              />
              <InputControl
                name="User.Email"
                label="Email"
                control={control}
                validationSchema={validationSchema}
                isDisabled={!isUserManager}
              />
              <InputControl
                name="User.Phone"
                label="Phone"
                control={control}
                validationSchema={validationSchema}
                isDisabled={!isUserManager}
              />
            </SimpleGrid>
            <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
              <>
                <Divider my={6} />
                <SecurityProfileAssignmentTabs
                  control={control}
                  assignedRoles={user?.AvailableRoles}
                  commerceRole={userType}
                  assignmentLevel="user"
                  parentId={parentId}
                  assignmentLevelId={user?.ID}
                  showAssignedTab={!isCreating}
                />
              </>
            </ProtectedContent>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
