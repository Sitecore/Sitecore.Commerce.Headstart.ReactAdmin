import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Hide,
  HStack,
  Select,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {useRef} from "react"
import {TbLanguage, TbTableExport} from "react-icons/tb"

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
      <Hide below="md">
        <Button variant="outline" onClick={onOpen}>
          Switch Language
        </Button>
      </Hide>
      <Hide above="md">
        <Button
          display="flex"
          justifyContent={"flex-start"}
          variant="unstyled"
          px={3}
          _hover={{backgroundColor: "gray.100"}}
          w="full"
          textAlign="left"
          borderRadius="0"
          fontWeight="normal"
          leftIcon={<TbLanguage size="1rem" />}
          onClick={onOpen}
        >
          Switch Language
        </Button>
      </Hide>
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
                <Button ref={cancelRef} onClick={onClose} variant="outline">
                  Cancel
                </Button>
                <Button variant="solid" colorScheme="primary" onClick={onSelectLanguage}>
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
