import {
  Box,
  Button,
  Checkbox,
  Collapse,
  Container,
  Flex,
  HStack,
  Heading,
  Input,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useColorModeValue
} from "@chakra-ui/react"
import {ChangeEvent, useState} from "react"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {FiCheck, FiEdit, FiMinus, FiPlus, FiX} from "react-icons/fi"
import {Inventory, Product, Products, RequiredDeep} from "ordercloud-javascript-sdk"

import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductMeasurementData({composedProduct, setComposedProduct}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [expanded, setExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formValues, setFormValues] = useState({
    shipWeight: composedProduct?.Product?.ShipWeight,
    shipHeight: composedProduct?.Product?.ShipHeight,
    shipLength: composedProduct?.Product?.ShipLength,
    shipWidth: composedProduct?.Product?.ShipWidth
  })

  const handleNumberInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => ({
      ...v,
      [fieldKey]: e.target.value == "" ? 0 : e.target.value
    }))
  }

  const onEditClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["shipWeight"]: composedProduct?.Product?.ShipWeight,
      ["shipHeight"]: composedProduct?.Product?.ShipHeight,
      ["shipLength"]: composedProduct?.Product?.ShipLength,
      ["shipWidth"]: composedProduct?.Product?.ShipWidth
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    setFormValues((v) => ({
      ...v,
      ["shipWeight"]: composedProduct?.Product?.ShipWeight,
      ["shipHeight"]: composedProduct?.Product?.ShipHeight,
      ["shipLength"]: composedProduct?.Product?.ShipLength,
      ["shipWidth"]: composedProduct?.Product?.ShipWidth
    }))
    setIsEditingBasicData(false)
  }

  const onSaveClicked = async (e) => {
    setIsLoading(true)
    const patchedProduct: Product = {
      Name: composedProduct?.Product?.Name,
      ShipHeight: formValues?.shipHeight,
      ShipLength: formValues.shipLength,
      ShipWeight: formValues.shipWeight,
      ShipWidth: formValues.shipWidth
    }
    await Products.Patch(composedProduct?.Product?.ID, patchedProduct)

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
              Shipping Dimensions
            </Heading>
            <Collapse in={expanded}>
              <Box width="full" pb="50" pt={4} h="100%">
                <Box width="full" pb={2}>
                  <Text>Ship Weight:</Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipWeight}
                      onChange={handleNumberInputChange("shipWeight")}
                    />
                  ) : (
                    <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                      {composedProduct?.Product?.ShipWeight ?? "Not set"}
                    </Heading>
                  )}
                </Box>
                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Height:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipHeight}
                      onChange={handleNumberInputChange("shipHeight")}
                    />
                  ) : (
                    <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                      {composedProduct?.Product?.ShipHeight ?? "Not set"}
                    </Heading>
                  )}
                </Box>

                <Box width="full" pb={2}>
                  <Text>Ship Length:</Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipLength}
                      onChange={handleNumberInputChange("shipLength")}
                    />
                  ) : (
                    <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                      {composedProduct?.Product?.ShipLength ?? "Not set"}
                    </Heading>
                  )}
                </Box>

                <Box width="full" pb={2}>
                  <Text opacity={0.5} fontWeight={"bold"}>
                    Ship Width:
                  </Text>
                  {isEditingBasicData ? (
                    <Input
                      type={"number"}
                      value={formValues.shipWidth}
                      onChange={handleNumberInputChange("shipWidth")}
                    />
                  ) : (
                    <Heading fontSize={"xl"} fontFamily={"body"} fontWeight={500}>
                      {composedProduct?.Product?.ShipWidth ?? "Not set"}
                    </Heading>
                  )}
                </Box>
              </Box>
            </Collapse>
          </>
        )}
      </>
      {isEditingBasicData ? (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Save">
            <Button colorScheme="brandButtons" aria-label="Save" variant="primaryButton" onClick={onSaveClicked}>
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
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Edit">
            <Button colorScheme="brandButtons" aria-label="Edit" variant="tertiaryButton" onClick={onEditClicked}>
              Edit
            </Button>
          </Tooltip>
        </HStack>
      )}
    </>
  )
}
