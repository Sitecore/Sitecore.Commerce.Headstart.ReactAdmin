import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  FormControl,
  HStack,
  Heading,
  Input,
  ListItem,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  UnorderedList,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react"
import {
  Buyer,
  Buyers,
  PriceSchedule,
  PriceSchedules,
  ProductAssignment,
  Products,
  UserGroup,
  UserGroups
} from "ordercloud-javascript-sdk"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {useEffect, useState} from "react"
import BrandedSpinner from "../branding/BrandedSpinner"
import BrandedTable from "../branding/BrandedTable"
import React from "react"
import {priceHelper} from "utils"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IBuyer} from "types/ordercloud/IBuyer"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductPriceScheduleAssignments({composedProduct, setComposedProduct}: ProductDataProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const color = useColorModeValue("textColor.900", "textColor.100")
  const [priceScheduleAssignments, setPriceScheduleAssignments] = useState<PriceScheduleWithAssignment[]>(null)
  const [defaultPriceScheduleAssignment, setDefaultPriceScheduleAssignment] = useState<PriceSchedule>(null)
  const cancelRef = React.useRef()
  const [newPriceScheduleAssignment, setNewPriceScheduleAssignment] = useState({
    priceSchedule: "",
    buyerGroup: "",
    userGroup: ""
  })
  const [isLinking, setIsLinking] = useState(false)
  const [availablePriceSchedule, setAvailablePriceSchedules] = useState<PriceSchedule[]>(null)
  const [availableBuyers, setAvailableBuyers] = useState<Buyer[]>(null)
  const [availableUsergroups, setAvailableUsergroups] = useState<UserGroup[]>(null)
  const [isChosen, setIsChosen] = useState({
    priceSchedule: false,
    buyerGroup: false
  })

  interface PriceScheduleWithAssignment {
    priceSchedule: PriceSchedule<any>
    assignment: ProductAssignment
  }

  useEffect(() => {
    async function GetProductCatalogAssignments() {
      if (composedProduct?.Product) {
        let priceSchedules: PriceScheduleWithAssignment[] = []
        const assignments = await Products.ListAssignments({
          productID: composedProduct?.Product?.ID
        })

        if (composedProduct?.Product?.DefaultPriceScheduleID) {
          const defaultPriceSchedule = await PriceSchedules.Get<IPriceSchedule>(
            composedProduct?.Product?.DefaultPriceScheduleID
          )
          setDefaultPriceScheduleAssignment(defaultPriceSchedule)
        }

        await Promise.all(
          assignments.Items.map(async (index) => {
            var priceSchedule = await PriceSchedules.Get<IPriceSchedule>(index.PriceScheduleID)
            const priceScheduleWithAssignment: PriceScheduleWithAssignment = {
              assignment: index,
              priceSchedule: priceSchedule
            }
            priceSchedules.push(priceScheduleWithAssignment)
          })
        )

        setPriceScheduleAssignments(priceSchedules)
      }
    }
    GetProductCatalogAssignments()
  }, [composedProduct])

  const onPriceScheduleAssignmentRemove = async (e) => {
    setIsLoading(true)
    e.preventDefault()
    const buyerId = e.currentTarget.dataset.buyerid
    const userGroupId = e.currentTarget.dataset.usergroupid
    await Products.DeleteAssignment(composedProduct?.Product?.ID, buyerId, {
      userGroupID: userGroupId
    })

    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLoading(false)
  }

  const onPriceScheduleLink = async (e) => {
    setIsLinking(true)
    e.preventDefault()
    const specProductAssignment: ProductAssignment = {
      ProductID: composedProduct?.Product?.ID,
      PriceScheduleID: newPriceScheduleAssignment.priceSchedule,
      BuyerID: newPriceScheduleAssignment.buyerGroup,
      UserGroupID: newPriceScheduleAssignment.userGroup
    }

    await Products.SaveAssignment(specProductAssignment)

    var product = await GetComposedProduct(composedProduct?.Product?.ID)
    setComposedProduct(product)
    setIsLinking(false)
    setNewPriceScheduleAssignment((v) => ({
      ...v,
      ["priceSchedule"]: "",
      ["buyerGroup"]: "",
      ["userGroup"]: ""
    }))
    setAvailablePriceSchedules(null)
    setAvailableBuyers(null)
    setExpanded(true)
    setIsChosen((v) => ({
      ...v,
      ["priceSchedule"]: false,
      ["buyerGroup"]: false
    }))
    onClose()
  }

  const onAvailableReferenceClick = (fieldKey: string) => (e) => {
    e.preventDefault()
    const chosenReference = e.currentTarget.dataset.id
    setNewPriceScheduleAssignment((v) => ({
      ...v,
      [fieldKey]: chosenReference
    }))
    setIsChosen((v) => ({
      ...v,
      [fieldKey]: true
    }))
  }

  const onLinkInputFocused = (fieldKey: string) => (e) => {
    const newValue = e.target.value
    executeSearch(fieldKey, newValue, false)
  }

  const onLinkInputChanged = (fieldKey: string) => (e) => {
    const newValue = e.target.value
    executeSearch(fieldKey, newValue, true)
  }

  const executeSearch = (fieldKey: string, fieldValue: string, resetOthers: boolean) => {
    const newValue = fieldValue
    if (resetOthers) {
      setIsChosen((v) => ({
        ...v,
        [fieldKey]: false
      }))
    }

    setNewPriceScheduleAssignment((v) => ({...v, [fieldKey]: newValue}))
    if (fieldKey == "priceSchedule") {
      if (resetOthers) {
        setIsChosen((v) => ({
          ...v,
          ["buyerGroup"]: false,
          ["userGroup"]: false
        }))
        setNewPriceScheduleAssignment((v) => ({
          ...v,
          ["buyerGroup"]: "",
          ["userGroup"]: ""
        }))
      }

      PriceSchedules.List<IPriceSchedule>({
        searchOn: ["Name", "ID"],
        search: newValue
      }).then((innerPriceSchedules) => {
        const priceScheduleIds = priceScheduleAssignments.map((item) => {
          return item.priceSchedule.ID
        })
        const filteredPriceSchedules = innerPriceSchedules?.Items?.filter(
          (innerPriceSchedule) => !priceScheduleIds.includes(innerPriceSchedule.ID)
        )
        setAvailablePriceSchedules(filteredPriceSchedules)
        setAvailableUsergroups(null)
        setAvailableBuyers(null)
      })
    } else if (fieldKey == "buyerGroup") {
      if (resetOthers) {
        setIsChosen((v) => ({
          ...v,
          ["userGroup"]: false
        }))
        setNewPriceScheduleAssignment((v) => ({
          ...v,
          ["userGroup"]: ""
        }))
      }

      Buyers.List<IBuyer>({
        searchOn: ["Name", "ID"],
        search: newValue
      }).then((innerBuyers) => {
        const buyerIds = priceScheduleAssignments
          .filter((item) => {
            item.priceSchedule.ID == newPriceScheduleAssignment.priceSchedule
          })
          .map((item) => {
            return item.assignment.BuyerID
          })
        const filteredAvailableBuyer = innerBuyers.Items.filter((buyer) => !buyerIds.includes(buyer.ID))
        setAvailableBuyers(filteredAvailableBuyer)
        setAvailableUsergroups(null)
        setAvailablePriceSchedules(null)
      })
    } else if (fieldKey == "userGroup") {
      UserGroups.List<IBuyerUserGroup>(newPriceScheduleAssignment.buyerGroup, {
        searchOn: ["Name", "ID"],
        search: newValue
      }).then((innerUserGroups) => {
        const userGroupIds = priceScheduleAssignments
          .filter((item) => {
            item.priceSchedule.ID == newPriceScheduleAssignment.priceSchedule &&
              item.assignment.BuyerID == newPriceScheduleAssignment.buyerGroup
          })
          .map((item) => {
            return item.assignment.UserGroupID
          })
        const filteredAvailableUserGroups = innerUserGroups.Items.filter(
          (userGroup) => !userGroupIds.includes(userGroup.ID)
        )
        setAvailableUsergroups(filteredAvailableUserGroups)
        setAvailableBuyers(null)
        setAvailablePriceSchedules(null)
      })
    }
  }

  return (
    <>
      <>
        <Heading size={{base: "sm", md: "md", lg: "md"}}>Price Schedules</Heading>{" "}
        {(isLoading || !composedProduct?.Product) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Box width="full" pb="50" pt={4}>
              {(priceScheduleAssignments?.length ?? 0) == 0 && defaultPriceScheduleAssignment == null ? (
                <>No Price Schedules</>
              ) : (
                <BrandedTable>
                  <Thead>
                    <Tr>
                      <Th color={color}>ID</Th>
                      <Th color={color}>Name</Th>
                      <Th color={color}>Price Breaks</Th>
                      <Th color={color}>Buyer Group</Th>
                      <Th color={color}>User Group</Th>
                      <Th color={color}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody alignContent={"center"}>
                    {defaultPriceScheduleAssignment != null ? (
                      <Tr>
                        <Td>{defaultPriceScheduleAssignment?.ID}</Td>
                        <Td>{defaultPriceScheduleAssignment?.Name}</Td>
                        <Td>
                          {" "}
                          <ul>
                            {defaultPriceScheduleAssignment?.PriceBreaks?.map((item, index) => {
                              return (
                                <li key={index}>
                                  Quantity: {item.Quantity} <br />
                                  Price: {priceHelper.formatPrice(item.Price)} <br />{" "}
                                  {priceHelper.formatPrice(item.SalePrice)
                                    ? "Sales Price: " + priceHelper.formatPrice(item.SalePrice)
                                    : null}
                                </li>
                              )
                            })}
                          </ul>
                        </Td>
                        <Td></Td>
                        <Td></Td>
                        <Td>DEFAULT</Td>
                      </Tr>
                    ) : null}

                    {priceScheduleAssignments?.map((item, index) => {
                      return (
                        <Tr key={index}>
                          <Td>{item.priceSchedule.ID}</Td>
                          <Td>{item.priceSchedule.Name}</Td>
                          <Td>
                            {" "}
                            <ul>
                              {item?.priceSchedule.PriceBreaks?.map((item, index) => {
                                return (
                                  <li key={index}>
                                    Quantity: {item.Quantity} <br /> Price: {priceHelper.formatPrice(item.Price)} <br />
                                    {priceHelper.formatPrice(item.SalePrice)
                                      ? "Sales Price: " + priceHelper.formatPrice(item.SalePrice)
                                      : null}
                                  </li>
                                )
                              })}
                            </ul>
                          </Td>
                          <Td>{item.assignment.BuyerID}</Td>
                          <Td>{item.assignment.UserGroupID}</Td>
                          <Td>
                            {" "}
                            <Tooltip label="Remove Price Schedule from Product">
                              <Button
                                colorScheme="brandButtons"
                                aria-label="Remove Price Schedule from Product"
                                variant="secondaryButton"
                                data-buyerId={item.assignment.BuyerID}
                                data-userGroupId={item.assignment.UserGroupID}
                                onClick={onPriceScheduleAssignmentRemove}
                              >
                                Delete
                              </Button>
                            </Tooltip>
                          </Td>
                        </Tr>
                      )
                    })}
                  </Tbody>
                </BrandedTable>
              )}
            </Box>
          </>
        )}
      </>
      <HStack float={"right"} position="absolute" bottom="20px">
        <Tooltip label="Add Price Schedule to Product">
          <Button
            colorScheme="brandButtons"
            aria-label="Add Price Schedule to Product"
            variant="tertiaryButton"
            onClick={onOpen}
          >
            Add Price Schedule
          </Button>
        </Tooltip>
      </HStack>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        size={"5xl"}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            {isLinking ? (
              <AlertDialogHeader textAlign={"center"} fontSize="lg" fontWeight="bold">
                Linking... <BrandedSpinner />
              </AlertDialogHeader>
            ) : (
              <>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Link Price Schedule to Product
                </AlertDialogHeader>

                <AlertDialogBody>Please fill in the following fields to link a Price Schedule</AlertDialogBody>
                <FormControl ml={6}>
                  <Input
                    autoComplete="off"
                    justifyContent={"center"}
                    width={"95%"}
                    aria-label="Price Schedule ID"
                    value={newPriceScheduleAssignment.priceSchedule}
                    onChange={onLinkInputChanged("priceSchedule")}
                    placeholder={"Search for Price Schedules..."}
                    onFocus={onLinkInputFocused("priceSchedule")}
                  />
                </FormControl>
                <FormControl ml={6} pt={4}>
                  <Input
                    autoComplete="off"
                    disabled={!isChosen.priceSchedule}
                    justifyContent={"center"}
                    width={"95%"}
                    aria-label="Buyer Id"
                    value={newPriceScheduleAssignment.buyerGroup}
                    onChange={onLinkInputChanged("buyerGroup")}
                    placeholder={"Search for Buyers..."}
                    onFocus={onLinkInputFocused("buyerGroup")}
                  />
                </FormControl>
                <FormControl ml={6} pt={4}>
                  <Input
                    autoComplete="off"
                    disabled={!isChosen.priceSchedule || !isChosen.buyerGroup}
                    justifyContent={"center"}
                    width={"95%"}
                    aria-label="User Group Id"
                    value={newPriceScheduleAssignment.userGroup}
                    onChange={onLinkInputChanged("userGroup")}
                    placeholder={"Search for User Groups ..."}
                    onFocus={onLinkInputFocused("userGroup")}
                  />
                </FormControl>
                {(availablePriceSchedule?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Price Schedules (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availablePriceSchedule.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableReferenceClick("priceSchedule")}
                              data-id={element.ID}
                            >
                              <b>Name:</b> {element.Name} | <b>ID: </b>
                              {element.ID}
                            </ListItem>
                          </Tooltip>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                {(availableBuyers?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available Buyers (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableBuyers.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableReferenceClick("buyerGroup")}
                              data-id={element.ID}
                            >
                              <b>Name:</b> {element.Name} | <b>ID: </b>
                              {element.ID}
                            </ListItem>
                          </Tooltip>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                {(availableUsergroups?.length ?? 0) > 0 ? (
                  <>
                    <Box pt={4} pl={4} pb={4} m={6} border={"1px solid white"}>
                      <Heading as="h3" size="md" pb={3}>
                        Available User Groups (Please choose...)
                      </Heading>
                      <UnorderedList>
                        {availableUsergroups.map((element, key) => (
                          <Tooltip key={key} label={"Click to choose"}>
                            <ListItem
                              textDecor={"none"}
                              _hover={{textDecor: "underline"}}
                              cursor={"copy"}
                              onClick={onAvailableReferenceClick("userGroup")}
                              data-id={element.ID}
                            >
                              <b>Name:</b> {element.Name} | <b>ID: </b>
                              {element.ID}
                            </ListItem>
                          </Tooltip>
                        ))}
                      </UnorderedList>
                    </Box>
                  </>
                ) : null}
                <AlertDialogFooter width={"full"} justifyContent={"space-between"}>
                  <Box width={"full"}>
                    {!isChosen.priceSchedule ? (
                      <Text pb={2}>Please start entering a price schedule ID and choose from the search</Text>
                    ) : !isChosen.buyerGroup ? (
                      <Text pb={2}>Please now start entering a buyer id and choose from the search</Text>
                    ) : (
                      <Text pb={2}>
                        Please optionally start entering an usergroup id and choose from the search if wanted
                      </Text>
                    )}
                    <Button width={"45%"} size={"md"} variant="tertiaryButton" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button
                      float={"right"}
                      width={"45%"}
                      size={"md"}
                      colorScheme="brandButtons"
                      onClick={onPriceScheduleLink}
                      variant="tertiaryButton"
                      ml={3}
                      disabled={!isChosen.priceSchedule || !isChosen.buyerGroup}
                    >
                      Link
                    </Button>
                  </Box>
                </AlertDialogFooter>
              </>
            )}
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
