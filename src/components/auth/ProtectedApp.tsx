import {useAuth} from "hooks/useAuth"
import {useRouter} from "hooks/useRouter"

/**
 * This higher order component is used to ensure
 * someone can't navigate to a page (other than login) without a valid ordercloud token
 */
export const ProtectedApp = ({children}: any) => {
  const router = useRouter()
  const {isAuthenticated} = useAuth()
  const isLoginPage = () => router.pathname === "/"

  // can only use router on the browser
  if (typeof window !== "undefined") {
    if (!isAuthenticated && !isLoginPage()) {
      router.push("/")
    } else if (isAuthenticated && isLoginPage()) {
      router.push("/dashboard")
    }
  }

  return children
}
