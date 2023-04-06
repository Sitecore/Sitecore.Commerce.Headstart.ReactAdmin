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
  Tag,
  Text,
  UseDisclosureProps,
  VStack
} from "@chakra-ui/react"
import {AdminUsers} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {IAdminUser} from "types/ordercloud/IAdminUser"

interface IAdminUserDeleteModal {
  adminUsers?: IAdminUser[]
  disclosure: UseDisclosureProps
  onComplete: (idsToRemove: string[]) => void
}

const AdminUserDeleteModal: FC<IAdminUserDeleteModal> = ({adminUsers, disclosure, onComplete}) => {
  const {isOpen, onClose} = disclosure
  const [showAdminUsers, setShowAdminUsers] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowAdminUsers(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(adminUsers.map((adminUser) => AdminUsers.Delete(adminUser?.ID)))
      onComplete(adminUsers.map((adminUser) => adminUser.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [adminUsers, onComplete, onClose])

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
              {`Deleting ${adminUsers.length} Selected Admin User${adminUsers.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowAdminUsers((s) => !s)}>
              {showAdminUsers ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showAdminUsers}>
            <List mb={5}>
              {adminUsers.map((adminUser, i) => (
                <>
                  <ListItem key={adminUser.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{adminUser.ID}</Badge>
                        <Text>
                          {adminUser.FirstName} {adminUser.LastName}
                        </Text>
                      </VStack>
                      <Tag colorScheme={adminUser.Active ? "green" : "red"}>
                        {adminUser.Active ? "Active" : "Inactive"}
                      </Tag>
                    </HStack>
                  </ListItem>
                  {i < adminUsers.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right admin user.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete Admin User
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default AdminUserDeleteModal
