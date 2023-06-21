import {
  Box,
  Button,
  Collapse,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  Text,
  Tooltip,
  useColorModeValue,
  Switch
} from "@chakra-ui/react"
import {ChangeEvent, useEffect, useState} from "react"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {Inventory, Product, Products} from "ordercloud-javascript-sdk"
import BrandedSpinner from "../branding/BrandedSpinner"
import {IProduct} from "types/ordercloud/IProduct"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductInventoryData({composedProduct, setComposedProduct}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("green.500", "green.300")
  const errorColor = useColorModeValue("red.500", "red.300")
  const [expanded, setExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    inventoryEnabled: composedProduct?.Product?.Inventory?.Enabled,
    lastUpdated: composedProduct?.Product?.Inventory?.LastUpdated,
    notificationPoint: composedProduct?.Product?.Inventory?.NotificationPoint,
    orderCanExceed: composedProduct?.Product?.Inventory?.OrderCanExceed,
    variantLevelTracking: composedProduct?.Product?.Inventory?.VariantLevelTracking,
    quantityAvailable: composedProduct?.Product?.Inventory?.QuantityAvailable
  })

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: e.target.value}))
  }

  const handleNumberInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({
      ...v,
      [fieldKey]: e.target.value == "" ? 0 : e.target.value
    }))
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
  }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["inventoryEnabled"]: composedProduct?.Product?.Inventory?.Enabled,
      ["lastUpdated"]: composedProduct?.Product?.Inventory?.LastUpdated,
      ["notificationPoint"]: composedProduct?.Product?.Inventory?.NotificationPoint,
      ["orderCanExceed"]: composedProduct?.Product?.Inventory?.OrderCanExceed,
      ["variantLevelTracking"]: composedProduct?.Product?.Inventory?.VariantLevelTracking,
      ["quantityAvailable"]: composedProduct?.Product?.Inventory?.QuantityAvailable
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["inventoryEnabled"]: composedProduct?.Product?.Inventory?.Enabled,
      ["lastUpdated"]: composedProduct?.Product?.Inventory?.LastUpdated,
      ["notificationPoint"]: composedProduct?.Product?.Inventory?.NotificationPoint,
      ["orderCanExceed"]: composedProduct?.Product?.Inventory?.OrderCanExceed,
      ["variantLevelTracking"]: composedProduct?.Product?.Inventory?.VariantLevelTracking,
      ["quantityAvailable"]: composedProduct?.Product?.Inventory?.QuantityAvailable
    }))
    setIsEditingBasicData(false)
  }

  useEffect(() => {
    setFormValues({
      inventoryEnabled: composedProduct?.Product?.Inventory?.Enabled,
      lastUpdated: composedProduct?.Product?.Inventory?.LastUpdated,
      notificationPoint: composedProduct?.Product?.Inventory?.NotificationPoint,
      orderCanExceed: composedProduct?.Product?.Inventory?.OrderCanExceed,
      variantLevelTracking: composedProduct?.Product?.Inventory?.VariantLevelTracking,
      quantityAvailable: composedProduct?.Product?.Inventory?.QuantityAvailable
    })
  }, [
    composedProduct?.Product?.Inventory?.Enabled,
    composedProduct?.Product?.Inventory?.LastUpdated,
    composedProduct?.Product?.Inventory?.NotificationPoint,
    composedProduct?.Product?.Inventory?.OrderCanExceed,
    composedProduct?.Product?.Inventory?.QuantityAvailable,
    composedProduct?.Product?.Inventory?.VariantLevelTracking
  ])

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedInventory: Inventory = {
      Enabled: formValues.inventoryEnabled,
      // LastUpdated: formValues.lastUpdated,
      NotificationPoint: formValues.notificationPoint,
      OrderCanExceed: formValues.orderCanExceed,
      QuantityAvailable: formValues.quantityAvailable,
      VariantLevelTracking: formValues.variantLevelTracking
    }

    const patchedProduct: Product = {
      Name: composedProduct?.Product?.Name,
      Inventory: patchedInventory
    }
    await Products.Patch<IProduct>(composedProduct?.Product?.ID, patchedProduct)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 2000)
    }, 4000)
  }

  return (
    <>
      <>
        {(!composedProduct?.Product || isLoading) && expanded ? (
          <Box pt={6} textAlign={"center"}>
            Updating... <BrandedSpinner />
          </Box>
        ) : (
          <>
            <Heading size={{base: "sm", md: "md", lg: "md"}} mb={expanded ? 6 : 0}>
              Inventory
            </Heading>
            <Collapse in={expanded}>
              <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                <Container pb="50">
                  <Box width="full">
                    <Text>Inventory Enabled?:</Text>
                    <Switch
                      isChecked={formValues.inventoryEnabled}
                      isReadOnly={!isEditingBasicData}
                      onChange={handleCheckboxChange("InventoryEnabled")}
                      colorScheme="teal"
                    />
                  </Box>
                  <Tooltip label={isEditingBasicData ? "Last Updated Date is readonly" : ""}>
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Last Updated:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          disabled={true}
                          value={formValues.lastUpdated}
                          onChange={handleInputChange("lastUpdated")}
                        />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {new Date(composedProduct?.Product?.Inventory?.LastUpdated)?.toLocaleString() ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                  </Tooltip>
                  <Box width="full" pb={2}>
                    <Text>Notification Point:</Text>
                    {isEditingBasicData ? (
                      <Input
                        type={"number"}
                        value={formValues.notificationPoint}
                        onChange={handleNumberInputChange("notificationPoint")}
                      />
                    ) : (
                      <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                        {composedProduct?.Product?.Inventory?.NotificationPoint ?? "Not set"}
                      </Heading>
                    )}
                  </Box>
                  <Box width="full" pb={2}>
                    <Text opacity={0.5} fontWeight={"bold"}>
                      Order can exceed?:
                    </Text>
                    {isEditingBasicData ? (
                      <Switch
                        isChecked={formValues.orderCanExceed}
                        onChange={handleCheckboxChange("orderCanExceed")}
                        colorScheme="teal"
                      />
                    ) : (
                      <Switch
                        isChecked={formValues.orderCanExceed}
                        isReadOnly
                        onChange={handleCheckboxChange("orderCanExceed")}
                        colorScheme="teal"
                      />
                    )}
                  </Box>
                </Container>
                <Container>
                  <Box width="full" pb={2}>
                    <Text>Variant Level Tracking?:</Text>
                    <Switch
                      isChecked={formValues.variantLevelTracking}
                      isReadOnly={!isEditingBasicData}
                      onChange={handleCheckboxChange("variantLevelTracking")}
                      colorScheme="teal"
                    />
                  </Box>
                  <Tooltip
                    label={
                      "In case Inventory records are used, this value is the automatically the sum of all inventory records"
                    }
                  >
                    <Box width="full" pb={2}>
                      <Text opacity={0.5} fontWeight={"bold"}>
                        Quantity Available:
                      </Text>
                      {isEditingBasicData ? (
                        <Input
                          type={"number"}
                          value={formValues.quantityAvailable}
                          onChange={handleNumberInputChange("quantityAvailable")}
                        />
                      ) : (
                        <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                          {composedProduct?.Product?.Inventory?.QuantityAvailable ?? "Not set"}
                        </Heading>
                      )}
                    </Box>
                  </Tooltip>
                </Container>
              </Flex>
            </Collapse>
          </>
        )}
      </>
      {isEditingBasicData ? (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Save">
            <Button aria-label="Save" variant="solid" colorScheme="primary" onClick={onSaveClicked}>
              Save
            </Button>
          </Tooltip>
          <Tooltip label="Cancel">
            <Button aria-label="Cancel" variant="outline" onClick={onAbortClicked}>
              Cancel
            </Button>
          </Tooltip>
        </HStack>
      ) : (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Edit">
            <Button aria-label="Edit" colorScheme="secondary" onClick={onEditClicked}>
              Edit
            </Button>
          </Tooltip>
        </HStack>
      )}
    </>
  )
}
