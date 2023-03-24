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
  Divider
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
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <ProductDetailToolbar
        product={product}
        control={control}
        resetForm={reset}
        viewVisibility={viewVisibility}
        setViewVisibility={setViewVisibility}
      />
      {showTabbedView ? (
        <Tabs variant="soft-rounded" colorScheme="teal" index={tabIndex} onChange={handleTabsChange}>
          <TabList>
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
              <TabPanel>
                <Flex flexWrap={{base: "wrap", xl: "nowrap"}} gap={7}>
                  <Flex flexFlow="column" flexGrow="1" maxWidth="1000px">
                    <SimpleCard title="Details">
                      <DetailsForm control={control} />
                    </SimpleCard>
                    <SimpleCard title="Description">
                      <DescriptionForm control={control} />
                    </SimpleCard>
                    <SimpleCard title="Unit of Measure">
                      <UnitOfMeasureForm control={control} />
                    </SimpleCard>
                    <SimpleCard title="Inventory">
                      <InventoryForm control={control} />
                    </SimpleCard>
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
              <TabPanel>
                <Flex flexFlow="column">
                  <SimpleCard title="Pricing">
                    <PricingForm
                      control={control}
                      trigger={trigger}
                      priceBreakCount={defaultPriceSchedule?.PriceBreaks?.length || 0}
                    />
                  </SimpleCard>
                </Flex>
              </TabPanel>
            )}
            {viewVisibility.Variants && <TabPanel>Variants under construction</TabPanel>}
            {viewVisibility.Media && <TabPanel>Media under construction</TabPanel>}
            {viewVisibility.Facets && <TabPanel>Facets under construction</TabPanel>}
            {viewVisibility.Customization && <TabPanel>Customization under construction</TabPanel>}
            {viewVisibility.SEO && <TabPanel>SEO under construction</TabPanel>}
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
  )
}
