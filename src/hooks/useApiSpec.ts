import {useCallback, useEffect, useMemo, useState} from "react"
import SwaggerParser from "@apidevtools/swagger-parser"
import {OpenAPIV3} from "openapi-types"
import {Configuration} from "ordercloud-javascript-sdk"

const localStoragePrefix = "OcOpenApi."
export function useApiSpec() {
  const baseUrl = Configuration.Get().baseApiUrl
  const [spec, setSpec] = useState<OpenAPIV3.Document | undefined>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(`${localStoragePrefix}${baseUrl}`)
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : undefined
    } catch (error) {
      // If error also return initialValue
      console.log(error)
      return undefined
    }
  })

  const retrieveSpec = useCallback(async (url: string) => {
    const result = await SwaggerParser.dereference(`${url}/v1/openapi/v3`)
    const v3doc = result as OpenAPIV3.Document
    if (v3doc.servers) {
      v3doc.servers[0].url = `${url}/v1`
    }
    // Clear out swagger specs in localStorage to prevent capacity errors
    const keys = Object.keys(window.localStorage)
    keys.filter((k) => k.includes("OcOpenApi")).map((i) => window.localStorage.removeItem(i))
    window.localStorage.setItem(`${localStoragePrefix}${url}`, JSON.stringify(v3doc))
    setSpec(v3doc)
  }, [])

  const validateSpecVersion = useCallback(
    async (url: string, version: string) => {
      const result = await fetch(`${url}/env`)
      const resultJson = await result.json()
      if (resultJson.BuildNumber && resultJson.BuildNumber !== version) {
        console.log(`Current spec (v${version}) is outdated, updating to ${resultJson.BuildNumber}`)
        retrieveSpec(url)
      }
    },
    [retrieveSpec]
  )

  useEffect(() => {
    if (
      spec &&
      spec.info &&
      spec.info.version &&
      spec.info.version.split(".").length === 4 &&
      spec.servers &&
      spec.servers.length &&
      spec.servers[0].url === `${baseUrl}/v1`
    ) {
      validateSpecVersion(baseUrl, spec.info.version)
    }
  }, [spec, baseUrl, validateSpecVersion])

  useEffect(() => {
    if (!baseUrl) return
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(`${localStoragePrefix}${baseUrl}`)
      // Parse stored json or if none return initialValue
      item ? setSpec(JSON.parse(item)) : retrieveSpec(baseUrl)
    } catch (error) {
      // If error also return initialValue
      retrieveSpec(baseUrl)
    }
  }, [baseUrl, retrieveSpec])

  const result = useMemo(() => {
    if (!spec) {
      return {}
    }
    return {
      schemas: spec.components.schemas as Record<string, OpenAPIV3.SchemaObject> // we know they are schema objects because we've dereferenced the spec
    }
  }, [spec])

  return result
}
