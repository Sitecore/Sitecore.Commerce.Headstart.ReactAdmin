import {InfoOutlineIcon} from "@chakra-ui/icons"
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  Checkbox,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  FormLabel,
  Tooltip
} from "@chakra-ui/react"
import {PermissionConfig, appPermissions} from "config/app-permissions.config"
import {isAllowedAccess} from "hooks/useHasAccess"
import {groupBy, uniq} from "lodash"
import {ApiRole} from "ordercloud-javascript-sdk"

interface FeatureListProps {
  isAdmin?: boolean
  roles: ApiRole[]
  customRoles: string[]
  isDisabled: boolean
  onRolesChange?: (roles: ApiRole[]) => void
  onCustomRolesChange?: (customRoles: string[]) => void
}

export function FeatureList({
  isAdmin,
  roles = [],
  customRoles = [],
  onRolesChange,
  onCustomRolesChange,
  isDisabled
}: FeatureListProps) {
  const allRoles = [...roles, ...customRoles]
  const features = Object.values(appPermissions)
  const groupedFeatures = groupBy(features, (f) => f.Group)

  const handleChange = (featureName: string) => {
    const feature = features.find((f) => f.Name === featureName)
    if (!feature) return

    // determine which features are currently enabled
    const enabledFeatures = features.filter((f) => isFeatureEnabled(f))

    const hasAccessCurrently = isAllowedAccess(allRoles, feature, isAdmin)
    if (hasAccessCurrently) {
      // intent is to remove feature, so remove feature from enabledFeatures
      enabledFeatures.splice(enabledFeatures.indexOf(feature), 1)
    } else {
      // intent is to add feature, so add feature to enabledFeatures
      enabledFeatures.push(feature)
    }

    // determine new roles given the set of enabled features
    const newRoles = uniq(enabledFeatures.map((f) => f.Roles).flat())
    const newCustomRoles = uniq(enabledFeatures.map((f) => f.CustomRoles).flat())

    // propogate role changes up to parent component
    onRolesChange(newRoles)
    onCustomRolesChange(newCustomRoles)
  }

  const isFeatureEnabled = (feature: PermissionConfig) => {
    return isAllowedAccess(allRoles, feature, isAdmin)
  }

  const getFeaturesEnabledCount = (features: PermissionConfig[]) => {
    return features.filter((f) => isFeatureEnabled(f)).length
  }

  return (
    <VStack alignItems="flex-start" width="full">
      <FormLabel>Admin App Features</FormLabel>
      <Accordion width="full" allowToggle={true}>
        {Object.entries(groupedFeatures).map(([groupName, features]) => {
          const featuresEnabledCount = getFeaturesEnabledCount(features)
          return (
            <AccordionItem key={groupName}>
              {({isExpanded}) => (
                <>
                  <AccordionButton>
                    <Heading as="h3" size="sm" fontWeight="medium" flex="1" textAlign="left">
                      {groupName}
                    </Heading>
                    <Box>
                      <Badge fontWeight="semibold">
                        {featuresEnabledCount} / {features.length} enabled
                      </Badge>
                      <AccordionIcon marginLeft={3} />
                    </Box>
                  </AccordionButton>
                  <AccordionPanel>
                    {/* Don't render unless panel is expanded (lazy loading for performance) */}
                    {isExpanded && (
                      <VStack alignItems="flex-start">
                        {features.map((feature) => (
                          <HStack key={feature.Name} justifyContent="space-between">
                            <Checkbox
                              isChecked={isFeatureEnabled(feature)}
                              onChange={() => handleChange(feature.Name)}
                              isDisabled={isDisabled}
                            />
                            <HStack>
                              <Text>{feature.Name}</Text>
                              <Tooltip label={feature.Description} placement="right">
                                <InfoOutlineIcon color="gray.500" />
                              </Tooltip>
                            </HStack>
                          </HStack>
                        ))}
                      </VStack>
                    )}
                  </AccordionPanel>
                </>
              )}
            </AccordionItem>
          )
        })}
      </Accordion>
    </VStack>
  )
}
