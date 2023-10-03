import {PermissionConfig} from "config/app-permissions.config"
import {AuthContext} from "context/auth-context"
import {useContext, useMemo} from "react"

export type HasAccessFunction = (assignedRoles: string[]) => boolean
export type AccessQualifier = boolean | string | string[] | HasAccessFunction | PermissionConfig | PermissionConfig[]

export const isAllowedAccess = (assignedRoles: string[], hasAccess: AccessQualifier, isAdmin: boolean): boolean => {
  const invalidSupplierRoles = ["SecurityProfileReader", "SecurityProfileAdmin"]

  switch (typeof hasAccess) {
    case "boolean":
      return hasAccess
    case "undefined":
      return false
    case "string":
      return (
        assignedRoles.includes(hasAccess) ||
        (isAdmin && assignedRoles.includes("FullAccess")) ||
        (!isAdmin && assignedRoles.includes("FullAccess") && !invalidSupplierRoles.includes(hasAccess))
      )
    case "function":
      return hasAccess(assignedRoles)
    default:
      if (assignedRoles.includes("FullAccess") && isAdmin) {
        return true
      }
      if (Array.isArray(hasAccess)) {
        if (hasAccess.length === 0) {
          return false
        }
        if (typeof hasAccess[0] === "string") {
          // handle string[] case, should include ALL roles in the array
          return (hasAccess as string[]).every((access: string) => isAllowedAccess(assignedRoles, access, isAdmin))
        } else {
          // handle PermissionConfig[], only one of the PermissionConfigs needs to be valid (OR operation)
          return (hasAccess as PermissionConfig[]).some((access: PermissionConfig) =>
            isAllowedAccess(assignedRoles, access, isAdmin)
          )
        }
      } else {
        // handle PermissionConfig - should include ALL roles in the permission config
        const requiredRoles = [...hasAccess.Roles, ...hasAccess.CustomRoles]
        return isAllowedAccess(assignedRoles, requiredRoles, isAdmin)
      }
  }
}

const useHasAccess = (accessQualifier: AccessQualifier) => {
  const context = useContext(AuthContext)

  const allowed = useMemo(() => {
    return context.assignedRoles ? isAllowedAccess(context.assignedRoles, accessQualifier, context.isAdmin) : false
  }, [context.assignedRoles, accessQualifier, context.isAdmin])

  return allowed
}

export default useHasAccess
