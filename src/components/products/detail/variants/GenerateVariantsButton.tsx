import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  Checkbox,
  useDisclosure
} from "@chakra-ui/react"
import {useToast} from "hooks/useToast"
import {useRef, useState} from "react"
import {Control, useFormState} from "react-hook-form"
import {ISpec} from "types/ordercloud/ISpec"
import {ProductDetailFormFields} from "../form-meta"

interface GenerateVariantsButtonProps {
  specs: ISpec[]
  control: Control<ProductDetailFormFields>
  buttonProps: ButtonProps
  onGenerate: (shouldOverwrite: boolean) => void
}
export function GenerateVariantsButton({control, buttonProps, specs = [], onGenerate}: GenerateVariantsButtonProps) {
  const [shouldOverwrite, setShouldOverwrite] = useState(false)
  const {isOpen, onClose, onOpen} = useDisclosure()
  const cancelRef = useRef()
  const {isDirty} = useFormState({control})
  const toast = useToast()

  const handleClick = () => {
    if (isDirty) {
      return toast({
        status: "info",
        description: "Please save or discard changes before generating variants",
        position: "top-right"
      })
    }
    if (!specs.length) {
      return toast({status: "info", description: "Please add specs before generating variants"})
    }
    onOpen()
  }

  const handleYesClick = () => {
    onGenerate(shouldOverwrite)
    onClose()
  }

  return (
    <>
      <Button onClick={handleClick} {...buttonProps}>
        Generate Variants
      </Button>
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader>Generate Variants</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure you want to generate variants?
            <Checkbox marginTop={5} isChecked={shouldOverwrite} onChange={(e) => setShouldOverwrite(e.target.checked)}>
              Overwrite existing variants
            </Checkbox>
          </AlertDialogBody>
          <AlertDialogFooter justifyContent="space-between">
            <Button ref={cancelRef} onClick={onClose}>
              No
            </Button>
            <Button variant="solid" colorScheme="primary" onClick={handleYesClick}>
              Yes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
