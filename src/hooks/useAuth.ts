import ocConfig from "config/ordercloud-config"
import {AuthContext} from "context/auth-context"
import {useRouter} from "hooks/useRouter"
import {Auth, Me} from "ordercloud-javascript-sdk"
import {useContext} from "react"
import {IMeAdminUser} from "types/ordercloud/IMeAdminUser"
import {IMeSupplierUser} from "types/ordercloud/IMeSupplierUser"

export function useAuth() {
  const {setUserTokens, removeUserTokens, isAuthenticated, assignedRoles, isAdmin, isSupplier} = useContext(AuthContext)
  const router = useRouter()

  async function Login(username: string, password: string, remember: boolean): Promise<void> {
    const response = await Auth.Login(username, password, ocConfig.clientId)
    setUserTokens(response.access_token, remember && response.refresh_token)
    const me = await Me.Get<IMeAdminUser | IMeSupplierUser>()
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
