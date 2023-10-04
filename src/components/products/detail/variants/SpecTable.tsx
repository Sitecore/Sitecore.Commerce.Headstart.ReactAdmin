import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
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
  useColorModeValue,
  Text,
  VStack,
  Badge,
  CardProps
} from "@chakra-ui/react"
import {TbCactus} from "react-icons/tb"
import {SpecActionsMenu} from "./SpecActionsMenu"
import {SpecUpdateModal} from "./SpecUpdateModal"
import {Control, useFieldArray} from "react-hook-form"
import {SpecFieldValues} from "types/form/SpecFieldValues"
import {uniq, flatten} from "lodash"
import {ProductDetailFormFields} from "../form-meta"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface SpecTableProps extends CardProps {
  control: Control<ProductDetailFormFields>
}

export function SpecTable({control, ...cardProps}: SpecTableProps) {
  const {fields, append, remove, update} = useFieldArray({
    control,
    name: "Specs"
  })
  const specs = fields as SpecFieldValues[]
  const okColor = useColorModeValue("green.500", "green.300")
  const errorColor = useColorModeValue("red.500", "red.300")

  // if you change the color codes here make sure to change in VariantTable.tsx
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
  const uniqueSpecIds = uniq(flatten(specs.map((spec) => spec.ID))).sort()
  const useColorCodes = uniqueSpecIds.length <= 8
  const specIdColorCodeMap =
    useColorCodes && uniqueSpecIds.reduce((acc, specId, index) => ({...acc, [specId]: colorCodes[index]}), {})

  if (!specs.length) {
    return (
      <Box p={6} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minH={"xs"}>
        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
        <Heading colorScheme="secondary" fontSize="xl">
          <VStack>
            <Text>This product has no specs</Text>
            <ProtectedContent hasAccess={appPermissions.ProductManager}>
              <SpecUpdateModal
                onUpdate={append}
                as="button"
                buttonProps={{variant: "solid", size: "sm", colorScheme: "primary"}}
              />
            </ProtectedContent>
          </VStack>
        </Heading>
      </Box>
    )
  }
  return (
    <Card {...cardProps}>
      <CardHeader display="flex" alignItems={"center"}>
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Specs
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Create specs like size and color to generate variants for this product.
          </Text>
        </Heading>
        <ProtectedContent hasAccess={appPermissions.ProductManager}>
          <SpecUpdateModal
            onUpdate={append}
            as="button"
            buttonProps={{variant: "outline", colorScheme: "accent", ml: "auto"}}
          />
        </ProtectedContent>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Name</Th>
                <Th>Defines Variant</Th>
                <Th>Options</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {specs.map((spec, index) => (
                <Tr key={spec.ID || spec.id || index}>
                  <Td>
                    {spec.ID ? (
                      spec.ID
                    ) : (
                      <Text fontStyle="italic" fontSize="small">
                        ID will be assigned once product is saved
                      </Text>
                    )}
                  </Td>
                  <Td>
                    <Badge fontWeight="normal" px="2" py="1">
                      <Text as="span" fontWeight="semibold" color={useColorCodes && specIdColorCodeMap[spec.ID]}>
                        {spec.Name}
                      </Text>
                    </Badge>
                  </Td>
                  <Td>
                    {spec.DefinesVariant ? (
                      <CheckIcon fontSize="sm" color={okColor} />
                    ) : (
                      <CloseIcon fontSize="sm" color={errorColor} />
                    )}
                  </Td>
                  <Td>
                    {spec.Options.map((option, index) => {
                      return (
                        <Badge
                          key={option.id || option.ID || index}
                          colorScheme="gray"
                          fontWeight="normal"
                          marginLeft={2}
                          px="2"
                          py="1"
                        >
                          {option.Value}
                        </Badge>
                      )
                    })}
                  </Td>
                  <Td>
                    <ProtectedContent hasAccess={appPermissions.ProductManager}>
                      <SpecActionsMenu
                        spec={spec}
                        onDelete={() => remove(index)}
                        onUpdate={(updatedSpec) => update(index, updatedSpec)}
                      />
                    </ProtectedContent>
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
