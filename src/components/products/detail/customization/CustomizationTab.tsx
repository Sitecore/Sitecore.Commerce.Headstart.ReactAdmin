import {ProductDetailFormFields, defaultValues} from "../form-meta"
import {Card, CardHeader, Button, CardBody, Hide, ButtonGroup, IconButton, Flex, Text, Box} from "@chakra-ui/react"
import {TbEdit, TbTrash} from "react-icons/tb"
import {ProductXpModal} from "./ProductXpModal"
import {cloneDeep} from "lodash"
import {Control, useController} from "react-hook-form"
import {useEffect, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"

interface CustomizationTabProps {
  control: Control<ProductDetailFormFields>
  product: IProduct
}

export function CustomizationTab({control, product}: CustomizationTabProps) {
  const existingCustomPropertynames = Object.keys(product?.xp || {})
  const [extendedProperties, setExtendedProperties] = useState<{[key: string]: any}>({})
  const [extendedPropertyNames, setExtendedPropertyNames] = useState<string[]>([])
  const [extendedPropertyValues, setExtendedPropertyValues] = useState<string[]>([])

  const {
    field: {value: productXp, onChange}
  } = useController({name: "Product.xp", control})

  useEffect(() => {
    const getExtendedProperties = () => {
      const xp = cloneDeep(productXp)

      // exclude any extended properties that are being edited via the UI
      const nonUiXpFields = Object.keys(defaultValues.Product.xp)
      nonUiXpFields.forEach((field) => {
        delete xp[field]
      })

      // exclude any deeply  nested xp (not handled at this time)
      const xpFieldNames = Object.keys(xp)
      xpFieldNames.forEach((field) => {
        if (typeof xp[field] === "object") {
          delete xp[field]
        }
      })

      return xp
    }
    if (productXp) {
      const extendedProperties = getExtendedProperties()
      setExtendedProperties(extendedProperties)
      setExtendedPropertyNames(Object.keys(extendedProperties))
      setExtendedPropertyValues(Object.values(extendedProperties))
    }
  }, [productXp])

  const handleXpUpdate = (name: string, value: string) => {
    const updatedXp = cloneDeep(productXp)
    updatedXp[name] = value
    onChange(updatedXp)
  }

  const handleXpDelete = (name: string) => {
    const updatedXp = cloneDeep(productXp)
    delete updatedXp[name]
    onChange(updatedXp)
  }

  return (
    <Card w="100%">
      <CardHeader display="flex" alignItems={"center"} flexWrap="wrap" gap={4}>
        <Text fontSize="sm" color="gray.400" fontWeight="normal">
          Define custom properties for your product
        </Text>
        <ProductXpModal
          isCreatingNew={true}
          as="button"
          extendedProperties={extendedProperties}
          onUpdate={handleXpUpdate}
          buttonProps={{variant: "outline", colorScheme: "accent", ml: {md: "auto"}, children: "Add property"}}
        />
      </CardHeader>
      <CardBody p={6} display="flex" flexDirection={"column"} minH={"xs"}>
        {extendedPropertyValues.length > 0 ? (
          extendedPropertyValues.map((xpValue, index) => {
            return (
              <Box
                key={index}
                display="grid"
                gridTemplateColumns={"auto 2fr 2fr"}
                justifyContent="flex-start"
                w={"full"}
                maxW={{xl: "75%"}}
              >
                <Hide below="lg">
                  <ButtonGroup mr={2} alignItems="center">
                    <ProductXpModal
                      isCreatingNew={existingCustomPropertynames.includes(extendedPropertyNames[index])}
                      as="button"
                      extendedProperties={extendedProperties}
                      existingPropertyName={extendedPropertyNames[index]}
                      existingPropertyValue={xpValue}
                      onUpdate={handleXpUpdate}
                      buttonProps={{
                        children: "Edit"
                      }}
                    />
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleXpDelete(extendedPropertyNames[index])}
                    >
                      Delete
                    </Button>
                  </ButtonGroup>
                </Hide>
                <Hide above="lg">
                  <ButtonGroup
                    size="sm"
                    mr={{base: 3, md: 6}}
                    flexDirection={{base: "column", md: "row"}}
                    padding={{base: 1, md: 0}}
                    alignItems={{base: "flex-start", md: "center"}}
                    gap={2}
                    alignSelf="center"
                  >
                    <ProductXpModal
                      isCreatingNew={existingCustomPropertynames.includes(extendedPropertyNames[index])}
                      as="iconbutton"
                      extendedProperties={extendedProperties}
                      existingPropertyName={extendedPropertyNames[index]}
                      existingPropertyValue={xpValue}
                      onUpdate={handleXpUpdate}
                      iconButtonProps={{
                        icon: <TbEdit size="1rem" />,
                        "aria-label": "edit",
                        children: "Edit"
                      }}
                    />
                    <IconButton
                      ml={"0 !important"}
                      icon={<TbTrash size="1rem" />}
                      variant="outline"
                      borderColor="red.300"
                      color="red.300"
                      aria-label="delete"
                      onClick={() => handleXpDelete(extendedPropertyNames[index])}
                    >
                      Delete
                    </IconButton>
                  </ButtonGroup>
                </Hide>
                <Flex borderWidth={1} borderColor="gray.100" mt={"-1px"} px={4} py={2} alignItems="center">
                  <Text
                    fontSize="0.8rem"
                    fontWeight="bold"
                    color="blackAlpha.500"
                    textTransform="uppercase"
                    letterSpacing={1}
                    wordBreak={"break-word"}
                  >
                    {extendedPropertyNames[index]}
                  </Text>
                </Flex>
                <Flex borderWidth={1} borderColor="gray.100" px={4} py={2} mt={"-1px"} ml={"-1px"} alignItems="center">
                  <Text whiteSpace="pre-wrap" wordBreak="break-word">
                    {xpValue}
                  </Text>
                </Flex>
              </Box>
            )
          })
        ) : (
          <Text>No custom properties on this product</Text>
        )}
      </CardBody>
    </Card>
  )
}
