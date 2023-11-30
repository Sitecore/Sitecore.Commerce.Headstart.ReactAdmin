import {Box, Container, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {useRouter} from "hooks/useRouter"
import {useErrorToast, useSuccessToast, useToast} from "hooks/useToast"
import {cloneDeep, invert, merge, zipObject} from "lodash"
import {Products, ProductCatalogAssignment} from "ordercloud-javascript-sdk"
import {useState} from "react"
import {Resolver, useForm} from "react-hook-form"
import {IPriceSchedule} from "types/ordercloud/IPriceSchedule"
import {IProduct} from "types/ordercloud/IProduct"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {ISpec} from "types/ordercloud/ISpec"
import {IVariant} from "types/ordercloud/IVariant"
import {ProductDetailTab} from "./ProductDetailTab"
import ProductDetailToolbar from "./ProductDetailToolbar"
import {ProductDetailFormFields, defaultValues, validationSchema} from "./form-meta"
import {submitProduct} from "services/product-submit.service"
import {fetchVariants} from "services/product-data-fetcher.service"
import {ICategoryProductAssignment} from "types/ordercloud/ICategoryProductAssignment"
import {FacetTab} from "./facets/FacetTab"
import {MediaTab} from "./media/MediaTab"
import {PricingTab} from "./pricing/PricingTab"
import {DetailsTab} from "./details/DetailsTab"
import {CatalogsTab} from "./catalogs/CatalogsTab"
import {VariantsTab} from "./variants/VariantsTab"
import {CustomizationTab} from "./customization/CustomizationTab"
import {FulfillmentTab} from "./fulfillment/FulfillmentTab"
import {IInventoryRecord} from "types/ordercloud/IInventoryRecord"

const tabs = ["Details", "Pricing", "Fulfillment", "Catalogs", "Variants", "Media", "Facets", "Customization"] as const

export type ProductDetailTab = (typeof tabs)[number]

const tabIndexMap = zipObject(
  tabs,
  tabs.map((_, idx) => idx)
) as Record<ProductDetailTab, number>
const inverseTabIndexMap = invert(tabIndexMap)

interface ProductDetailProps {
  defaultOwnerId: string
  initialTab: ProductDetailTab
  initialProduct?: IProduct
  initialInventoryRecords: IInventoryRecord[]
  initialDefaultPriceSchedule?: IPriceSchedule
  initialOverridePriceSchedules?: IPriceSchedule[]
  initialSpecs?: ISpec[]
  initialVariants?: IVariant[]
  facets?: IProductFacet[]
  initialCatalogAssignments?: ProductCatalogAssignment[]
  initialCategoryAssignments?: ICategoryProductAssignment[]
}
export default function ProductDetail({
  initialTab,
  initialProduct,
  initialInventoryRecords,
  initialDefaultPriceSchedule = {} as IPriceSchedule,
  initialOverridePriceSchedules,
  initialSpecs,
  initialVariants,
  facets, // facets won't change so we don't need to use state
  initialCatalogAssignments,
  initialCategoryAssignments,
  defaultOwnerId
}: ProductDetailProps) {
  // setting initial values for state so we can update on submit when product is updated
  // this allows us to keep the form in sync with the product without having to refresh the page
  const [product, setProduct] = useState(initialProduct)
  const [inventoryRecords, setInventoryRecords] = useState(initialInventoryRecords)
  const [defaultPriceSchedule, setDefaultPriceSchedule] = useState(initialDefaultPriceSchedule)
  const [overridePriceSchedules, setOverridePriceSchedules] = useState(initialOverridePriceSchedules)
  const [specs, setSpecs] = useState(initialSpecs)
  const [variants, setVariants] = useState(initialVariants)
  const [catalogAssignments, setCatalogAssignments] = useState(initialCatalogAssignments)
  const [categoryAssignments, setCategoryAssignments] = useState(initialCategoryAssignments)

  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const toast = useToast()
  const [tabIndex, setTabIndex] = useState(tabIndexMap[initialTab])
  const isCreatingNew = !Boolean(product?.ID)
  const initialViewVisibility = zipObject(
    tabs,
    tabs.map(() => true)
  ) as Record<ProductDetailTab, boolean>
  const [viewVisibility, setViewVisibility] = useState(initialViewVisibility)

  const initialValues = product
    ? {
        Product: cloneDeep(product),
        InventoryRecords: cloneDeep(inventoryRecords),
        DefaultPriceSchedule: cloneDeep(defaultPriceSchedule),
        Specs: cloneDeep(specs),
        Variants: cloneDeep(variants),
        OverridePriceSchedules: cloneDeep(overridePriceSchedules),
        CatalogAssignments: cloneDeep(catalogAssignments),
        CategoryAssignments: cloneDeep(categoryAssignments)
      }
    : merge(defaultValues, {Product: {OwnerID: defaultOwnerId}})

  const {handleSubmit, control, reset, trigger} = useForm<ProductDetailFormFields>({
    resolver: yupResolver(validationSchema) as any,
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
      updatedInventoryRecords,
      updatedDefaultPriceSchedule,
      updatedPriceOverrides,
      updatedSpecs,
      didUpdateSpecs,
      updatedVariants,
      updatedCatalogAssignments,
      updatedCategoryAssignments
    } = await submitProduct(
      isCreatingNew,
      defaultPriceSchedule,
      fields.DefaultPriceSchedule,
      product,
      fields.Product,
      inventoryRecords,
      fields.InventoryRecords,
      specs,
      fields.Specs,
      variants,
      fields.Variants,
      overridePriceSchedules,
      fields.OverridePriceSchedules,
      catalogAssignments,
      fields.CatalogAssignments,
      categoryAssignments,
      fields.CategoryAssignments
    )
    successToast({
      description: isCreatingNew ? "Product Created" : "Product updated"
    })
    if (didUpdateSpecs && updatedSpecs?.length) {
      toast({status: "info", description: "It looks like you updated specs. You may wish to regenerate variants"})
    }

    if (isCreatingNew) {
      router.replace(`/products/${updatedProduct.ID}`)
    } else {
      // Update the state with the new product data
      setProduct(updatedProduct)
      setInventoryRecords(updatedInventoryRecords)
      setDefaultPriceSchedule(updatedDefaultPriceSchedule)
      setOverridePriceSchedules(updatedPriceOverrides)
      setSpecs(updatedSpecs)
      setVariants(updatedVariants)
      setCatalogAssignments(updatedCatalogAssignments)
      setCategoryAssignments(updatedCategoryAssignments)

      // reset the form with new product data
      reset({
        Product: cloneDeep(updatedProduct),
        InventoryRecords: cloneDeep(updatedInventoryRecords),
        DefaultPriceSchedule: cloneDeep(updatedDefaultPriceSchedule),
        Specs: cloneDeep(updatedSpecs),
        Variants: cloneDeep(updatedVariants),
        OverridePriceSchedules: cloneDeep(updatedPriceOverrides),
        CatalogAssignments: cloneDeep(updatedCatalogAssignments),
        CategoryAssignments: cloneDeep(updatedCategoryAssignments)
      })
    }
  }

  const handleGenerateVariants = async (shouldOverwrite: boolean) => {
    const updatedProduct = await Products.GenerateVariants(product.ID, {overwriteExisting: shouldOverwrite})
    const updatedVariants = await fetchVariants(updatedProduct)
    setVariants(updatedVariants)
    // reset the form with new product data
    reset({
      Product: cloneDeep(updatedProduct),
      InventoryRecords: cloneDeep(inventoryRecords),
      DefaultPriceSchedule: cloneDeep(defaultPriceSchedule),
      Specs: cloneDeep(specs),
      Variants: cloneDeep(updatedVariants),
      OverridePriceSchedules: cloneDeep(overridePriceSchedules),
      CatalogAssignments: cloneDeep(catalogAssignments),
      CategoryAssignments: cloneDeep(categoryAssignments)
    })
  }

  const onInvalid = (errors) => {
    errorToast({title: "Form errors", description: "Please resolve the errors and try again."})
  }

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
        <Tabs colorScheme="accent" index={tabIndex} onChange={handleTabsChange} isLazy>
          <TabList flexWrap="wrap">
            {tabs.map((tab) => viewVisibility[tab] && <ProductDetailTab key={tab} tab={tab} control={control} />)}
          </TabList>

          <TabPanels>
            {viewVisibility.Details && (
              <TabPanel p={0} mt={6}>
                <DetailsTab
                  product={product}
                  control={control}
                  validationSchema={validationSchema}
                  isCreatingNew={isCreatingNew}
                />
              </TabPanel>
            )}
            {viewVisibility.Pricing && (
              <TabPanel p={0} mt={6} maxW="container.xl">
                <PricingTab
                  control={control}
                  trigger={trigger}
                  priceBreakCount={defaultPriceSchedule?.PriceBreaks?.length || 0}
                  overridePriceSchedules={overridePriceSchedules}
                />
              </TabPanel>
            )}
            {viewVisibility.Fulfillment && (
              <TabPanel p={0} mt={6}>
                <FulfillmentTab control={control} validationSchema={validationSchema} />
              </TabPanel>
            )}
            {viewVisibility.Catalogs && (
              <TabPanel p={0} mt={6}>
                <CatalogsTab control={control} />
              </TabPanel>
            )}
            {viewVisibility.Variants && (
              <TabPanel p={0} mt={6}>
                <VariantsTab
                  control={control}
                  validationSchema={validationSchema}
                  variants={variants}
                  specs={specs}
                  onGenerateVariants={handleGenerateVariants}
                />
              </TabPanel>
            )}
            {viewVisibility.Media && (
              <TabPanel p={0} mt={6}>
                <MediaTab control={control} />
              </TabPanel>
            )}
            {viewVisibility.Facets && (
              <TabPanel p={0} mt={6}>
                <FacetTab control={control} validationSchema={validationSchema} facetList={facets} width="100%" />
              </TabPanel>
            )}
            {viewVisibility.Customization && (
              <TabPanel p={0} mt={6}>
                <CustomizationTab control={control} product={product} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}
