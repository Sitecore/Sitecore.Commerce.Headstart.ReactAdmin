import React from "react"
import useHasAccess, {AccessQualifier} from "../../hooks/useHasAccess"

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
  const canSee = useHasAccess(hasAccess)

  return canSee ? children : <></>
}

export default ProtectedContent
