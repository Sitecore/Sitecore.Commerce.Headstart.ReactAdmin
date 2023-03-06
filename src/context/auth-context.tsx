import React from "react"
import {ApiRole, DecodedToken, Tokens} from "ordercloud-javascript-sdk"
import {isTokenExpired, parseJwt} from "utils/token.utils"

export interface AuthState {
  isAuthenticated: boolean
  accessToken?: string
  refreshToken?: string
  decodedAccessToken?: DecodedToken
  loading: boolean
  initialized: boolean
  assignedRoles: ApiRole[]
  setUserTokens?: (accessToken: string, refreshToken: string) => void
  removeUserTokens?: () => void
  isAdmin: boolean
  isSupplier: boolean
}

const AuthContext = React.createContext<AuthState>(undefined)
const {Provider} = AuthContext

const AuthProvider = ({children}) => {
  const getAuthState = (): AuthState => {
    const accessToken = Tokens.GetAccessToken()
    const refreshToken = Tokens.GetRefreshToken()
    if (isTokenExpired(accessToken)) {
      return {
        isAuthenticated: false,
        accessToken,
        refreshToken,
        decodedAccessToken: {} as DecodedToken,
        loading: false,
        initialized: false,
        assignedRoles: [],
        isAdmin: false,
        isSupplier: false
      }
    } else {
      const decodedAccessToken = parseJwt(accessToken)
      return {
        accessToken,
        refreshToken,
        isAuthenticated: true,
        decodedAccessToken,
        loading: false,
        initialized: true,
        // if only one role assigned then the decodedtoken.role
        // will be a string else it will be a proper array
        assignedRoles: (typeof decodedAccessToken.role === "string"
          ? [decodedAccessToken.role]
          : decodedAccessToken.role) as ApiRole[],
        isAdmin: decodedAccessToken.usrtype === "admin",
        isSupplier: decodedAccessToken.usrtype === "supplier"
      }
    }
  }
  const [authState, setAuthState] = React.useState(getAuthState() as AuthState)

  const setUserTokens = (accessToken: string, refreshToken: string) => {
    Tokens.SetAccessToken(accessToken)
    if (typeof refreshToken !== "undefined") {
      Tokens.SetRefreshToken(refreshToken)
    }
    const state = getAuthState()
    setAuthState(state)
  }

  const removeUserTokens = () => {
    Tokens.RemoveAccessToken()
    Tokens.RemoveRefreshToken()
    const state = getAuthState()
    setAuthState(state)
  }

  return (
    <Provider
      value={{
        ...authState,
        setUserTokens,
        removeUserTokens
      }}
    >
      {children}
    </Provider>
  )
}

export {AuthContext, AuthProvider}
