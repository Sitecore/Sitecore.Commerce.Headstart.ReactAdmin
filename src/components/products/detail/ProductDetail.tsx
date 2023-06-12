import {
  Heading,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Card,
  CardBody,
  CardHeader,
  Box,
  Flex,
  Divider,
  Container,
  Icon,
  SimpleGrid,
  Text,
  Button,
  FormLabel,
  Input,
  FormControl,
  Textarea
} from "@chakra-ui/react"
import {DescriptionForm} from "./forms/DescriptionForm/DescriptionForm"
import {DetailsForm} from "./forms/DetailsForm/DetailsForm"
import {InventoryForm} from "./forms/InventoryForm/InventoryForm"
import {ShippingForm} from "./forms/ShippingForm/ShippingForm"
import {UnitOfMeasureForm} from "./forms/UnitOfMeasureForm/UnitOfMeasureForm"
import ImagePreview from "./ImagePreview"
import {withDefaultValuesFallback, getObjectDiff, makeNestedObject} from "utils"
import {cloneDeep, invert} from "lodash"
import {PriceSchedules, Products} from "ordercloud-javascript-sdk"
import {defaultValues, validationSchema} from "./forms/meta"
import ProductDetailToolbar from "./ProductDetailToolbar"
import {useErrorToast, useSuccessToast} from "hooks/useToast"
import {IProduct} from "types/ordercloud/IProduct"
import {useRouter} from "hooks/useRouter"
import {useState} from "react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {PricingForm} from "./forms/PricingForm/PricingForm"
import {ProductDetailTab} from "./ProductDetailTab"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {TbCactus, TbFileUpload} from "react-icons/tb"
import schraTheme from "theme/theme"
import {ISpec} from "types/ordercloud/ISpec"
import ProductSpecs from "../ProductSpecs"
import {IVariant} from "types/ordercloud/IVariant"
import ProductVariants from "../ProductVariants"
import {FacetsForm} from "./forms/FacetsForm/FacetsForm"
import {IProductFacet} from "types/ordercloud/IProductFacet"

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
  product?: IProduct
  defaultPriceSchedule?: IPriceSchedule
  specs?: ISpec[]
  variants?: IVariant[]
  facets?: IProductFacet[]
}
export default function ProductDetail({
  showTabbedView,
  initialTab,
  product,
  defaultPriceSchedule = {} as IPriceSchedule,
  specs,
  variants,
  facets
}: ProductDetailProps) {
  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const [tabIndex, setTabIndex] = useState(tabIndexMap[initialTab])
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
          Facets: cloneDeep(createFormFacets(facets, product?.xp?.Facets))
        },
        defaultValues
      )
    : makeNestedObject(defaultValues)

  const handleTabsChange = (index) => {
    router.push({query: {...router.query, tab: inverseTabIndexMap[index]}}, undefined, {shallow: true})
    setTabIndex(index)
  }

  const {handleSubmit, control, reset, trigger} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
    mode: "onBlur"
  })

  const generateUpdatedFacets = (facets) => {
    const updatedFacetsOnProduct = {}

    facets.forEach((facet) => {
      const {ID, Options} = facet
      const filteredOptions = Options.filter((option) => option.value === true)

      if (filteredOptions.length > 0) {
        updatedFacetsOnProduct[ID] = filteredOptions.map((option) => option.facetOptionName)
      } else {
        updatedFacetsOnProduct[ID] = []
      }
    })

    return updatedFacetsOnProduct
  }

  const onSubmit = async (fields) => {
    const updatedFacetsOnProduct = generateUpdatedFacets(fields.Facets)

    // create/update product
    if (isCreatingNew) {
      product = await Products.Create<IProduct>({
        ...fields.Product,
        DefaultPriceScheduleID: defaultPriceSchedule.ID,
        xp: {
          Facets: updatedFacetsOnProduct
        }
      })
    } else {
      const productDiff = getObjectDiff(product, fields.Product)
      product = await Products.Patch<IProduct>(product.ID, {
        ...productDiff,
        xp: {
          Facets: updatedFacetsOnProduct
        }
      })
    }

    // create/update price schedule
    if (isCreatingNew || !product.DefaultPriceScheduleID) {
      defaultPriceSchedule = await PriceSchedules.Create<IPriceSchedule>({
        ...fields.DefaultPriceSchedule,
        ID: product.ID,
        Name: product.ID
      })
    } else {
      const priceScheduleDiff = getObjectDiff(defaultPriceSchedule, fields.DefaultPriceSchedule)
      defaultPriceSchedule = await PriceSchedules.Patch<IPriceSchedule>(
        product.DefaultPriceScheduleID,
        priceScheduleDiff
      )
    }

    // patch product with default price schedule
    product = await Products.Patch<IProduct>(product.ID, {DefaultPriceScheduleID: defaultPriceSchedule.ID})

    successToast({
      description: isCreatingNew ? "ProductCreated" : "Product updated"
    })

    if (isCreatingNew) {
      router.push(`/products/${product.ID}`)
    }
  }

  const onInvalid = (errors) => {
    errorToast({title: "Form errors", description: "Please resolve the errors and try again."})
  }

  const SimpleCard = (props: {title?: string; children: React.ReactElement}) => (
    <Card>
      <CardHeader>{props.title && <Heading size="md">{props.title}</Heading>}</CardHeader>
      <CardBody>{props.children}</CardBody>
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
                  />
                </TabPanel>
              )}
              {viewVisibility.Variants && (
                <TabPanel p={0} mt={6}>
                  <Card w="100%">
                    <CardHeader display="flex" alignItems={"center"}>
                      <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
                        Specs
                        <Text fontSize="sm" color="gray.400" fontWeight="normal">
                          Create specs like size and color to generate variants for this product.
                        </Text>
                      </Heading>
                      <Button variant="outline" colorScheme="accent" ml="auto">
                        Create specs
                      </Button>
                    </CardHeader>
                    <CardBody>
                      {!specs?.length && (
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
                            This product has no specs {specs?.length}
                          </Heading>
                        </Box>
                      )}
                      {specs?.length && (
                        <ProductSpecs composedProduct={{Product: product, Specs: specs, Variants: variants}} />
                      )}
                    </CardBody>
                  </Card>
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
                    <CardHeader display="flex" alignItems={"center"}>
                      <Button variant="outline" colorScheme="accent" ml="auto">
                        Add From URL
                      </Button>
                    </CardHeader>
                    <CardBody>
                      <Box
                        alignSelf={"center"}
                        shadow="md"
                        border={`1px dashed ${schraTheme.colors.gray[300]}`}
                        borderRadius="md"
                        display="flex"
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        minH={"xs"}
                        bgColor={"blackAlpha.50"}
                        my={6}
                        mx="auto"
                        w="full"
                        maxW="container.xl"
                        gap={4}
                      >
                        <Icon as={TbFileUpload} fontSize={"5xl"} strokeWidth={"2px"} color="gray.300" />
                        <Heading colorScheme="secondary" fontSize="xl">
                          Browser or drop files here
                        </Heading>
                        <Text color="gray.400" fontSize="sm">
                          JPEG, PNG, GIF, MP4
                        </Text>
                      </Box>
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
                  <Card w="100%">
                    <CardHeader display="flex" alignItems={"center"}>
                      <Text fontSize="sm" color="gray.400" fontWeight="normal">
                        Add options like shirt text and sign verbiage to enable further product customization.
                      </Text>
                      <Button variant="outline" colorScheme="accent" ml="auto">
                        Create option
                      </Button>
                    </CardHeader>
                    <CardBody>
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
                          Nothing created yet...
                        </Heading>
                      </Box>
                    </CardBody>
                  </Card>
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
            {viewVisibility.Customization && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>Customization</Heading>
                </CardHeader>
                <CardBody>Customization under construction</CardBody>
              </Card>
            )}
          </Flex>
        )}
      </Box>
    </Container>
  )
}
