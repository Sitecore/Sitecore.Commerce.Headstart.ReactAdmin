import {AuthContext} from "lib/context/auth-context"
import {useAuth} from "lib/hooks/useAuth"
import React, {PropsWithChildren, useEffect, useState} from "react"
import {AccessQualifier, isAllowedAccess} from "../../hooks/useHasAccess"

interface ProtectedContentProps {
  /**
   * determines whether or not a user should be able to see the content
   * accepts a single role, an array of roles (user should have at least one), or a function
   */
  hasAccess: AccessQualifier
  children: JSX.Element
}

/**'
 * This component should be used to hide content based on ordercloud roles
 */
const ProtectedContent = (props: ProtectedContentProps) => {
  const {hasAccess, children} = props
  const {assignedRoles} = useAuth()
  const [canSee, setCanSee] = useState(false)

  useEffect(() => {
    if (assignedRoles?.length && isAllowedAccess(assignedRoles, hasAccess)) {
      setCanSee(true)
    } else {
      setCanSee(false)
    }
  }, [assignedRoles, hasAccess])

  return canSee ? children : <></>
}

export default ProtectedContent
