import {
  Alert,
  Button,
  ButtonGroup,
  Center,
  FormControl,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  UseDisclosureProps
} from "@chakra-ui/react"
import {Products} from "ordercloud-javascript-sdk"
import {FC, useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"

interface IProductXpModal {
  productID: string
  disclosure: UseDisclosureProps
  nonUiXp: {[key: string]: any}
  existingPropertyName?: string
  existingPropertyValue?: string
  clearExistingPropertyValues: () => void
  onSuccess: (patchedProduct: IProduct) => void
}

const ProductXpModal: FC<IProductXpModal> = ({
  productID,
  disclosure,
  nonUiXp,
  existingPropertyName,
  existingPropertyValue,
  clearExistingPropertyValues,
  onSuccess
}) => {
  const {isOpen, onClose} = disclosure
  const [loading, setLoading] = useState(false)
  const [propertyName, setPropertyName] = useState<string>(existingPropertyName ?? "")
  const [dataType, setDataType] = useState<string>("string")
  const [value, setValue] = useState<any>(existingPropertyValue ?? "")
  const [errors, setErrors] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleDataTypeChange = (type: string) => () => {
    setValue("")
    setDataType(type)
  }

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setErrors([])
      setPropertyName("")
      setValue("")
      clearExistingPropertyValues()
      setIsEditing(false)
    }
    setPropertyName(existingPropertyName)
    setValue(existingPropertyValue)
    setDataType(existingPropertyValue ? typeof existingPropertyValue : "string")
    if (existingPropertyName || existingPropertyValue) setIsEditing(true)
  }, [isOpen, existingPropertyName, existingPropertyValue, clearExistingPropertyValues])

  const validate = (): string[] => {
    const errors = []
    if (Object.keys(nonUiXp).includes(propertyName) && !isEditing)
      errors.push(`The property name "${propertyName}" already exists on extended properties`)
    if (!propertyName || propertyName === "") errors.push("You must set a property name")
    if (!value || value === "") errors.push("You must set a property value")
    return errors
  }

  const handleSubmit = () => {
    setErrors([])
    const errors = validate()
    if (errors?.length > 0) {
      setErrors(errors)
      return
    }
    const request = {
      xp: {
        [propertyName]: dataType == "number" ? Number(value) : value
      }
    }
    setLoading(true)
    Products.Patch(productID, request)
      .then((res) => {
        onSuccess(res)
        onClose()
      })
      .catch((err) => setErrors([err]))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        {loading && (
          <Center
            rounded="md"
            position="absolute"
            left={0}
            w="full"
            h="full"
            bg="whiteAlpha.500"
            zIndex={2}
            color="teal"
          >
            <Spinner></Spinner>
          </Center>
        )}
        <ModalHeader>{isEditing ? "Edit" : "New"} Extended Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {errors.map((e, idx) => (
            <Alert key={idx} my={3} status="error" variant="subtle">
              {e}
            </Alert>
          ))}
          <Heading size="sm" as="h5" mb={5}>
            Property name
          </Heading>
          <FormControl>
            <Input
              type="string"
              value={propertyName ?? ""}
              onChange={(e) => setPropertyName(e.target.value)}
              isDisabled={isEditing}
            />
          </FormControl>
          <Heading size="sm" as="h5" mb={3} mt={7}>
            Property type
          </Heading>
          <ButtonGroup w="full" isAttached variant="outline">
            <Button
              flexGrow={1}
              onClick={handleDataTypeChange("string")}
              isActive={dataType === "string"}
              isDisabled={isEditing}
            >
              String
            </Button>
            <Button
              flexGrow={1}
              onClick={handleDataTypeChange("number")}
              isActive={dataType === "number"}
              isDisabled={isEditing}
            >
              Number
            </Button>
          </ButtonGroup>
          <Heading size="sm" as="h5" mb={3} mt={7}>
            Property value
          </Heading>
          <FormControl>
            <Input type={dataType} value={value ?? ""} onChange={(e) => setValue(e.target.value)} />
          </FormControl>
        </ModalBody>
        <ModalFooter as={HStack} justifyContent="space-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            isDisabled={propertyName == "" || value == ""}
            onClick={handleSubmit}
          >
            {existingPropertyValue ? "Update" : "Save"} Property
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ProductXpModal
