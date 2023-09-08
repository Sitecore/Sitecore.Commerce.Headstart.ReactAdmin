import {useRouter as useNextRouter} from "next/router"
import {useMemo} from "react"

/**
 * This is a thin wrapper around next/router's useRouter hook
 * used in place of next/router to allow someone to easily change implementation
 * and possibly remove next/router from the project in the future
 */
export function useRouter() {
  const {back, push, replace, pathname, query, isReady, asPath, reload} = useNextRouter()

  const result = useMemo(() => {
    return {
      back,
      push,
      replace,
      pathname,
      query,
      isReady,
      asPath,
      reload
    }
  }, [back, push, replace, pathname, query, isReady, asPath, reload])

  return result
}
