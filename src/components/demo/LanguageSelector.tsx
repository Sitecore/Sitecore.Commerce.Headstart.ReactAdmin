import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Select,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {useRef} from "react"

interface LanguageSelectorProps {}
export default function LanguageSelector({}: LanguageSelectorProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef()

  const onSelectLanguage = () => {
    console.log("Demo Feature >> Not implemented!")
    onClose()
  }

  return (
    <>
      <Button variant="secondaryButton" onClick={onOpen}>
        Switch Language
      </Button>
      <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Change Language
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">Would you like to switch to a different language?</Text>
              <Select title="Select promotion" mt="20px">
                <option key="english" value="english">
                  English
                </option>
                <option key="french" value="french">
                  French
                </option>
                <option key="german" value="german">
                  German
                </option>
                <option key="chinese" value="chinese">
                  Chinese
                </option>
              </Select>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button ref={cancelRef} onClick={onClose} variant="secondaryButton">
                  Cancel
                </Button>
                <Button variant="primaryButton" onClick={onSelectLanguage}>
                  Change Language
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
