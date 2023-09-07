import {InputControl} from "@/components/react-hook-form"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Button,
  ButtonProps,
  HStack,
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
import {useForm} from "react-hook-form"
import {XpImage} from "types/ordercloud/IProduct"
import {object, string} from "yup"
import {FormEvent} from "react"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface MediaModalProps {
  onAdd: (data: XpImage) => void
  buttonProps: ButtonProps
}
export function MediaModal({buttonProps, onAdd}: MediaModalProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const validationSchema = object().shape({
    Url: string().url().required("Image URL is required"),
    ThumbnailUrl: string().url()
  })
  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {Url: "", ThumbnailUrl: ""} as any
  })

  const onSubmit = (data: XpImage) => {
    onAdd(data)
    onClose()
    reset()
  }

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onClose()
    reset()
  }

  return (
    <>
      <ProtectedContent hasAccess={appPermissions.ProductManager}>
        <Button {...buttonProps} onClick={onOpen}>
          Add image by URL
        </Button>
      </ProtectedContent>

      <Modal isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />

        <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
          <ModalHeader>Product Images</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={5}>
              <InputControl name="Url" label="URL" control={control} validationSchema={validationSchema} />
              <InputControl
                name="ThumbnailUrl"
                label="Thumbnail URL"
                control={control}
                validationSchema={validationSchema}
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent="space-between" w="100%">
              <Button onClick={handleCancel} variant="outline">
                Cancel
              </Button>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Add
              </SubmitButton>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
