import {DecodedToken} from "ordercloud-javascript-sdk"

export function parseJwt(token: string): DecodedToken {
  const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
  const decoded = JSON.parse(
    decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`
        })
        .join("")
    )
  )
  return decoded as DecodedToken
}

export function isTokenExpired(token: string): boolean {
  if (!token) {
    return true
  }
  const decodedToken = parseJwt(token)
  const currentSeconds = Date.now() / 1000
  const currentSecondsWithBuffer = currentSeconds - 10
  return decodedToken.exp < currentSecondsWithBuffer
}
