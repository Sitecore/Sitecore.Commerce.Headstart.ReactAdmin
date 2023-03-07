import {useRouter as useNextRouter} from "next/router"
import {useCallback, useMemo} from "react"

export function useRouter() {
  const {back, push, pathname, query, isReady} = useNextRouter()

  const result = useMemo(() => {
    return {
      back,
      push,
      pathname,
      query,
      isReady
    }
  }, [back, push, pathname, query, isReady])

  return result
}
