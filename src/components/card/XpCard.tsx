import {
  Heading,
  Box,
  Text,
  Card,
  Button,
  HStack,
  Tooltip,
  Center,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Select,
  Input,
  Textarea,
  CheckboxGroup,
  Checkbox
} from "@chakra-ui/react"
import {ChangeEvent, MouseEventHandler, useEffect, useState} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import TagContainer from "../generic/tagContainer"
import {useErrorToast} from "hooks/useToast"

type DataProps<T> = {
  data: T & {xp?: unknown}
  formValues: unknown
  setFormValues: Function
  isLoading: boolean
  setIsLoading: Function
  isEditingBasicData: boolean
  setIsEditingBasicData: Function
  setIsDeleting: Function
  xpsToBeDeleted: string[]
  setXpsToBeDeleted: Function
  onSave: MouseEventHandler<HTMLButtonElement>
}

export default function XpCard<T>({
  data,
  formValues,
  setFormValues,
  isLoading,
  setIsLoading,
  isEditingBasicData,
  setIsEditingBasicData,
  setIsDeleting,
  xpsToBeDeleted,
  setXpsToBeDeleted,
  onSave
}: DataProps<T>) {
  const {isOpen: isOpenAddXP, onOpen: onOpenAddXP, onClose: onCloseAddXP} = useDisclosure()
  const {isOpen: isOpenEditXP, onOpen: onOpenEditXP, onClose: onCloseEditXP} = useDisclosure()

  const [isAdding, setIsAdding] = useState(false)
  const [newXpFormName, setNewXpFormName] = useState<string>("")
  const [newXpFormType, setNewXpFormType] = useState<string>("text")
  const [newXpFormValue, setNewXpFormValue] = useState<string | number>("")
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState("")
  //const [editingType, setEditingType] = useState("text")
  const errorToast = useErrorToast()
  const tags = ["1", "2", "3", "4", "5", "6"]

  useEffect(() => {
    setFormValues(Object.assign({}, data?.xp))
  }, [data?.xp])

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues(Object.assign({}, data?.xp))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    e.preventDefault()
    setIsDeleting(false)
    setIsEditingBasicData(false)
    setFormValues(Object.assign({}, data?.xp))
    setXpsToBeDeleted([])
  }

  const handleXPChange = (name: string) => {
    setEditing(name)
    console.log("handleXPChange:formValues[name]:", formValues[name])
    setNewXpFormValue(formValues[name])
    onOpenEditXP()
  }
  const onEditProductXP = () => {
    setIsLoading(true)
    formValues[editing] = newXpFormValue
    onEditProductXPClosed()
    setIsLoading(false)
    return
  }

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      var newVal = e.target.type == "number" ? Number(e.target.value) : e.target.value
      var tmpXPs = formValues
      tmpXPs[fieldKey] = newVal
      setFormValues(tmpXPs)
    }

  const handleEditXP = (e) => {
    if (editing.endsWith("###")) {
      var strValues = newXpFormValue.toString()
      var tempValues = strValues.includes(",") ? strValues.split(",") : [strValues]
      tempValues = tempValues.includes(e.target.value)
        ? tempValues.filter((ele) => ele !== e.target.value)
        : [...tempValues, e.target.value]
      setNewXpFormValue(tempValues.length > 1 ? tempValues.join(",") : tempValues[0])
    } else setNewXpFormValue(typeof formValues[editing] == "string" ? e.target.value : Number(e.target.value))
  }
  const handleNewXPChange = (e) => {
    switch (e.target.name) {
      case "name":
        setNewXpFormName(e.target.value)
        break
      case "type":
        setNewXpFormType(e.target.value)
        break
      case "value":
        if (newXpFormType == "tag") {
          var strValues = newXpFormValue.toString()
          var tempValues = strValues.includes(",") ? strValues.split(",") : [strValues]
          tempValues = tempValues.includes(e.target.value)
            ? tempValues.filter((ele) => ele !== e.target.value)
            : [...tempValues, e.target.value]
          setNewXpFormValue(tempValues.length > 1 ? tempValues.join(",") : tempValues[0])
        } else {
          setNewXpFormValue(newXpFormType == "number" ? Number(e.target.value) : e.target.value)
        }

        break
      default:
        return
    }
  }

  const onDeleteProductXPClicked = (key: string) => async (e) => {
    setIsLoading(true)
    setIsDeleting(true)
    const tempDeleted = xpsToBeDeleted.includes(key)
      ? xpsToBeDeleted.filter((thing) => thing !== key)
      : [...xpsToBeDeleted, key]
    setXpsToBeDeleted(tempDeleted)
    setIsLoading(false)
  }

  const onNewProductXP = async () => {
    const TempXpFormName = newXpFormType == "tag" ? newXpFormName + "###" : newXpFormName
    console.log("TempXpFormName:", TempXpFormName)
    if (formValues[TempXpFormName] !== undefined) {
      errorToast({
        title: "Validation Error",
        description: "Extended property of that name already exists"
      })
      return
    }
    setIsLoading(true)

    formValues[TempXpFormName] = newXpFormValue
    onNewProductXPClosed()
    setIsLoading(false)
  }
  const onNewProductXPClosed = async () => {
    setNewXpFormName("")
    setNewXpFormType("text")
    setNewXpFormValue("")

    onCloseAddXP()
  }
  const onEditProductXPClosed = async () => {
    setEditing("")
    onCloseEditXP()
  }
  const renderCurrentSelection = () => {
    switch (newXpFormType) {
      case "text":
        return (
          <>
            <Text pt={"20px"}>Value:</Text>
            <Input type={"text"} name={"value"} onChange={handleNewXPChange} />
          </>
        )
      case "number":
        return (
          <>
            <Text pt={"20px"}>Value:</Text>
            <Input type={"number"} name={"value"} onChange={handleNewXPChange} />
          </>
        )
      case "tag":
        return (
          <>
            <Text pt={"20px"}>Value:</Text>
            <CheckboxGroup>
              {tags.map((x, key) => {
                return (
                  <Checkbox name={"value"} key={key} value={x} onChange={handleNewXPChange}>
                    {x}
                  </Checkbox>
                )
              })}
            </CheckboxGroup>
          </>
        )
      default:
        return ""
    }
  }
  const renderCurrentEditing = () => {
    const editingType = editing.endsWith("###") ? "tag" : typeof formValues[editing] == "string" ? "text" : "number"
    switch (editingType) {
      case "text":
        if (formValues[editing].length > 60)
          return (
            <>
              <Text pt={"20px"}>Value:</Text>
              <Textarea
                w={"100%"}
                h={"300"}
                resize={"none"}
                name={"value"}
                defaultValue={formValues[editing]}
                onChange={handleEditXP}
              />
            </>
          )
        else
          return (
            <>
              <Text pt={"20px"}>Value:</Text>
              <Input type={"text"} name={"value"} defaultValue={formValues[editing]} onChange={handleEditXP} />
            </>
          )

      case "number":
        return (
          <>
            <Text pt={"20px"}>Value:</Text>
            <Input type={"number"} name={"value"} defaultValue={formValues[editing]} onChange={handleEditXP} />
          </>
        )
      case "tag":
        return (
          <>
            <Text pt={"20px"}>Value:</Text>
            <CheckboxGroup
              defaultValue={formValues[editing]?.includes(",") ? formValues[editing].split(",") : [formValues[editing]]}
            >
              {tags.map((x, key) => {
                return (
                  <Checkbox onChange={handleEditXP} name={"value"} key={key} value={x}>
                    {x}
                  </Checkbox>
                )
              })}
            </CheckboxGroup>
          </>
        )
      default:
        return ""
    }
  }
  const renderEditType = () => {
    const myType = editing.endsWith("###") ? "tag" : typeof formValues[editing]
    console.log("myType:", myType)
    switch (myType) {
      case "string":
        return <Input type={"text"} name={"type"} value={"text"} readOnly />
      case "number":
        return <Input type={"text"} name={"type"} value={"number"} readOnly />
      case "tag":
        return <Input type={"text"} name={"type"} value={"tag"} readOnly />
      default:
        return ""
    }
  }

  return (
    <Card>
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}} mb={6}>
          Extended Properties
        </Heading>

        {(isLoading || !formValues) && expanded ? (
          <Box pt={6} textAlign={"center"} pb="50">
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <TagContainer
              tags={formValues}
              toBeDeleted={xpsToBeDeleted}
              isEditing={isEditingBasicData}
              onNameClicked={handleXPChange}
              onDeleteClicked={onDeleteProductXPClicked}
            />
          </>
        )}
        {isEditingBasicData /*&&
                  formValues?.images[formValues?.images?.length - 1]?.Url != ""*/ ? (
          <Tooltip label="Add new Extended Property">
            <Box pt={4} mb={20}>
              <Center>
                <Button variant="tertiaryButton" onClick={onOpenAddXP} minW="80px">
                  Add XP
                </Button>
              </Center>
            </Box>
          </Tooltip>
        ) : (
          <></>
        )}
      </>
      {isEditingBasicData ? (
        <HStack justifyContent="flex-end" alignItems="flex-end">
          <Tooltip label="Save">
            <Button variant="primaryButton" aria-label="Save" onClick={onSave} mr={2}>
              Save
            </Button>
          </Tooltip>
          <Tooltip label="Cancel">
            <Button colorScheme="brandButtons" aria-label="Cancel" variant="secondaryButton" onClick={onAbortClicked}>
              Cancel
            </Button>
          </Tooltip>
        </HStack>
      ) : (
        <HStack float={"right"} position="relative" bottom="20px" mt={3}>
          <Tooltip label="Edit">
            <Button aria-label="Edit" mt={4} variant="tertiaryButton" onClick={onEditClicked} minW="80px">
              Edit
            </Button>
          </Tooltip>
        </HStack>
      )}

      <Modal isOpen={isOpenAddXP} onClose={onNewProductXPClosed} size={"xl"}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isAdding ? (
            <ModalHeader textAlign={"center"}>
              Adding... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Add a new Extended Property</ModalHeader>

              <ModalBody mb={"10px"}>
                <Text>Name:</Text>
                <Input type={"text"} name={"name"} onChange={handleNewXPChange} />
                <Text pt={"20px"}>Field Type:</Text>
                <Select onChange={handleNewXPChange} name={"type"}>
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="tag">tag</option>
                </Select>
                {renderCurrentSelection()}
                <HStack justifyContent="space-between" w="100%">
                  <Button variant="secondaryButton" onClick={onNewProductXPClosed}>
                    Cancel
                  </Button>
                  <Button variant="primaryButton" mr={3} onClick={onNewProductXP}>
                    Save
                  </Button>
                </HStack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpenEditXP} onClose={onEditProductXPClosed} size={"xl"}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isAdding ? (
            <ModalHeader textAlign={"center"}>
              Saving... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Edit Extended Property</ModalHeader>

              <ModalBody mb={"10px"}>
                <Text>Name:</Text>
                <Input type={"text"} name={"name"} value={editing.replace("###", "")} readOnly />
                <Text pt={"20px"}>Field Type:</Text>
                {renderEditType()}
                {renderCurrentEditing()}
                <HStack justifyContent="space-between" w="100%">
                  <Button variant="secondaryButton" onClick={onEditProductXPClosed}>
                    Cancel
                  </Button>
                  <Button variant="primaryButton" mr={3} onClick={onEditProductXP}>
                    Save
                  </Button>
                </HStack>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  )
}
