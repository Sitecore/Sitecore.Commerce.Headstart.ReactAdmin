import {useRouter as useNextRouter} from "next/router"
import {useCallback, useMemo} from "react"

export function useRouter() {
  const {back, push, pathname, query, isReady, asPath} = useNextRouter()

  const result = useMemo(() => {
    return {
      back,
      push,
      pathname,
      query,
      isReady,
      asPath
    }
  }, [back, push, pathname, query, isReady, asPath])

  return result
}
