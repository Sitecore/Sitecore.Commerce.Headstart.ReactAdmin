import {
  Heading,
  Box,
  Text,
  Button,
  HStack,
  Tooltip,
  Collapse,
  Center,
  Textarea,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Flex,
  Select,
  Input,
  InputGroup,
  InputLeftAddon
} from "@chakra-ui/react"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {ProductXPs} from "lib/types/ProductXPs"
import {Product, Products} from "ordercloud-javascript-sdk"
import {ChangeEvent, useEffect, useState} from "react"
import {FiCheck, FiX, FiPlus, FiMinus, FiMinusSquare} from "react-icons/fi"
import BrandedSpinner from "../branding/BrandedSpinner"
import {useErrorToast} from "lib/hooks/useToast"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductXpInformation({composedProduct, setComposedProduct}: ProductDataProps) {
  const {isOpen: isOpenAddXP, onOpen: onOpenAddXP, onClose: onCloseAddXP} = useDisclosure()

  const [isAdding, setIsAdding] = useState(false)
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<ProductXPs>(Object.assign({}, composedProduct?.Product?.xp))
  const [newXpFormName, setNewXpFormName] = useState<string>("")
  const [newXpFormType, setNewXpFormType] = useState<string>("text")
  const [newXpFormValue, setNewXpFormValue] = useState<string | number>("")
  const [toBeDeleted, setToBeDeleted] = useState<string[]>([])
  const [expanded, setExpanded] = useState(true)
  const errorToast = useErrorToast()

  useEffect(() => {
    setFormValues(Object.assign({}, composedProduct?.Product?.xp))
  }, [composedProduct?.Product?.xp])

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues(Object.assign({}, composedProduct?.Product?.xp))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    e.preventDefault()
    setIsDeleting(false)
    setIsEditingBasicData(false)
    setFormValues(Object.assign({}, composedProduct?.Product?.xp))
    setToBeDeleted([])
  }

  const handleInputChange =
    (fieldKey: string) => (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      var newVal = e.target.type == "number" ? Number(e.target.value) : e.target.value
      var tmpXPs = formValues
      tmpXPs[fieldKey] = newVal
      setFormValues(tmpXPs)
    }

  const handleNewXPChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    //var newVal = e.target.type == "number" ? Number(e.target.value) : e.target.value
    //console.log(e.target.name)
    switch (e.target.name) {
      case "name":
        setNewXpFormName(e.target.value)
        break
      case "type":
        setNewXpFormType(e.target.value)
        break
      case "value":
        setNewXpFormValue(newXpFormType == "number" ? Number(e.target.value) : e.target.value)
        break
      default:
        return
    }
    //setNewXPFormValues(tempNewVal)
    //console.log(e.target.value)
  }

  const onDeleteProductXPClicked = (key: string) => async (e) => {
    setIsLoading(true)
    setIsDeleting(true)
    // console.log("key:" + key)
    // console.log("toBeDeleted.includes(key):", toBeDeleted.includes(key))
    // console.log("toBeDeleted.indexOf(key)", toBeDeleted.indexOf(key))
    // console.log(
    //   "toBeDeleted.filter((thing) => thing !== key)",
    //   toBeDeleted.filter((thing) => thing !== key)
    // )
    const tempDeleted = toBeDeleted.includes(key) ? toBeDeleted.filter((thing) => thing !== key) : [...toBeDeleted, key]
    setToBeDeleted(tempDeleted)
    setIsLoading(false)
    //console.log(tempDeleted)
  }

  const onNewProductXP = async () => {
    //console.log(formValues[newXpFormName])
    if (formValues[newXpFormName] !== undefined) {
      errorToast({
        title: "Validation Error",
        description: "Extended property of that name already exists"
      })
      return
    }
    setIsLoading(true)
    //console.log("newXpFormName:", newXpFormName)
    //console.log("newXpFormType:", newXpFormType)
    //console.log("newXpFormValue:", newXpFormValue)

    formValues[newXpFormName] = newXpFormValue
    onNewProductXPClosed()
    setIsLoading(false)
  }
  const onNewProductXPClosed = async () => {
    //console.log("close function")
    setNewXpFormName("")
    setNewXpFormType("text")
    setNewXpFormValue("")

    onCloseAddXP()
  }
  const renderCurrentSelection = () => {
    switch (newXpFormType) {
      case "text":
        return (
          <>
            <Text pt={"GlobalPadding"}>Value:</Text>
            <Input type={"text"} name={"value"} onChange={handleNewXPChange} />
          </>
        )
      case "number":
        return (
          <>
            <Text pt={"GlobalPadding"}>Value:</Text>
            <Input type={"number"} name={"value"} onChange={handleNewXPChange} />
          </>
        )
      case "tag":
        return (
          <>
            <Text pt={"GlobalPadding"}>Value:</Text>
            <Select name={"value"}>
              {["1", "2", "3", "4", "5", "6"].map((x, key) => {
                return (
                  <option key={key} value={x}>
                    {x}
                  </option>
                )
              })}
            </Select>
          </>
        )
      default:
        return ""
    }
  }

  const onProductSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newProduct: Product<ProductXPs> = composedProduct.Product
      delete newProduct.xp
      var tempXPs = Object.assign({}, formValues)
      toBeDeleted.forEach((e) => delete tempXPs[e])
      newProduct["xp"] = tempXPs
      //console.log("Deleting XPs newProduct")
      //console.log(newProduct)
      await Products.Save(composedProduct?.Product?.ID, newProduct)
      setIsDeleting(false)
      setToBeDeleted([])
    } else {
      const newProduct: Product<ProductXPs> = {
        Name: composedProduct?.Product?.Name,
        xp: formValues
      }
      await Products.Patch(composedProduct?.Product?.ID, newProduct)
    }

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 1000)
    }, 4500)
  }

  return (
    <>
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}}>Extended Properties</Heading>

        {(isLoading || !formValues) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <Collapse in={expanded}>
            <Box width="full" pb="50" pt={4} h="100%">
              <Text opacity={0.5} fontWeight={"bold"}></Text>
              {Object.keys(formValues).map((name, key) => {
                return isEditingBasicData && typeof formValues[name] != "object" ? (
                  <HStack key={key} mt={3}>
                    <InputGroup>
                      <InputLeftAddon w={"200px"}>{name}</InputLeftAddon>
                      {formValues[name].length > 90 ? (
                        <Textarea
                          width={"75%"}
                          resize={"none"}
                          defaultValue={formValues[name]}
                          borderColor={"gray.800"}
                          onChange={handleInputChange(name)}
                          h={"300"}
                          disabled={toBeDeleted.includes(name)}
                        />
                      ) : (
                        <Input
                          width={"75%"}
                          defaultValue={formValues[name]}
                          type={typeof formValues[name] == "string" ? "text" : "number"}
                          onChange={handleInputChange(name)}
                          disabled={toBeDeleted.includes(name)}
                        />
                      )}
                      <Tooltip pt={2} label="Remove Extended Property">
                        <Button onClick={onDeleteProductXPClicked(name)}>
                          {toBeDeleted.includes(name) ? <FiMinusSquare /> : <FiMinus />}
                        </Button>
                      </Tooltip>
                    </InputGroup>
                  </HStack>
                ) : (
                  <></>
                )
              })}
              {Object.keys(formValues).map((name, key) => {
                return !isEditingBasicData && typeof formValues[name] != "object" ? (
                  <HStack key={key} mt={4}>
                    <InputGroup>
                      <InputLeftAddon w={"200px"}>{name}</InputLeftAddon>
                      <Input width={"100%"} defaultValue={formValues[name]} readOnly />
                    </InputGroup>
                  </HStack>
                ) : (
                  <></>
                )
              })}
              {isEditingBasicData /*&&
              formValues?.images[formValues?.images?.length - 1]?.Url != ""*/ ? (
                <Tooltip label="Add new Extended Property">
                  <Box pt={4}>
                    <Center>
                      <Button onClick={onOpenAddXP}>
                        <FiPlus />
                      </Button>
                    </Center>
                  </Box>
                </Tooltip>
              ) : (
                <></>
              )}
            </Box>
          </Collapse>
        )}
      </>
      {isEditingBasicData ? (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Save">
            <Button aria-label="Save" onClick={onProductSave} variant="primarybutton">
              Save
            </Button>
          </Tooltip>
          <Tooltip label="Cancel">
            <Button colorScheme="brandButtons" aria-label="Cancel" onClick={onAbortClicked} variant="secondaryButton">
              Cancel
            </Button>
          </Tooltip>
        </HStack>
      ) : (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Edit">
            <Button aria-label="Edit" onClick={onEditClicked} variant="tertiaryButton">
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
              <ModalHeader>
                Add a new Extended Property
                <Flex float={"right"}>
                  <Button colorScheme="purple" mr={3} onClick={onNewProductXP}>
                    <FiCheck />
                  </Button>
                  <Button onClick={onNewProductXPClosed}>
                    <FiX />
                  </Button>
                </Flex>
              </ModalHeader>

              <ModalBody mb={"10px"}>
                <Text>Name:</Text>
                <Input type={"text"} name={"name"} onChange={handleNewXPChange} />
                <Text pt={"GlobalPadding"}>Field Type:</Text>
                <Select onChange={handleNewXPChange} name={"type"}>
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="tag">tag</option>
                </Select>
                {renderCurrentSelection()}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
