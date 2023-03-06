import {AuthContext} from "lib/context/auth-context"
import {useContext, useMemo} from "react"

export type HasAccessFunction = (assignedRoles: string[]) => boolean
export type AccessQualifier = string | string[] | HasAccessFunction

export const isAllowedAccess = (assignedRoles: string[], hasAccess: AccessQualifier) => {
  switch (typeof hasAccess) {
    case "undefined":
      return false
    case "string":
      return assignedRoles.includes(hasAccess) || assignedRoles.includes("FullAccess")
    case "function":
      return hasAccess(assignedRoles)
    default:
      if (assignedRoles.includes("FullAccess")) {
        return true
      }
      return hasAccess.every((requiredRole) => assignedRoles.includes(requiredRole))
  }
}

const useHasAccess = (accessQualifier: AccessQualifier) => {
  const context = useContext(AuthContext)

  const allowed = useMemo(() => {
    return context.assignedRoles ? isAllowedAccess(context.assignedRoles, accessQualifier) : false
  }, [context.assignedRoles, accessQualifier])

  return allowed
}

export default useHasAccess
