import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {
  Box,
  Button,
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
  Badge
} from "@chakra-ui/react"
import {TbCactus} from "react-icons/tb"
import {SpecActionsMenu} from "./SpecActionsMenu"
import {SpecUpdateModal} from "./SpecUpdateModal"
import {Control, FieldValues, useFieldArray} from "react-hook-form"
import {SpecFieldValues} from "types/form/SpecFieldValues"

interface SpecTableProps {
  control: Control<FieldValues, any>
}

export function SpecTable({control}: SpecTableProps) {
  const {fields, append, remove, update} = useFieldArray({
    control,
    name: "Specs"
  })
  const specs = fields as SpecFieldValues[]
  const okColor = useColorModeValue("green.500", "green.300")
  const errorColor = useColorModeValue("red.500", "red.300")

  if (!specs.length) {
    return (
      <Box p={6} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minH={"xs"}>
        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
        <Heading colorScheme="secondary" fontSize="xl">
          <VStack>
            <Text>This product has no specs</Text>
            <SpecUpdateModal
              onUpdate={append}
              as="button"
              buttonProps={{variant: "solid", size: "sm", colorScheme: "primary"}}
            />
          </VStack>
        </Heading>
      </Box>
    )
  }
  return (
    <Card>
      <CardHeader display="flex" alignItems={"center"}>
        <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
          Specs
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Create specs like size and color to generate variants for this product.
          </Text>
        </Heading>
        <SpecUpdateModal
          onUpdate={append}
          as="button"
          buttonProps={{variant: "outline", colorScheme: "accent", ml: "auto"}}
        />
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
                  <Td>{spec.Name}</Td>
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
                        <Badge colorScheme="gray" fontSize="xs" marginLeft={2} key={option.id || option.ID || index}>
                          {option.Value}
                        </Badge>
                      )
                    })}
                  </Td>
                  <Td>
                    <SpecActionsMenu
                      spec={spec}
                      onDelete={() => remove(index)}
                      onUpdate={(updatedSpec) => update(index, updatedSpec)}
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
