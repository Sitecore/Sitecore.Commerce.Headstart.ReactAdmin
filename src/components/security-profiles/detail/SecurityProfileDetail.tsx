import ProtectedContent from "@/components/auth/ProtectedContent"
import {CheckboxControl, InputControl, ResetButton, SelectControl} from "@/components/react-hook-form"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {Container, Card, CardHeader, Button, ButtonGroup, CardBody, VStack} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {useSuccessToast} from "hooks/useToast"
import {useRouter} from "next/router"
import {SecurityProfile, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {useController, useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {object, string} from "yup"
import {FeatureList} from "./FeatureList"
import {orderCloudRoles} from "constants/ordercloud-roles"
import {getObjectDiff} from "utils"
import {isEmpty} from "lodash"

export type SecurityProfileForm = {
  SecurityProfile: SecurityProfile
  IsAssignedToAllAdmins: boolean
}
interface SecurityProfileDetailProps {
  securityProfile?: SecurityProfile
  isAssignedToAllAdmins?: boolean
}
export function SecurityProfileDetail({securityProfile, isAssignedToAllAdmins}: SecurityProfileDetailProps) {
  const isSecurityProfileManager = useHasAccess(appPermissions.SecurityProfileManager)
  const [currentSecurityProfile, setCurrentSecurityProfile] = useState(securityProfile)
  const [currentIsAssignedToAllAdmins, setCurrentIsAssignedToAllAdmins] = useState(isAssignedToAllAdmins)
  const [isCreating, setIsCreating] = useState(!securityProfile?.ID)

  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentSecurityProfile?.ID)
  }, [currentSecurityProfile?.ID])

  const defaultValues = {
    SecurityProfile: {Roles: [], CustomRoles: []},
    IsAssignedToAllAdmins: false
  }

  const validationSchema = object().shape({
    SecurityProfile: object().shape({Name: string().max(100).required("Name is required")})
  })

  const {handleSubmit, control, reset} = useForm<SecurityProfileForm>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: securityProfile?.ID
      ? {SecurityProfile: securityProfile, IsAssignedToAllAdmins: isAssignedToAllAdmins}
      : defaultValues,
    mode: "onBlur"
  })

  const roles = useController({name: "SecurityProfile.Roles", control})
  const customRoles = useController({name: "SecurityProfile.CustomRoles", control})

  const createSecurityProfile = async (fields: SecurityProfileForm) => {
    const createdSecurityProfile = await SecurityProfiles.Create(fields.SecurityProfile)
    if (fields.IsAssignedToAllAdmins) {
      await SecurityProfiles.SaveAssignment({
        SecurityProfileID: createdSecurityProfile.ID
      })
    }
    setCurrentSecurityProfile(createdSecurityProfile)
    setCurrentIsAssignedToAllAdmins(fields.IsAssignedToAllAdmins)
    successToast({description: "Security Profile Created"})
    router.replace(`/settings/securityprofiles/${createdSecurityProfile.ID}`)
  }

  const updateSecurityProfile = async (fields: SecurityProfileForm) => {
    const securityProfileDiff = getObjectDiff(currentSecurityProfile, fields.SecurityProfile)
    if (!isEmpty(securityProfileDiff)) {
      const updatedSecurityProfile = await SecurityProfiles.Patch(currentSecurityProfile.ID, securityProfileDiff)
      setCurrentSecurityProfile(updatedSecurityProfile)
    }

    if (currentIsAssignedToAllAdmins !== fields.IsAssignedToAllAdmins) {
      if (fields.IsAssignedToAllAdmins) {
        await SecurityProfiles.SaveAssignment({
          SecurityProfileID: currentSecurityProfile.ID
        })
      } else {
        await SecurityProfiles.DeleteAssignment(currentSecurityProfile.ID)
      }
      setCurrentIsAssignedToAllAdmins(fields.IsAssignedToAllAdmins)
    }

    successToast({description: "Security Profile Updated"})
  }

  async function onSubmit(fields: SecurityProfileForm) {
    if (isCreating) {
      await createSecurityProfile(fields)
    } else {
      await updateSecurityProfile(fields)
    }
  }

  const orderCloudRoleOptions = orderCloudRoles.map((role) => ({value: role, label: role}))

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
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
            {isSecurityProfileManager && (
              <CheckboxControl
                width="full"
                name="IsAssignedToAllAdmins"
                label="Assign to all admin users"
                control={control}
                validationSchema={validationSchema}
                isDisabled={!isSecurityProfileManager}
              />
            )}
            <InputControl
              name="SecurityProfile.Name"
              label="Name"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isSecurityProfileManager}
            />
            <FeatureList
              isAdmin={true}
              roles={roles.field.value}
              customRoles={customRoles.field.value}
              onRolesChange={roles.field.onChange}
              onCustomRolesChange={customRoles.field.onChange}
              isDisabled={!isSecurityProfileManager}
            />
            <SelectControl
              name="SecurityProfile.Roles"
              label="Roles"
              control={control}
              validationSchema={validationSchema}
              selectProps={{
                options: orderCloudRoleOptions,
                isMulti: true,
                isDisabled: !isSecurityProfileManager
              }}
            />
            <SelectControl
              name="SecurityProfile.CustomRoles"
              label="Custom Roles"
              control={control}
              validationSchema={validationSchema}
              selectProps={{
                isCreatable: true,
                isMulti: true,
                isDisabled: !isSecurityProfileManager,
                noOptionsMessage: () => "Start typing to create a custom role",
                placeholder: "Start typing to create a custom role"
              }}
            />
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
