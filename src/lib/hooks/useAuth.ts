import ocConfig from "lib/constants/ordercloud-config"
import {AuthContext} from "lib/context/auth-context"
import {useRouter} from "next/router"
import {Auth, Me} from "ordercloud-javascript-sdk"
import {useContext} from "react"

export function useAuth() {
  const {setUserTokens, removeUserTokens, isAuthenticated, assignedRoles, isAdmin, isSupplier} = useContext(AuthContext)
  const router = useRouter()

  async function Login(username: string, password: string, remember: boolean): Promise<void> {
    const response = await Auth.Login(username, password, ocConfig.clientId, ocConfig.scope)
    setUserTokens(response.access_token, remember && response.refresh_token)
    const me = await Me.Get()
    localStorage.setItem("usersToken", `${me.FirstName} ${me.LastName}`)
  }

  function Logout() {
    removeUserTokens()
    if (typeof window !== "undefined" && router.pathname !== "/") {
      router.push("/")
    }
  }

  return {Login, Logout, isAuthenticated, assignedRoles, isAdmin, isSupplier}
}
