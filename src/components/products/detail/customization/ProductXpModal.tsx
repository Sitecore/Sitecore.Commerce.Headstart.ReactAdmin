import {InputControl, SelectControl} from "@/components/react-hook-form"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Button,
  ButtonProps,
  HStack,
  IconButton,
  IconButtonProps,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {FormEvent} from "react"
import {useForm} from "react-hook-form"
import {object, string} from "yup"

type ProductXpFormFields = {
  propertyName: string
  propertyValue: string | number
  dataType: "string" | "number"
}

interface ProductXpModalProps {
  isCreatingNew: boolean
  extendedProperties: {[key: string]: any}
  onUpdate: (name: string, value: string | number) => void
  existingPropertyName?: string
  existingPropertyValue?: string
  as: "button" | "iconbutton"
  buttonProps?: ButtonProps
  iconButtonProps?: IconButtonProps
}

export const ProductXpModal = ({
  isCreatingNew,
  extendedProperties,
  existingPropertyName,
  existingPropertyValue,
  onUpdate,
  as,
  buttonProps,
  iconButtonProps
}: ProductXpModalProps) => {
  const {isOpen, onClose, onOpen} = useDisclosure()

  const defaultValues: ProductXpFormFields = {
    propertyName: existingPropertyName || "",
    propertyValue: existingPropertyValue || "",
    dataType: existingPropertyValue ? (typeof existingPropertyValue === "number" ? "number" : "string") : "string"
  }

  const validationSchema = object().shape({
    propertyName: string()
      .required("You must set a property name")
      .test("unique-xp-property", "The property name already exists on extended properties", (name = "") => {
        const invalid = isCreatingNew && Object.keys(extendedProperties).includes(name)
        return !invalid
      })
      .matches(/[A-Za-z-_]/, "Property name must only contain letters, dashes, and underscores"),
    propertyValue: string()
      .required("You must set a property value")
      .when("dataType", {
        is: "number",
        then: (schema) =>
          schema.matches(/^-?[0-9]\d*(\.\d+)?$/, "Data type is set to number, so the value must be a number")
      }),
    dataType: string()
      .required("You must set a property type")
      .oneOf(["string", "number"], "Data type must be either string or number")
  })

  const {handleSubmit, control, reset} = useForm<ProductXpFormFields>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues,
    mode: "onBlur"
  })

  const handleClose = () => {
    onClose()
    reset(defaultValues)
  }

  const onSubmit = (formData: ProductXpFormFields) => {
    const parsedValue = formData.dataType === "number" ? Number(formData.propertyValue) : formData.propertyValue
    onUpdate(formData.propertyName, parsedValue)
    onClose()
    reset({...formData, propertyValue: parsedValue})
  }

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  return (
    <>
      {as === "button" ? (
        <Button {...buttonProps} onClick={onOpen}>
          {buttonProps.children || "Update product xp"}
        </Button>
      ) : (
        <IconButton {...iconButtonProps} onClick={onOpen} />
      )}
      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
          <ModalHeader>{isCreatingNew ? "Create" : "Update"} extended property</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={3}>
              <InputControl
                isDisabled={!isCreatingNew}
                label="Property name"
                name="propertyName"
                control={control}
                validationSchema={validationSchema}
              />
              <SelectControl
                isDisabled={!isCreatingNew}
                label="Property type"
                name="dataType"
                control={control}
                validationSchema={validationSchema}
                selectProps={{
                  options: [
                    {label: "String", value: "string"},
                    {label: "Number", value: "number"}
                  ]
                }}
              />
              <InputControl
                label="Property value"
                name="propertyValue"
                control={control}
                validationSchema={validationSchema}
              />
            </VStack>
          </ModalBody>
          <ModalFooter as={HStack} justifyContent="space-between">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <SubmitButton control={control} variant="solid" colorScheme="primary">
              Submit
            </SubmitButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
