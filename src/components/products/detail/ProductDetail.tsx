import {
  Heading,
  Tabs,
  TabList,
  Tab,
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
import {cloneDeep, get, invert, isEmpty} from "lodash"
import {Products} from "ordercloud-javascript-sdk"
import {defaultValues, tabFieldNames, validationSchema} from "./forms/meta"
import ProductDetailToolbar from "./ProductDetailToolbar"
import PanelCard from "components/card/Card"
import {useSuccessToast} from "hooks/useToast"
import {IProduct} from "types/ordercloud/IProduct"
import {useRouter} from "hooks/useRouter"
import {useState} from "react"
import {yupResolver} from "@hookform/resolvers/yup"
import {FieldErrors, useForm} from "react-hook-form"

export type ProductDetailTab = "details" | "pricing" | "variants" | "media" | "facets" | "seo"

const tabIndexMap: Record<ProductDetailTab, number> = {
  details: 0,
  pricing: 1,
  variants: 2,
  media: 3,
  facets: 4,
  seo: 5
}
const inverseTabIndexMap = invert(tabIndexMap)
interface ProductDetailProps {
  showTabbedView?: boolean
  product?: IProduct
}
export default function ProductDetail({showTabbedView, product}: ProductDetailProps) {
  const router = useRouter()
  const successToast = useSuccessToast()
  const [tabIndex, setTabIndex] = useState(tabIndexMap[router.query.tab.toString()])
  const isCreatingNew = !Boolean(product?.ID)
  const initialViewVisibility: Record<ProductDetailTab, boolean> = {
    details: true,
    pricing: true,
    variants: true,
    media: true,
    facets: true,
    seo: true
  }
  const [viewVisibility, setViewVisibility] = useState(initialViewVisibility)

  const initialValues = product
    ? withDefaultValuesFallback({Product: cloneDeep(product)}, defaultValues)
    : makeNestedObject(defaultValues)

  const handleTabsChange = (index) => {
    router.push({query: {...router.query, tab: inverseTabIndexMap[index]}}, undefined, {shallow: true})
    setTabIndex(index)
  }

  const {
    handleSubmit,
    control,
    formState: {isValid, errors, touchedFields},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues: initialValues})

  const onSubmit = async (fields) => {
    if (isCreatingNew) {
      product = await Products.Create<IProduct>(fields.Product)
    } else {
      const productDiff = getObjectDiff(product, fields.Product)
      product = await Products.Patch<IProduct>(product.ID, productDiff)
    }

    successToast({
      description: isCreatingNew ? "ProductCreated" : "Product updated"
    })

    if (isCreatingNew) {
      router.push(`/products/${product.ID}`)
    }
  }

  const SimpleCard = (props: {title?: string; children: React.ReactElement}) => (
    <Card>
      <CardHeader>
        {props.title && <Heading size="md">{props.title}</Heading>}
        <CardBody>{props.children}</CardBody>
      </CardHeader>
    </Card>
  )

  const tabHasError = (tab: ProductDetailTab, errors: FieldErrors<any>, touched: Partial<Readonly<any>>): boolean => {
    if (isEmpty(errors)) {
      return false
    }
    return tabFieldNames[tab].some((fieldName) => get(errors, fieldName, null) && get(touched, fieldName, null))
  }

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)}>
      <ProductDetailToolbar
        product={product}
        isFormValid={isValid}
        resetForm={reset}
        viewVisibility={viewVisibility}
        setViewVisibility={setViewVisibility}
      />
      {showTabbedView ? (
        <Tabs variant="soft-rounded" colorScheme="teal" index={tabIndex} onChange={handleTabsChange}>
          <TabList>
            {viewVisibility.details && (
              <Tab>Details {tabHasError("details", errors, touchedFields) && "Tab Error"}</Tab>
            )}
            {viewVisibility.pricing && <Tab>Pricing</Tab>}
            {viewVisibility.variants && <Tab>Variants</Tab>}
            {viewVisibility.media && <Tab>Media</Tab>}
            {viewVisibility.facets && <Tab>Facets</Tab>}
            {viewVisibility.seo && <Tab>SEO</Tab>}
          </TabList>

          <TabPanels>
            {viewVisibility.details && (
              <TabPanel>
                {/* Details Tab */}
                <Flex justifyContent="space-between" flexWrap={{base: "wrap", xl: "nowrap"}} gap={7}>
                  <Flex flexFlow="column" flexGrow="1" rowGap={7}>
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
          </TabPanels>
        </Tabs>
      ) : (
        <Flex gap={3} flexDirection="column">
          {viewVisibility.details && (
            <PanelCard width={{base: "100%", xl: "50%"}} variant="primaryCard" closedText="Details">
              <Heading marginBottom={5}>Details</Heading>
              <DetailsForm control={control} />
              <Divider marginY={5} />
              <DescriptionForm control={control} />
              <Divider marginY={5} />
              <UnitOfMeasureForm control={control} />
              <Divider marginY={5} />
              <InventoryForm control={control} />
              <Divider marginY={5} />
              <ShippingForm control={control} />
            </PanelCard>
          )}
        </Flex>
      )}
    </Box>
  )
}
