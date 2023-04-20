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
import {SupplierUserGroups} from "ordercloud-javascript-sdk"
import {FC, useCallback, useEffect, useState} from "react"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"

interface ISupplierUserGroupDeleteModal {
  usergroups?: ISupplierUserGroup[]
  disclosure: UseDisclosureProps
  supplierID: string
  onComplete: (idsToRemove: string[]) => void
}

const SupplierUserGroupDeleteModal: FC<ISupplierUserGroupDeleteModal> = ({
  usergroups,
  disclosure,
  supplierID,
  onComplete
}) => {
  const {isOpen, onClose} = disclosure
  const [showusergroups, setShowusergroups] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setLoading(false)
      setShowusergroups(false)
    }
  }, [isOpen])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await Promise.all(usergroups.map((usergroup) => SupplierUserGroups.Delete(supplierID, usergroup?.ID)))
      onComplete(usergroups.map((usergroup) => usergroup.ID))
      onClose()
    } finally {
      setLoading(false)
    }
  }, [supplierID, usergroups, onComplete, onClose])

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
              {`Deleting ${usergroups.length} Selected User Group${usergroups.length === 1 ? "" : "s"}`}
            </Heading>
            <Button variant="link" onClick={() => setShowusergroups((s) => !s)}>
              {showusergroups ? "Hide" : "Show"}
            </Button>
          </HStack>
          <Collapse in={showusergroups}>
            <List mb={5}>
              {usergroups.map((usergroup, i) => (
                <>
                  <ListItem key={usergroup.ID} as={HStack}>
                    <HStack flexGrow={1} justifyContent="space-between">
                      <VStack alignItems="start">
                        <Badge>{usergroup.ID}</Badge>
                        <Text>{usergroup.Name}</Text>
                      </VStack>
                    </HStack>
                  </ListItem>
                  {i < usergroups.length - 1 && <Divider my={3} />}
                </>
              ))}
            </List>
          </Collapse>
          <Text>
            This is an irreversible, destructive action. Please make sure that you have selected the right usergroup.
          </Text>
        </ModalBody>
        <ModalFooter as={HStack}>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete User Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SupplierUserGroupDeleteModal
