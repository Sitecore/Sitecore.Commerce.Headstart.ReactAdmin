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
import {Product, Products} from "ordercloud-javascript-sdk"
import BrandedSpinner from "../branding/BrandedSpinner"
import {IProduct} from "types/ordercloud/IProduct"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductData({composedProduct, setComposedProduct}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const color = useColorModeValue("textColor.100", "textColor.300")
  const [expanded, setExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    name: composedProduct?.Product?.Name,
    id: composedProduct?.Product?.ID,
    description: composedProduct?.Product?.Description,
    defaultPriceScheduleId: composedProduct?.Product?.DefaultPriceScheduleID,
    quantityMultiplier: composedProduct?.Product?.QuantityMultiplier,
    shipFromAddress: composedProduct?.Product?.ShipFromAddressID,
    returnable: composedProduct?.Product?.Returnable,
    isActive: composedProduct?.Product?.Active,
    allSuppliersCanSell: composedProduct?.Product?.AllSuppliersCanSell,
    defaultSupplierId: composedProduct?.Product?.DefaultSupplierID
  })

  useEffect(() => {
    setFormValues({
      name: composedProduct?.Product?.Name,
      id: composedProduct?.Product?.ID,
      description: composedProduct?.Product?.Description,
      defaultPriceScheduleId: composedProduct?.Product?.DefaultPriceScheduleID,
      quantityMultiplier: composedProduct?.Product?.QuantityMultiplier,
      shipFromAddress: composedProduct?.Product?.ShipFromAddressID,
      returnable: composedProduct?.Product?.Returnable,
      isActive: composedProduct?.Product?.Active,
      allSuppliersCanSell: composedProduct?.Product?.AllSuppliersCanSell,
      defaultSupplierId: composedProduct?.Product?.DefaultSupplierID
    })
  }, [
    composedProduct?.Product?.Active,
    composedProduct?.Product?.AllSuppliersCanSell,
    composedProduct?.Product?.DefaultPriceScheduleID,
    composedProduct?.Product?.DefaultSupplierID,
    composedProduct?.Product?.Description,
    composedProduct?.Product?.ID,
    composedProduct?.Product?.Name,
    composedProduct?.Product?.QuantityMultiplier,
    composedProduct?.Product?.Returnable,
    composedProduct?.Product?.ShipFromAddressID
  ])

  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    if (fieldKey == "name" && e.target.value == "") {
      return
    }
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
      ["name"]: composedProduct?.Product?.Name,
      ["id"]: composedProduct?.Product?.ID,
      ["description"]: composedProduct?.Product?.Description,
      ["defaultPriceScheduleId"]: composedProduct?.Product?.DefaultPriceScheduleID,
      ["quantityMultiplier"]: composedProduct?.Product?.QuantityMultiplier,
      ["shipFromAddress"]: composedProduct?.Product?.ShipFromAddressID,
      ["returnable"]: composedProduct?.Product?.Returnable,
      ["isActive"]: composedProduct?.Product?.Active,
      ["allSuppliersCanSell"]: composedProduct?.Product?.AllSuppliersCanSell
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["name"]: composedProduct?.Product?.Name,
      ["id"]: composedProduct?.Product?.ID,
      ["description"]: composedProduct?.Product?.Description,
      ["defaultPriceScheduleId"]: composedProduct?.Product?.DefaultPriceScheduleID,
      ["quantityMultiplier"]: composedProduct?.Product?.QuantityMultiplier,
      ["shipFromAddress"]: composedProduct?.Product?.ShipFromAddressID,
      ["returnable"]: composedProduct?.Product?.Returnable,
      ["isActive"]: composedProduct?.Product?.Active,
      ["allSuppliersCanSell"]: composedProduct?.Product?.AllSuppliersCanSell
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedProduct: Product = {
      Name: formValues.name,
      Active: formValues.isActive,
      AllSuppliersCanSell: formValues.allSuppliersCanSell,
      DefaultPriceScheduleID: formValues.defaultPriceScheduleId,
      Description: formValues.description,
      // ID: formValues.id,
      QuantityMultiplier: formValues.quantityMultiplier,
      Returnable: formValues.returnable,
      ShipFromAddressID: formValues.shipFromAddress
    }
    await Products.Patch<IProduct>(composedProduct?.Product?.ID, patchedProduct)

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 2500)
    }, 4500)
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
              Product Data
            </Heading>
            <Collapse in={expanded}>
              <Flex flexDirection={{base: "column", sm: "column", md: "row"}}>
                <Container pt="0" pl="0" pr="0" pb="50">
                  <Tooltip label={isEditingBasicData ? "Product Name is mandatory to fill" : ""}>
                    <Box width="full" pb={2}>
                      <Text>Product Name:</Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.name} onChange={handleInputChange("name")} />
                      ) : (
                        <Input border={"1px"} value={composedProduct?.Product?.Name} readOnly />
                      )}
                    </Box>
                  </Tooltip>
                  <Tooltip label={isEditingBasicData ? "ID is not changeable" : ""}>
                    <Box width="full" pb={2}>
                      <Text>ID:</Text>
                      {isEditingBasicData ? (
                        <Input readOnly value={formValues.id} onChange={handleInputChange("productId")} />
                      ) : (
                        <Input value={composedProduct?.Product?.ID} readOnly />
                      )}
                    </Box>
                  </Tooltip>

                  <Tooltip label="When provided, no explicit PriceSchedule assignment is required. When a PriceSchedule assignment exists, it will override any default provided.">
                    <Box width="full" pb={2}>
                      <Text>Default Price Schedule ID:</Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues.defaultPriceScheduleId}
                          onChange={handleInputChange("defaultPriceScheduleId")}
                        />
                      ) : (
                        <Input value={composedProduct?.Product?.DefaultPriceScheduleID ?? "Not set"} readOnly />
                      )}
                    </Box>
                  </Tooltip>
                  <Box width="full" pb={2}>
                    <Text>Description:</Text>
                    {isEditingBasicData ? (
                      <Input value={formValues.description} onChange={handleInputChange("description")} />
                    ) : (
                      <Input value={composedProduct?.Product?.Description} readOnly />
                    )}
                  </Box>
                </Container>
                <Container>
                  <Tooltip label="Marketplace Owner or Supplier AddressID where the product will be shipped from. Can be used to calculate shipping costs.">
                    <Box width="full" pb={2}>
                      <Text>Ship from Address:</Text>
                      {isEditingBasicData ? (
                        <Input value={formValues.shipFromAddress} onChange={handleInputChange("shipFromAddress")} />
                      ) : (
                        <Input value={composedProduct?.Product?.ShipFromAddressID ?? "Not set"} readOnly />
                      )}
                    </Box>
                  </Tooltip>
                  <Tooltip label="If this property has a value and a SupplierID isn't explicitly passed when creating a LineItem, this SupplierID will be used.">
                    <Box width="full" pb={2}>
                      <Text>Default Supplier ID</Text>
                      {isEditingBasicData ? (
                        <Input
                          value={formValues?.defaultSupplierId}
                          onChange={handleInputChange("defaultSupplierId")}
                        />
                      ) : (
                        <Input value={composedProduct?.Product?.DefaultSupplierID ?? "Not set"} readOnly />
                      )}
                    </Box>
                  </Tooltip>
                  <Box width="full" pb={2}>
                    <Text>All Suppliers can sell? </Text>
                    {isEditingBasicData ? (
                      <Switch
                        isChecked={formValues.allSuppliersCanSell}
                        onChange={handleCheckboxChange("allSuppliersCanSell")}
                        colorScheme="teal"
                      />
                    ) : (
                      <Switch
                        isChecked={formValues.allSuppliersCanSell}
                        isReadOnly
                        onChange={handleCheckboxChange("allSuppliersCanSell")}
                        colorScheme="teal"
                      />
                    )}
                  </Box>
                </Container>
                <Container>
                  <Tooltip label="For reference only, does not influence any OrderCloud behavior. Used to indicate an amount per Quantity.">
                    <Box width="full" pb={2}>
                      <Text>Quantity Multiplier:</Text>
                      {isEditingBasicData ? (
                        <Input
                          type={"number"}
                          value={formValues.quantityMultiplier}
                          onChange={handleNumberInputChange("quantityMultiplier")}
                        />
                      ) : (
                        <Input value={composedProduct?.Product?.QuantityMultiplier ?? "Not set"} readOnly />
                      )}
                    </Box>
                  </Tooltip>
                  <Box width="full" pb={2}>
                    <Text>Returnable? </Text>
                    {isEditingBasicData ? (
                      <Switch
                        isChecked={formValues.returnable}
                        onChange={handleCheckboxChange("returnable")}
                        colorScheme="teal"
                      />
                    ) : (
                      <Switch
                        isChecked={formValues.returnable}
                        isReadOnly
                        onChange={handleCheckboxChange("returnable")}
                        colorScheme="teal"
                      />
                    )}
                  </Box>
                  <Box width="full" pb={2}>
                    <Text>Is Active </Text>
                    {isEditingBasicData ? (
                      <Switch
                        isChecked={formValues.isActive}
                        onChange={handleCheckboxChange("isActive")}
                        colorScheme="teal"
                      />
                    ) : (
                      <Switch
                        isChecked={formValues.isActive}
                        isReadOnly
                        onChange={handleCheckboxChange("isActive")}
                        colorScheme="teal"
                      />
                    )}
                  </Box>
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
