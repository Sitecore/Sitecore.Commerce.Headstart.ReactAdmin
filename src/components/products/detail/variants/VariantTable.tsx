import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
  Badge,
  HStack,
  BoxProps
} from "@chakra-ui/react"
import {TbCactus} from "react-icons/tb"
import {Control} from "react-hook-form"
import {IVariant} from "types/ordercloud/IVariant"
import {CheckboxSingleControl, InputControl} from "@/components/react-hook-form"
import {GenerateVariantsButton} from "./GenerateVariantsButton"
import {ISpec} from "types/ordercloud/ISpec"
import {flatten, uniq} from "lodash"
import {ProductDetailFormFields} from "../form-meta"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"

interface VariantTableProps extends BoxProps {
  control: Control<ProductDetailFormFields>
  validationSchema: any
  variants: IVariant[]
  specs: ISpec[]
  onGenerateVariants: (shouldOverwrite: boolean) => void
}

export function VariantTable({
  control,
  variants,
  specs,
  onGenerateVariants,
  validationSchema,
  ...boxProps
}: VariantTableProps) {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  // if you change the color codes here make sure to change in SpecTable.tsx
  const colorCodes = [
    "primary.500",
    "accent.500",
    "teal.500",
    "pink.500",
    "cyan.500",
    "orange.500",
    "green.500",
    "yellow.500",
    "red.500"
  ]
  const uniqueSpecIds = uniq(flatten(variants.map((variant) => variant.Specs.map((spec) => spec.SpecID)))).sort()
  const useColorCodes = uniqueSpecIds.length <= 8
  const specIdColorCodeMap =
    useColorCodes && uniqueSpecIds.reduce((acc, specId, index) => ({...acc, [specId]: colorCodes[index]}), {})

  if (!variants.length) {
    return (
      <Box
        p={6}
        display="flex"
        flexDirection={"column"}
        alignItems={"center"}
        justifyContent={"center"}
        minH={"xs"}
        {...boxProps}
      >
        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
        <Heading colorScheme="secondary" fontSize="xl">
          <VStack>
            <Text>This product has no variants</Text>
            {isProductManager && (
              <GenerateVariantsButton
                onGenerate={onGenerateVariants}
                control={control}
                specs={specs}
                buttonProps={{variant: "solid", colorScheme: "primary", size: "sm"}}
              />
            )}
          </VStack>
        </Heading>
      </Box>
    )
  }
  return (
    <Card>
      <CardHeader display="flex" alignItems={"center"}>
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Variants
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Variants can be generated after creating or adding specs and spec options
          </Text>
        </Heading>
        {isProductManager && (
          <GenerateVariantsButton
            onGenerate={onGenerateVariants}
            control={control}
            specs={specs}
            buttonProps={{variant: "outline", colorScheme: "accent", ml: "auto"}}
          />
        )}
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Options</Th>
                <Th>Active</Th>
              </Tr>
            </Thead>
            <Tbody>
              {variants.map((variant, index) => (
                <Tr key={variant.ID}>
                  <Td>
                    <InputControl
                      name={`Variants.${index}.ID`}
                      control={control}
                      validationSchema={validationSchema}
                      isDisabled={!isProductManager}
                    />
                  </Td>
                  <Td>
                    <HStack>
                      {variant.Specs.map((spec) => {
                        return (
                          <Badge key={spec.SpecID} fontWeight="normal" px="2" py="1">
                            <Text
                              as="span"
                              fontWeight="semibold"
                              color={useColorCodes && specIdColorCodeMap[spec.SpecID]}
                            >
                              {spec.Name}
                            </Text>
                            <Text as="span" fontWeight="normal" color="gray.400" px="1">
                              |
                            </Text>
                            {spec.Value}
                          </Badge>
                        )
                      })}
                    </HStack>
                  </Td>
                  <Td>
                    <CheckboxSingleControl
                      name={`Variants.${index}.Active`}
                      control={control}
                      validationSchema={validationSchema}
                      isDisabled={!isProductManager}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}
