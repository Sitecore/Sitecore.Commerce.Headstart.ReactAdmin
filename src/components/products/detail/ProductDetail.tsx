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
  Center,
  VStack,
  Icon,
  SimpleGrid,
  Text,
  Button,
  theme,
  InputGroup,
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
import {useSuccessToast} from "hooks/useToast"
import {IProduct} from "types/ordercloud/IProduct"
import {useRouter} from "hooks/useRouter"
import {useState} from "react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {PricingForm} from "./forms/PricingForm/PricingForm"
import {ProductDetailTab} from "./ProductDetailTab"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {TbBarrierBlock, TbCactus, TbFileUpload} from "react-icons/tb"
import schraTheme from "theme/theme"

export type ProductDetailTab = "Details" | "Pricing" | "Variants" | "Media" | "Facets" | "Customization" | "SEO"

const tabIndexMap: Record<ProductDetailTab, number> = {
  Details: 0,
  Pricing: 1,
  Variants: 2,
  Media: 3,
  Facets: 4,
  Customization: 5,
  SEO: 6
}
const inverseTabIndexMap = invert(tabIndexMap)
interface ProductDetailProps {
  showTabbedView?: boolean
  initialTab: ProductDetailTab
  product?: IProduct
  defaultPriceSchedule?: IPriceSchedule
}
export default function ProductDetail({
  showTabbedView,
  initialTab,
  product,
  defaultPriceSchedule = {} as IPriceSchedule
}: ProductDetailProps) {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tabIndex, setTabIndex] = useState(tabIndexMap[initialTab])
  const isCreatingNew = !Boolean(product?.ID)
  const initialViewVisibility: Record<ProductDetailTab, boolean> = {
    Details: true,
    Pricing: true,
    Variants: true,
    Media: true,
    Facets: true,
    Customization: true,
    SEO: true
  }
  const [viewVisibility, setViewVisibility] = useState(initialViewVisibility)

  const initialValues = product
    ? withDefaultValuesFallback(
        {Product: cloneDeep(product), DefaultPriceSchedule: cloneDeep(defaultPriceSchedule)},
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

  const onSubmit = async (fields) => {
    // create/update product
    if (isCreatingNew) {
      product = await Products.Create<IProduct>({...fields.Product, DefaultPriceScheduleID: defaultPriceSchedule.ID})
    } else {
      const productDiff = getObjectDiff(product, fields.Product)
      product = await Products.Patch<IProduct>(product.ID, {
        ...productDiff
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
      const priceScheduleDiff = getObjectDiff(defaultPriceSchedule, fields.defaultPriceSchedule)
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

  const SimpleCard = (props: {title?: string; children: React.ReactElement}) => (
    <Card>
      <CardHeader>{props.title && <Heading size="md">{props.title}</Heading>}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  )

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <ProductDetailToolbar
          product={product}
          control={control}
          resetForm={reset}
          viewVisibility={viewVisibility}
          setViewVisibility={setViewVisibility}
        />
        {showTabbedView ? (
          <Tabs colorScheme="brand" index={tabIndex} onChange={handleTabsChange}>
            <TabList flexWrap="wrap">
              {viewVisibility.Details && <ProductDetailTab tab="Details" control={control} />}
              {viewVisibility.Pricing && <ProductDetailTab tab="Pricing" control={control} />}
              {viewVisibility.Variants && <ProductDetailTab tab="Variants" control={control} />}
              {viewVisibility.Media && <ProductDetailTab tab="Media" control={control} />}
              {viewVisibility.Facets && <ProductDetailTab tab="Facets" control={control} />}
              {viewVisibility.Customization && <ProductDetailTab tab="Customization" control={control} />}
              {viewVisibility.SEO && <ProductDetailTab tab="SEO" control={control} />}
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
                        Attributes
                        <Text fontSize="sm" color="gray.400" fontWeight="normal">
                          Create attributes like size and color to generate variants for this product.
                        </Text>
                      </Heading>
                      <Button variant="outline" colorScheme="brand" ml="auto">
                        Create attributes
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
                        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="brand.500" />
                        <Heading colorScheme="secondary" fontSize="xl">
                          This product has no attributes
                        </Heading>
                      </Box>
                    </CardBody>
                  </Card>
                  <Card w="100%" mt={6}>
                    <CardHeader>
                      <Heading as="h3" fontSize="lg" alignSelf={"flex-start"}>
                        Variants
                      </Heading>
                      <Text fontSize="sm" color="gray.400">
                        Variants will be generated after creating or adding attributes
                      </Text>
                    </CardHeader>
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.Media && (
                <TabPanel p={0} mt={6}>
                  <Card w="100%">
                    <CardHeader display="flex" alignItems={"center"}>
                      <Button variant="outline" colorScheme="brand" ml="auto">
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
                    <CardHeader display="flex" alignItems={"center"}>
                      <Button variant="outline" colorScheme="brand" ml="auto">
                        Add Facet
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
                        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="brand.500" />
                        <Heading colorScheme="secondary" fontSize="xl">
                          This product has no facets
                        </Heading>
                      </Box>
                    </CardBody>
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
                      <Button variant="outline" colorScheme="brand" ml="auto">
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
                        <Icon as={TbCactus} fontSize={"5xl"} strokeWidth={"2px"} color="brand.500" />
                        <Heading colorScheme="secondary" fontSize="xl">
                          Nothing created yet...
                        </Heading>
                      </Box>
                    </CardBody>
                  </Card>
                </TabPanel>
              )}
              {viewVisibility.SEO && (
                <TabPanel p={0} mt={6}>
                  <Card w="100%">
                    <CardHeader display="flex" alignItems={"center"}></CardHeader>
                    <CardBody maxW="container.xl">
                      <SimpleGrid minChildWidth={"350px"} gap={6}>
                        <FormControl>
                          <FormLabel>Product Page Title</FormLabel>
                          <Input placeholder="example" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Meta Title</FormLabel>
                          <Input placeholder="example" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Set page URL</FormLabel>
                          <Input placeholder="example" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Product Page Description</FormLabel>
                          <Textarea placeholder="example" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Meta Description</FormLabel>
                          <Textarea placeholder="example" />
                        </FormControl>
                      </SimpleGrid>
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
            {viewVisibility.SEO && (
              <Card width={{base: "100%", xl: "50%"}}>
                <CardHeader>
                  <Heading>SEO</Heading>
                </CardHeader>
                <CardBody>SEO under construction</CardBody>
              </Card>
            )}
          </Flex>
        )}
      </Box>
    </Container>
  )
}
