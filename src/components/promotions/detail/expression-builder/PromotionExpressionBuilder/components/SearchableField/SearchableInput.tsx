import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import {useEffect, useMemo, useState} from "react"
import {ReactSelectOption} from "types/form/ReactSelectOption"
import {Select} from "chakra-react-select"
import {debounce} from "lodash"
import * as OrderCloudSdk from "ordercloud-javascript-sdk"

interface SearchableInputProps {
  showInModal: boolean
  resource: string
  onUpdate: (value: string, parentValue: string) => void
  value: string
  parentValue: string
  formatResourceOptions: (resource: any) => ReactSelectOption
  params?: string[]
  parentResource?: string
  formatParentResourceOptions?: (parentResource: any) => ReactSelectOption
  isDisabled?: boolean
}
export const SearchableInput = ({
  showInModal,
  onUpdate,
  parentResource,
  resource,
  params,
  formatResourceOptions,
  formatParentResourceOptions,
  value,
  parentValue,
  isDisabled
}: SearchableInputProps) => {
  const {isOpen, onOpen, onClose} = useDisclosure()

  // resource state methods
  const [resourceId, setResourceId] = useState<string>()
  const [resourceInputValue, setResourceInputValue] = useState("")
  const [resourceOptions, setResourceOptions] = useState<ReactSelectOption[]>([])
  const [resourceLoading, setResourceLoading] = useState(false)

  // parent resource state methods
  const [parentResourceId, setParentResourceId] = useState<string>(parentValue)
  const [parentResourceInputValue, setParentResourceInputValue] = useState("")
  const [parentResourceOptions, setParentResourceOptions] = useState<ReactSelectOption[]>([])
  const [parentResourceLoading, setParentResourceLoading] = useState(false)

  const handleAdd = () => {
    onUpdate(resourceId, parentResourceId)
    onClose()
    setResourceId(undefined)
    setParentResourceId(undefined)
  }

  const loadResources = useMemo(
    () =>
      debounce(async (search: string) => {
        try {
          if (parentResource && !parentResourceId) return
          setResourceLoading(true)

          // Build list options
          const listOptions = [...(params || [])] as any[]
          if (parentResourceId) listOptions.push(parentResourceId)
          listOptions.push({search, pageSize: 5})

          // Make api calls
          const service = resource || parentResource
          const requests = [OrderCloudSdk[service].List(...listOptions)]

          if (value) {
            // value (resourceId) is set so we need to get the resource so we can display
            listOptions.pop() // remove search
            listOptions.push({filters: {ID: value}}) // add filter for ID
            requests.push(OrderCloudSdk[service].List(...listOptions))
          }

          // Map options
          const responses = await Promise.all(requests)
          setResourceOptions(
            responses
              .map((r) => r.Items)
              .flat()
              .map(formatResourceOptions)
          )
        } finally {
          setResourceLoading(false)
        }
      }, 500),
    [parentResource, parentResourceId, value, resource, params, formatResourceOptions]
  )

  useEffect(() => {
    loadResources(resourceInputValue)
  }, [loadResources, resourceInputValue])

  const loadParentResources = useMemo(
    () =>
      debounce(async (search: string) => {
        try {
          if (!parentResource) return
          setParentResourceLoading(true)

          // Build list options
          const listOptions = [...(params || [])] as any[]
          listOptions.push({search, pageSize: 5})

          // Make api call
          const list = await OrderCloudSdk[parentResource].List(...listOptions)

          // Set options
          setParentResourceOptions(list.Items.map(formatParentResourceOptions))
        } finally {
          setParentResourceLoading(false)
        }
      }, 500),
    [parentResource, params, formatParentResourceOptions]
  )

  useEffect(() => {
    loadParentResources(parentResourceInputValue)
  }, [loadParentResources, parentResourceInputValue])

  const handleResourceSelect = (option: ReactSelectOption) => {
    const updatedResourceId = option.value
    setResourceId(updatedResourceId)
    if (!parentResource || showInModal) {
      onUpdate(updatedResourceId, parentResourceId)
      setResourceId(undefined)
    }
  }

  const handleParentResourceSelect = (option: ReactSelectOption) => {
    setParentResourceId(option.value)
  }

  const ResourceSelect = (
    <Select<ReactSelectOption, false>
      isMulti={false}
      value={resourceOptions.find((option) => option.value === value)}
      options={resourceOptions}
      isLoading={resourceLoading}
      isDisabled={parentResourceLoading || isDisabled}
      onInputChange={setResourceInputValue}
      onChange={handleResourceSelect}
      isClearable={false}
      filterOption={() => true}
      colorScheme="accent"
      placeholder={`Search ${resource}`}
      chakraStyles={{
        container: (baseStyles) => ({
          ...baseStyles,
          width: "100%"
        }),
        option: (baseStyles) => ({...baseStyles, ".single-line": {display: "none"}, ".multi-line": {display: "flex"}}),
        singleValue: (baseStyles) => ({
          ...baseStyles,
          ".single-line": {display: "flex"},
          ".multi-line": {display: "none"}
        })
      }}
    />
  )
  const modalContent = (
    <VStack>
      <Select<ReactSelectOption, false>
        isMulti={false}
        value={parentResourceOptions.find((option) => option.value === parentResourceId)}
        options={parentResourceOptions}
        isLoading={parentResourceLoading}
        onInputChange={setParentResourceInputValue}
        onChange={handleParentResourceSelect}
        isClearable={false}
        filterOption={() => true}
        colorScheme="accent"
        placeholder={`Search ${parentResource}`}
        chakraStyles={{
          container: (baseStyles) => ({
            ...baseStyles,
            width: "100%"
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            ".single-line": {display: "none"},
            ".multi-line": {display: "flex"}
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            ".single-line": {display: "flex"},
            ".multi-line": {display: "none"}
          })
        }}
      />
      {ResourceSelect}
    </VStack>
  )

  if (showInModal) {
    return parentResource ? modalContent : ResourceSelect
  }

  const singleResourceValue = (resourceOptions.find((r) => r.value === value)?.label || "") as string

  return (
    <>
      {parentResource ? (
        <Input type="text" value={singleResourceValue} onClick={!isDisabled && onOpen} onChange={() => ""} />
      ) : (
        ResourceSelect
      )}
      <Modal isOpen={isOpen} size="md" onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="lg" fontWeight="bold">
            Select {resource}
          </ModalHeader>

          <ModalBody>
            <VStack>
              <Select<ReactSelectOption, false>
                isMulti={false}
                value={parentResourceOptions.find((option) => option.value === parentResourceId)}
                options={parentResourceOptions}
                isLoading={parentResourceLoading}
                onInputChange={setParentResourceInputValue}
                onChange={handleParentResourceSelect}
                isClearable={false}
                filterOption={() => true}
                colorScheme="accent"
                placeholder={`Search ${parentResource}`}
                chakraStyles={{
                  container: (baseStyles) => ({
                    ...baseStyles,
                    width: "100%"
                  }),
                  option: (baseStyles) => ({
                    ...baseStyles,
                    ".single-line": {display: "none"},
                    ".multi-line": {display: "flex"}
                  }),
                  singleValue: (baseStyles) => ({
                    ...baseStyles,
                    ".single-line": {display: "flex"},
                    ".multi-line": {display: "none"}
                  })
                }}
              />
              {ResourceSelect}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack justifyContent="space-between" width="full">
              <Button onClick={onClose}>Cancel</Button>
              <Button colorScheme="primary" onClick={handleAdd} ml={3} isDisabled={!resourceId}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
