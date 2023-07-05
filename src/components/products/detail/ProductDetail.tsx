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
  Grid,
  Heading,
  Hide,
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
import {useErrorToast, useSuccessToast, useToast} from "hooks/useToast"
import {cloneDeep, invert} from "lodash"
import {Products, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {useForm} from "react-hook-form"
import {TbEdit, TbTrash} from "react-icons/tb"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {ISpec} from "types/ordercloud/ISpec"
import {IVariant} from "types/ordercloud/IVariant"
import {makeNestedObject, withDefaultValuesFallback} from "utils"
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
import {VariantTable} from "./variants/VariantTable"
import {fetchVariants} from "services/product-data-fetcher.service"
import { CategoryProductAssignmentAdmin } from "types/form/CategoryProductAssignmentAdmin"
import { CatalogForm } from "./forms/CatalogForm/CatalogForm"

export type ProductDetailTab = "Details" | "Pricing" | "Variants" | "Media" | "Facets" | "Customization" | "Catalogs"

const tabIndexMap: Record<ProductDetailTab, number> = {
  Details: 0,
  Pricing: 1,
  Variants: 2,
  Media: 3,
  Facets: 4,
  Customization: 5,
  Catalogs: 6
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
  facets?: IProductFacet[]
  initialCatalogs?: ProductCatalogAssignment[]
  initialCategories?: CategoryProductAssignmentAdmin[]
}
export default function ProductDetail({
  showTabbedView,
  initialTab,
  initialProduct,
  initialDefaultPriceSchedule = {} as IPriceSchedule,
  initialOverridePriceSchedules,
  initialSpecs,
  initialVariants,
  facets, // facets won't change so we don't need to use state
  initialCatalogs,
  initialCategories
}: ProductDetailProps) {
  // setting initial values for state so we can update on submit when product is updated
  // this allows us to keep the form in sync with the product without having to refresh the page
  const [product, setProduct] = useState(initialProduct)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(initialDefaultPriceSchedule)
  const [overridePriceSchedules, setOverridePriceSchedules] = useState(initialOverridePriceSchedules)
  const [specs, setSpecs] = useState(initialSpecs)
  const [variants, setVariants] = useState(initialVariants)

  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const toast = useToast()
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
    Customization: true,
    Catalogs: true
  }
  const [viewVisibility, setViewVisibility] = useState(initialViewVisibility)
  const [xpPropertyNameToEdit, setXpPropertyNameToEdit] = useState<string>(null)
  const [xpPropertyValueToEdit, setXpPropertyValueToEdit] = useState<string>(null)
  const [productCatalogs, setProductCatalogs] = useState(initialCatalogs)
  const [productCategories, setProductCategories] = useState(initialCategories)

  const initialValues = product
    ? withDefaultValuesFallback(
        {
          Product: cloneDeep(product),
          DefaultPriceSchedule: cloneDeep(defaultPriceSchedule),
          Specs: cloneDeep(specs),
          Variants: cloneDeep(variants),
          OverridePriceSchedules: cloneDeep(overridePriceSchedules),
          CatalogAssignments: cloneDeep(productCatalogs)
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
    const {
      updatedProduct,
      updatedDefaultPriceSchedule,
      updatedPriceOverrides,
      updatedSpecs,
      didUpdateSpecs,
      updatedVariants
    } = await submitProduct(
      isCreatingNew,
      defaultPriceSchedule,
      fields.DefaultPriceSchedule,
      product,
      fields.Product,
      specs,
      fields.Specs,
      variants,
      fields.Variants,
      overridePriceSchedules,
      fields.OverridePriceSchedules
    )
    successToast({
      description: isCreatingNew ? "Product Created" : "Product updated"
    })
    if (didUpdateSpecs && updatedSpecs?.length) {
      toast({status: "info", description: "It looks like you updated specs. You may wish to regenerate variants"})
    }

    if (isCreatingNew) {
      router.push(`/products/${updatedProduct.ID}`)
    } else {
      // Update the state with the new product data
      setProduct(updatedProduct)
      setDefaultPriceSchedule(updatedDefaultPriceSchedule)
      setOverridePriceSchedules(updatedPriceOverrides)
      setSpecs(updatedSpecs)
      setVariants(updatedVariants)

      // reset the form with new product data
      reset(
        withDefaultValuesFallback(
          {
            Product: cloneDeep(updatedProduct),
            DefaultPriceSchedule: cloneDeep(updatedDefaultPriceSchedule),
            Specs: cloneDeep(updatedSpecs),
            Variants: cloneDeep(updatedVariants),
            OverridePriceSchedules: cloneDeep(updatedPriceOverrides)
          },
          defaultValues
        )
      )
    }
  }

  const handleGenerateVariants = async (shouldOverwrite: boolean) => {
    const updatedProduct = await Products.GenerateVariants(product.ID, {overwriteExisting: shouldOverwrite})
    const updatedVariants = await fetchVariants(updatedProduct)
    setVariants(updatedVariants)
    // reset the form with new product data
    reset(
      withDefaultValuesFallback(
        {
          Product: cloneDeep(updatedProduct),
          DefaultPriceSchedule: cloneDeep(defaultPriceSchedule),
          Specs: cloneDeep(specs),
          Variants: cloneDeep(updatedVariants),
          OverridePriceSchedules: cloneDeep(overridePriceSchedules)
        },
        defaultValues
      )
    )
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
              {viewVisibility.Catalogs && <ProductDetailTab tab="Catalogs" control={control} />}
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
                  <Box mt={6}>
                    <VariantTable
                      onGenerateVariants={handleGenerateVariants}
                      control={control}
                      variants={variants}
                      specs={specs}
                    />
                  </Box>
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
                    <FacetsForm control={control} facetList={facets} />
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.Customization && (
                <TabPanel p={0} mt={6}>
                  {isCreatingNew ? creatingNewXpCard() : xpCard()}
                </TabPanel>
              )}
              {viewVisibility.Catalogs && (
                <TabPanel p={0} mt={6}>
                  <CatalogForm
                    control={control}
                    product={product.ID}
                    trigger={trigger}
                    productCatalogs={productCatalogs}
                    productCategories={productCategories} />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        ) : (
          <Flex flexWrap="wrap">
            {viewVisibility.Details && (
              <Box width={{base: "100%", xl: "50%"}}>
                <Card margin={3}>
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
              </Box>
            )}
            {viewVisibility.Media && (
              <Box width={{base: "100%", xl: "50%"}}>
                <Card margin={3}>
                  <CardHeader>
                    <Heading>Media</Heading>
                  </CardHeader>
                  <CardBody>
                    <MediaForm control={control} />
                  </CardBody>
                </Card>
              </Box>
            )}
            {viewVisibility.Pricing && (
              <Box width="100%">
                <Card margin={3}>
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
              </Box>
            )}
            {viewVisibility.Variants && (
              <Box width={{base: "100%", xl: "50%"}}>
                <Card margin={3}>
                  <CardHeader>
                    <Heading>Variants</Heading>
                  </CardHeader>
                  <CardBody>
                    <SpecTable control={control} />
                    <Box mt={6}>
                      <VariantTable
                        onGenerateVariants={handleGenerateVariants}
                        control={control}
                        variants={variants}
                        specs={specs}
                      />
                    </Box>
                  </CardBody>
                </Card>
              </Box>
            )}

            {viewVisibility.Facets && (
              <Box width={{base: "100%", xl: "50%"}}>
                <Card margin={3}>
                  <CardHeader>
                    <Heading>Facets</Heading>
                  </CardHeader>
                  <CardBody>
                    <FacetsForm control={control} facetList={facets} />
                  </CardBody>
                </Card>
              </Box>
            )}
            <Box width={{base: "100%", xl: "50%"}}>
              <Box margin={3}>
                {viewVisibility.Customization && !isCreatingNew && xpCard()}
                {viewVisibility.Customization && isCreatingNew && creatingNewXpCard()}
              </Box>
            </Box>
            {viewVisibility.Catalogs && (
              <Box width="100%">
                <Card margin={3}>
                  <CardHeader>
                    <Heading>Catalogs</Heading>
                  </CardHeader>
                  <CardBody>
                    hi!
                  </CardBody>
                </Card>
              </Box>
            )}
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

function SimpleCard(props: {title?: string; children: React.ReactElement}) {
  return (
    <Card margin={3}>
      <CardHeader>{props.title && <Heading size="md">{props.title}</Heading>}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  )
}
