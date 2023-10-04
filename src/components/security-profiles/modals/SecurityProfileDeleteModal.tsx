import {
  Badge,
  Button,
  Center,
  Collapse,
  Divider,
  Heading,
  HStack,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {SecurityProfile, SecurityProfiles} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"

interface ISecurityProfileDeleteModal {
  securityprofiles?: SecurityProfile[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const SecurityProfileDeleteModal: FC<ISecurityProfileDeleteModal> = ({securityprofiles, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showsecurityprofiles, setShowSecurityProfiles] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowSecurityProfiles(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(securityprofiles.map((securityprofile) => SecurityProfiles.Delete(securityprofile?.ID)))
      onComplete(securityprofiles.map((securityprofile) => securityprofile.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [securityprofiles, onComplete, onClose])

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
        <ModalHeader>Are you sure?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <HStack justifyContent="space-between" mb={5}>
            <Heading size="sm" as="h5">
              {`Deleting ${securityprofiles.length} Selected SecurityProfile${
                securityprofiles.length === 1 ? "" : "s"
              }`}
            </Heading>
            <Button variant="link" onClick={() => setShowSecurityProfiles((s) => !s)}>
              {showsecurityprofiles ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showsecurityprofiles}>
            <List mb={5}>
              {securityprofiles.map((securityprofile, i) => (
                <>
                  <ListItem key={securityprofile.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{securityprofile.ID}</Badge>
                        <Text>{securityprofile.Name}</Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < securityprofiles.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right security
            profile.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Security Profile
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SecurityProfileDeleteModal
