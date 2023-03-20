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
import {Formik, FormikErrors, FormikTouched} from "formik"
import {DescriptionForm} from "./forms/DescriptionForm/DescriptionForm"
import {DetailsForm} from "./forms/DetailsForm/DetailsForm"
import {InventoryForm} from "./forms/InventoryForm/InventoryForm"
import {ShippingForm} from "./forms/ShippingForm/ShippingForm"
import {UnitOfMeasureForm} from "./forms/UnitOfMeasureForm/UnitOfMeasureForm"
import ImagePreview from "./ImagePreview"
import {withDefaultValuesFallback, getObjectDiff, makeNestedObject} from "utils"
import {cloneDeep, get, isEmpty} from "lodash"
import {Products} from "ordercloud-javascript-sdk"
import {defaultValues, tabFieldNames, validationSchema} from "./forms/meta"
import ProductDetailToolbar from "./ProductDetailToolbar"
import PanelCard from "components/card/Card"
import {useSuccessToast} from "hooks/useToast"
import {IProduct} from "types/ordercloud/IProduct"
import {useRouter} from "hooks/useRouter"

type ProductDetailTab = "Details" | "Pricing" | "Variants" | "Media" | "Facets" | "SEO"

interface ProductDetailProps {
  showTabbedView?: boolean
  product?: IProduct
}
export default function ProductDetail({showTabbedView, product}: ProductDetailProps) {
  const router = useRouter()
  const successToast = useSuccessToast()
  const isCreatingNew = !Boolean(product?.ID)

  const initialValues = product
    ? withDefaultValuesFallback({Product: cloneDeep(product)}, defaultValues)
    : makeNestedObject(defaultValues)

  const onSubmit = async (fields, {setSubmitting}) => {
    let product: IProduct

    if (isCreatingNew) {
      product = await Products.Create<IProduct>(fields.Product)
    } else {
      const productDiff = getObjectDiff(product, fields.Product)
      product = await Products.Patch<IProduct>(product.ID, productDiff)
    }

    successToast({
      description: isCreatingNew ? "ProductCreated" : "Product updated"
    })

    setSubmitting(false)

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

  const tabHasError = (tab: ProductDetailTab, errors: FormikErrors<any>, touched: FormikTouched<any>): boolean => {
    if (isEmpty(errors)) {
      return false
    }
    return tabFieldNames[tab].some((fieldName) => get(errors, fieldName, null) && get(touched, fieldName, null))
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {({
        // most of the useful available Formik props
        values,
        errors,
        touched,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        isValid,
        isSubmitting,
        setFieldValue,
        resetForm
      }) => (
        <Box as="form" onSubmit={handleSubmit as any}>
          <ProductDetailToolbar product={product} isFormValid={isValid} />
          {showTabbedView ? (
            <Tabs>
              <TabList>
                <Tab>Details {tabHasError("Details", errors, touched) && "Tab Error"}</Tab>
                <Tab>Pricing</Tab>
                <Tab>Variants</Tab>
                <Tab>Media</Tab>
                <Tab>Facets</Tab>
                <Tab>SEO</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  {/* Details Tab */}
                  <Flex justifyContent="space-between" flexWrap="wrap" gap={7}>
                    <Flex flexFlow="column" flexGrow="1" rowGap={7}>
                      <SimpleCard title="Details">
                        <DetailsForm />
                      </SimpleCard>
                      <SimpleCard title="Description">
                        <DescriptionForm />
                      </SimpleCard>
                      <SimpleCard title="Unit of Measure">
                        <UnitOfMeasureForm />
                      </SimpleCard>
                      <SimpleCard title="Inventory">
                        <InventoryForm />
                      </SimpleCard>
                      <SimpleCard title="Shipping">
                        <ShippingForm product={product} />
                      </SimpleCard>
                    </Flex>
                    <Box>
                      <SimpleCard>
                        <ImagePreview images={product?.xp?.Images} />
                      </SimpleCard>
                    </Box>
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          ) : (
            <Flex gap={3} flexDirection="column">
              <PanelCard width={{base: "100%", xl: "50%"}} variant="primaryCard" closedText="Details">
                <Heading marginBottom={5}>Details</Heading>
                <DetailsForm />
                <Divider marginY={5} />
                <DescriptionForm />
                <Divider marginY={5} />
                <UnitOfMeasureForm />
                <Divider marginY={5} />
                <InventoryForm />
                <Divider marginY={5} />
                <ShippingForm product={product} />
              </PanelCard>
            </Flex>
          )}
        </Box>
      )}
    </Formik>
  )
}
