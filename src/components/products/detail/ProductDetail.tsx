import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  Divider,
  Flex,
  Heading,
  Hide,
  Icon,
  IconButton,
  SimpleGrid,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useRouter} from "hooks/useRouter"
import {useErrorToast, useSuccessToast} from "hooks/useToast"
import {cloneDeep, invert, set} from "lodash"
import {Products} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {TbCactus, TbEdit, TbTrash} from "react-icons/tb"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {ISpec} from "types/ordercloud/ISpec"
import {IVariant} from "types/ordercloud/IVariant"
import {makeNestedObject, withDefaultValuesFallback} from "utils"
import ProductVariants from "../ProductVariants"
import ProductXpModal from "../modals/ProductXpModal"
import ImagePreview from "./ImagePreview"
import {ProductDetailTab} from "./ProductDetailTab"
import ProductDetailToolbar from "./ProductDetailToolbar"
import {DescriptionForm} from "./forms/DescriptionForm/DescriptionForm"
import {DetailsForm} from "./forms/DetailsForm/DetailsForm"
import {FacetsForm} from "./forms/FacetsForm/FacetsForm"
import {InventoryForm} from "./forms/InventoryForm/InventoryForm"
import {MediaForm} from "./forms/MediaForm/MediaForm"
import {PricingForm} from "./forms/PricingForm/PricingForm"
import {ShippingForm} from "./forms/ShippingForm/ShippingForm"
import {UnitOfMeasureForm} from "./forms/UnitOfMeasureForm/UnitOfMeasureForm"
import {defaultValues, tabFieldNames, validationSchema} from "./forms/meta"
import {SpecTable} from "./variants/SpecTable"
import {submitProduct} from "services/product-submit.service"

export type ProductDetailTab = "Details" | "Pricing" | "Variants" | "Media" | "Facets" | "Customization"

const tabIndexMap: Record<ProductDetailTab, number> = {
  Details: 0,
  Pricing: 1,
  Variants: 2,
  Media: 3,
  Facets: 4,
  Customization: 5
}
const inverseTabIndexMap = invert(tabIndexMap)
interface ProductDetailProps {
  showTabbedView?: boolean
  initialTab: ProductDetailTab
  initialProduct?: IProduct
  initialDefaultPriceSchedule?: IPriceSchedule
  initialOverridePriceSchedules?: IPriceSchedule[]
  initialSpecs?: ISpec[]
  initialVariants?: IVariant[]
  initialFacets?: IProductFacet[]
}
export default function ProductDetail({
  showTabbedView,
  initialTab,
  initialProduct,
  initialDefaultPriceSchedule = {} as IPriceSchedule,
  initialOverridePriceSchedules,
  initialSpecs,
  initialVariants,
  initialFacets
}: ProductDetailProps) {
  // setting initial values for state so we can update on submit when product is updated
  // this allows us to keep the form in sync with the product without having to refresh the page
  const [product, setProduct] = useState(initialProduct)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(initialDefaultPriceSchedule)
  const [overridePriceSchedules, setOverridePriceSchedules] = useState(initialOverridePriceSchedules)
  const [specs, setSpecs] = useState(initialSpecs)
  const [variants, setVariants] = useState(initialVariants)
  const [facets, setFacets] = useState(initialFacets)

  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const [tabIndex, setTabIndex] = useState(tabIndexMap[initialTab])
  const [liveXp, setLiveXp] = useState<{[key: string]: any}>(product?.xp)
  const [nonUiXp, setNonUiXp] = useState<{[key: string]: any}>({})
  const xpDisclosure = useDisclosure()
  const isCreatingNew = !Boolean(product?.ID)
  const initialViewVisibility: Record<ProductDetailTab, boolean> = {
    Details: true,
    Pricing: true,
    Variants: true,
    Media: true,
    Facets: true,
    Customization: true
  }
  const [viewVisibility, setViewVisibility] = useState(initialViewVisibility)
  const [xpPropertyNameToEdit, setXpPropertyNameToEdit] = useState<string>(null)
  const [xpPropertyValueToEdit, setXpPropertyValueToEdit] = useState<string>(null)

  const createFormFacets = (facetList: IProductFacet[] = [], facetsOnProduct: any) => {
    const formattedFacets = facetList.map((facet) => {
      const {ID, Name} = facet
      const Options = facet.xp?.Options || []
      const optionsWithValues = Options.map((option) => ({
        facetOptionName: option,
        value: (facetsOnProduct && facetsOnProduct[ID] && facetsOnProduct[ID].includes(option)) || false
      }))

      return {
        ID,
        Name,
        Options: optionsWithValues
      }
    })

    return formattedFacets
  }

  const initialValues = product
    ? withDefaultValuesFallback(
        {
          Product: cloneDeep(product),
          DefaultPriceSchedule: cloneDeep(defaultPriceSchedule),
          Specs: cloneDeep(specs),
          Facets: cloneDeep(createFormFacets(facets, product?.xp?.Facets)),
          OverridePriceSchedules: cloneDeep(overridePriceSchedules)
        },
        defaultValues
      )
    : makeNestedObject(defaultValues)

  const {handleSubmit, control, reset, trigger} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onBlur"
  })

  const handleTabsChange = (index) => {
    router.push({query: {...router.query, tab: inverseTabIndexMap[index]}}, undefined, {shallow: true})
    setTabIndex(index)
  }

  const onSubmit = async (fields) => {
    const {updatedProduct, updatedDefaultPriceSchedule, updatedPriceOverrides, updatedSpecs} = await submitProduct(
      isCreatingNew,
      defaultPriceSchedule,
      fields.DefaultPriceSchedule,
      product,
      fields.Product,
      fields.Facets,
      specs,
      fields.Specs,
      overridePriceSchedules,
      fields.OverridePriceSchedules
    )
    successToast({
      description: isCreatingNew ? "Product Created" : "Product updated"
    })

    if (isCreatingNew) {
      router.push(`/products/${product.ID}`)
    } else {
      // Update the state with the new product data
      setProduct(updatedProduct)
      setDefaultPriceSchedule(updatedDefaultPriceSchedule)
      setOverridePriceSchedules(updatedPriceOverrides)
      setSpecs(updatedSpecs)

      // reset the form with new product data
      reset(
        withDefaultValuesFallback(
          {
            Product: cloneDeep(updatedProduct),
            DefaultPriceSchedule: cloneDeep(updatedDefaultPriceSchedule),
            Specs: cloneDeep(updatedSpecs),
            Facets: cloneDeep(createFormFacets(facets, product?.xp?.Facets)),
            OverridePriceSchedules: cloneDeep(updatedPriceOverrides)
          },
          defaultValues
        )
      )
    }
  }

  const onInvalid = (errors) => {
    errorToast({title: "Form errors", description: "Please resolve the errors and try again."})
  }

  const handleXpRemoval = async (key: string) => {
    const newXp = cloneDeep(liveXp)
    delete newXp[key]
    // First patch xp to null
    await Products.Patch(product?.ID, {xp: null})
    // Then patch xp back to the state without the respective removed key
    const patchedProduct = await Products.Patch(product?.ID, {xp: newXp})
    // Then set nonUiXp again with the new state.
    successToast({
      description: "Extended property successfully removed. It may take up to 10 minutes to see the change propagate."
    })
    setNonUiXp(getNonUiXp(patchedProduct.xp))
    setLiveXp(patchedProduct.xp)
  }

  const SimpleCard = (props: {title?: string; children: React.ReactElement}) => (
    <Card>
      <CardHeader>{props.title && <Heading size="md">{props.title}</Heading>}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  )

  const xpCard = (): JSX.Element => {
    return (
      <Card w="100%">
        <CardHeader display="flex" alignItems={"center"} flexWrap="wrap" gap={4}>
          <Text fontSize="sm" color="gray.400" fontWeight="normal">
            Define custom properties for your product
          </Text>
          <Button variant="outline" colorScheme="accent" ml={{md: "auto"}} onClick={() => xpDisclosure.onOpen()}>
            Add {Object.keys(nonUiXp).length > 0 && "additional"} property
          </Button>
        </CardHeader>
        <CardBody
          p={6}
          display="flex"
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"center"}
          minH={"xs"}
        >
          {Object.values(nonUiXp).map((xp, idx) => {
            return (
              <Box
                key={idx}
                display="grid"
                gridTemplateColumns={"auto 2fr 2fr"}
                justifyContent="flex-start"
                w={"full"}
                maxW={{xl: "75%"}}
              >
                <Hide below="lg">
                  <ButtonGroup size="xs" mr={2} alignItems="center">
                    <Button
                      onClick={() => {
                        setXpPropertyNameToEdit(Object.keys(nonUiXp)[idx])
                        setXpPropertyValueToEdit(xp)
                        xpDisclosure.onOpen()
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleXpRemoval(Object.keys(nonUiXp)[idx])}
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
                    <IconButton
                      icon={<TbEdit size="1rem" />}
                      aria-label="edit"
                      onClick={() => {
                        setXpPropertyNameToEdit(Object.keys(nonUiXp)[idx])
                        setXpPropertyValueToEdit(xp)
                        xpDisclosure.onOpen()
                      }}
                    >
                      Edit
                    </IconButton>
                    <IconButton
                      ml={"0 !important"}
                      icon={<TbTrash size="1rem" />}
                      variant="outline"
                      borderColor="red.300"
                      color="red.300"
                      aria-label="delete"
                      onClick={() => handleXpRemoval(Object.keys(nonUiXp)[idx])}
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
                    {Object.keys(nonUiXp)[idx]}
                  </Text>
                </Flex>
                <Flex borderWidth={1} borderColor="gray.100" px={4} py={2} mt={"-1px"} ml={"-1px"} alignItems="center">
                  <Text whiteSpace="pre-wrap" wordBreak="break-word">
                    {xp}
                  </Text>
                </Flex>
              </Box>
            )
          })}
        </CardBody>
      </Card>
    )
  }

  useEffect(() => {
    const productXp = getNonUiXp(product?.xp)
    setNonUiXp(productXp)
  }, [product])

  const getNonUiXp = (xp: {[key: string]: any}): {[key: string]: any} => {
    if (isCreatingNew) return {}
    const uiXpFields = Object.values(tabFieldNames)
      .flat()
      .filter((field) => field.includes(".xp."))
      .map((xp) => xp?.split(".")?.at(2))
    const productXp = cloneDeep(xp)
    uiXpFields.forEach((f) => delete productXp[f])
    return productXp
  }

  const creatingNewXpCard = () => (
    <Card w="100%">
      <CardHeader>
        <Heading>Additional properties</Heading>
      </CardHeader>
      <CardBody>
        <Text>Add additional properties after you create the product.</Text>
      </CardBody>
    </Card>
  )

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Box as="form" noValidate onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <ProductDetailToolbar
          product={product}
          control={control}
          resetForm={reset}
          viewVisibility={viewVisibility}
          setViewVisibility={setViewVisibility}
        />
        {showTabbedView ? (
          <Tabs colorScheme="accent" index={tabIndex} onChange={handleTabsChange}>
            <TabList flexWrap="wrap">
              {viewVisibility.Details && <ProductDetailTab tab="Details" control={control} />}
              {viewVisibility.Pricing && <ProductDetailTab tab="Pricing" control={control} />}
              {viewVisibility.Variants && <ProductDetailTab tab="Variants" control={control} />}
              {viewVisibility.Media && <ProductDetailTab tab="Media" control={control} />}
              {viewVisibility.Facets && <ProductDetailTab tab="Facets" control={control} />}
              {viewVisibility.Customization && <ProductDetailTab tab="Customization" control={control} />}
            </TabList>

            <TabPanels>
              {viewVisibility.Details && (
                <TabPanel p={0} mt={6}>
                  <Flex gap={6} flexFlow={{base: "column", xl: "row nowrap"}}>
                    <Flex flexFlow="column" flexGrow="1" gap={6} flexWrap="wrap">
                      <SimpleCard title="Details">
                        <DetailsForm control={control} />
                      </SimpleCard>
                      <SimpleCard title="Description">
                        <DescriptionForm control={control} />
                      </SimpleCard>
                      <SimpleGrid gridTemplateColumns={{md: "1fr 1fr"}} gap={6}>
                        <SimpleCard title="Unit of Measure">
                          <UnitOfMeasureForm control={control} />
                        </SimpleCard>
                        <SimpleCard title="Inventory">
                          <InventoryForm control={control} />
                        </SimpleCard>
                      </SimpleGrid>
                      <SimpleCard title="Shipping">
                        <ShippingForm control={control} />
                      </SimpleCard>
                    </Flex>
                    <Box>
                      <SimpleCard>
                        <ImagePreview images={product?.xp?.Images} />
                      </SimpleCard>
                    </Box>
                  </Flex>
                </TabPanel>
              )}
              {viewVisibility.Pricing && (
                <TabPanel p={0} mt={6} maxW="container.xl">
                  <PricingForm
                    control={control}
                    trigger={trigger}
                    priceBreakCount={defaultPriceSchedule?.PriceBreaks?.length || 0}
                    overridePriceSchedules={overridePriceSchedules}
                  />
                </TabPanel>
              )}
              {viewVisibility.Variants && (
                <TabPanel p={0} mt={6}>
                  <SpecTable control={control} />
                  <Card w="100%" mt={6}>
                    <CardHeader>
                      <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
                        Variants
                      </Heading>
                      <Text fontSize="sm" color="gray.400">
                        Variants will be generated after creating or adding specs and spec options
                      </Text>
                    </CardHeader>
                    <CardBody>
                      {!variants?.length && (
                        <Box
                          p={6}
                          display="flex"
                          flexDirection={"column"}
                          alignItems={"center"}
                          justifyContent={"center"}
                          minH={"xs"}
                        >
                          <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="accent.500" />
                          <Heading colorScheme="secondary" fontSize="xl">
                            This product has no variants {variants?.length}
                          </Heading>
                        </Box>
                      )}
                      {variants?.length && (
                        <ProductVariants composedProduct={{Product: product, Specs: specs, Variants: variants}} />
                      )}
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.Media && (
                <TabPanel p={0} mt={6}>
                  <Card w="100%">
                    <CardBody>
                      <MediaForm control={control} />
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.Facets && (
                <TabPanel p={0} mt={6}>
                  <Card w="100%">
                    <FacetsForm
                      control={control}
                      trigger={trigger}
                      facetList={facets}
                      productFacets={product?.xp?.Facets}
                    />
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.Customization && (
                <TabPanel p={0} mt={6}>
                  {isCreatingNew ? creatingNewXpCard() : xpCard()}
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        ) : (
          <Flex flexWrap="wrap">
            {viewVisibility.Details && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Details</Heading>
                </CardHeader>
                <CardBody>
                  <DetailsForm control={control} />
                  <Divider marginY={5} />
                  <DescriptionForm control={control} />
                  <Divider marginY={5} />
                  <UnitOfMeasureForm control={control} />
                  <Divider marginY={5} />
                  <InventoryForm control={control} />
                  <Divider marginY={5} />
                  <ShippingForm control={control} />
                </CardBody>
              </Card>
            )}
            {viewVisibility.Pricing && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Pricing</Heading>
                </CardHeader>
                <CardBody>
                  <PricingForm
                    control={control}
                    trigger={trigger}
                    priceBreakCount={defaultPriceSchedule?.PriceBreaks?.length || 0}
                  />
                </CardBody>
              </Card>
            )}
            {viewVisibility.Variants && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Variants</Heading>
                </CardHeader>
                <CardBody>Variants under construction</CardBody>
              </Card>
            )}
            {viewVisibility.Media && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Media</Heading>
                </CardHeader>
                <CardBody>Media under construction</CardBody>
              </Card>
            )}
            {viewVisibility.Facets && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Facets</Heading>
                </CardHeader>
                <CardBody>Facets under construction</CardBody>
              </Card>
            )}
            {viewVisibility.Customization && !isCreatingNew && xpCard()}
            {viewVisibility.Customization && isCreatingNew && creatingNewXpCard()}
          </Flex>
        )}
        <ProductXpModal
          productID={product?.ID}
          nonUiXp={nonUiXp}
          disclosure={xpDisclosure}
          existingPropertyName={xpPropertyNameToEdit}
          existingPropertyValue={xpPropertyValueToEdit}
          clearExistingPropertyValues={() => {
            setXpPropertyNameToEdit(null)
            setXpPropertyValueToEdit(null)
          }}
          onSuccess={(patchResponse) => {
            setNonUiXp(getNonUiXp(patchResponse.xp))
            setLiveXp(patchResponse.xp)
          }}
        />
      </Box>
    </Container>
  )
}
