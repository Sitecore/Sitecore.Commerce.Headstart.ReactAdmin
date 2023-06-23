import React, {useEffect} from "react"
import {Control, FieldValues, UseFormTrigger, useController, useWatch} from "react-hook-form"
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import FacetCheckboxControl from "@/components/react-hook-form/form-checkbox/facet-checkbox-control"
import {TbCactus, TbX} from "react-icons/tb"
import {SpecUpdateModal} from "../../variants/SpecUpdateModal"
import {CheckIcon, CloseIcon} from "@chakra-ui/icons"
import {cloneDeep, difference, remove, update} from "lodash"
import {SpecActionsMenu} from "../../variants/SpecActionsMenu"
import {FacetUpdateModal} from "./FacetUpdateModal"
import {SelectControl} from "@/components/react-hook-form"
import Select from "react-select"

interface FacetFormProps {
  control: Control<FieldValues, any>
  facetList: IProductFacet[]
}

export function FacetsForm({control, facetList}: FacetFormProps) {
  const {field} = useController({control, name: "Product.xp.Facets"})
  const productFacetIds = Object.keys(field.value || {})
    .filter((key) => field.value[key]) // exclude facets with empty values
    .filter((key) => facetList.find((f) => f.ID === key)) // exclude xp facets that are not in the facet list

  const handleFacetsUpdate = (selectedFacetIds: string[]) => {
    const addKeys = difference(selectedFacetIds, productFacetIds)
    const removeKeys = difference(productFacetIds, selectedFacetIds)
    const clone = cloneDeep(field.value)
    addKeys.forEach((key) => {
      clone[key] = []
    })
    removeKeys.forEach((key) => {
      clone[key] = ""
    })
    field.onChange(clone)
  }

  if (!productFacetIds.length) {
    return (
      <Box p={6} display="flex" flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minH={"xs"}>
        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
        <Heading colorScheme="secondary" fontSize="xl">
          <VStack>
            <Text>This product has no facets</Text>
            <FacetUpdateModal
              facetIds={productFacetIds}
              availableFacets={facetList}
              onUpdate={handleFacetsUpdate}
              buttonProps={{
                variant: "solid",
                size: "sm",
                colorScheme: "primary"
              }}
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
          Facets
          <Text fontSize="sm" color="gray.400" fontWeight="normal" marginTop={2}>
            Define which facets are available for this product
          </Text>
        </Heading>
        <FacetUpdateModal
          facetIds={productFacetIds}
          availableFacets={facetList}
          onUpdate={handleFacetsUpdate}
          buttonProps={{
            variant: "outline",
            colorScheme: "accent",
            ml: "auto"
          }}
        />
      </CardHeader>
      <CardBody>
        <VStack gap={3} align="start" maxWidth="md">
          {productFacetIds.map((facetId) => (
            <FacetOptionSelect key={facetId} facetId={facetId} control={control} facetList={facetList} />
          ))}
        </VStack>
      </CardBody>
    </Card>
  )
}

interface FacetOptionSelectProps {
  facetId: string
  control: Control<FieldValues, any>
  facetList: IProductFacet[]
}
const FacetOptionSelect = ({facetId, control, facetList}: FacetOptionSelectProps) => {
  const facet = facetList.find((f) => f.ID === facetId)
  const {field} = useController({control, name: `Product.xp.Facets.${facetId}`})

  const selectValues = (field.value || []).map((value) => ({label: value, value}))
  const selectOptions = (facet.xp?.Options || []).map((option) => ({label: option, value: option}))

  const handleSelectChange = (options) => {
    const optionValues = options.map((o) => o.value)
    field.onChange(optionValues)
  }

  const handleRemove = (index: number) => {
    const update = field.value.filter((value, i) => i !== index)
    field.onChange(update)
  }

  return (
    <>
      <FormControl>
        <FormLabel>{facet.Name}</FormLabel>
        <Select
          isMulti={true}
          value={selectValues}
          options={selectOptions}
          onChange={handleSelectChange}
          controlShouldRenderValue={false}
        />
      </FormControl>
      <ButtonGroup display="flex" flexWrap="wrap" gap={2}>
        {selectValues.map((option, index) => (
          <Button
            key={index}
            leftIcon={<TbX />}
            variant="solid"
            fontWeight={"normal"}
            size="sm"
            borderRadius={"full"}
            onClick={() => handleRemove(index)}
            backgroundColor="accent.100"
            style={{margin: 0}}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>
    </>
  )
}
