import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl, SelectControl} from "components/react-hook-form"
import {ProductFacets} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import {useEffect, useState} from "react"
import {useErrorToast, useSuccessToast} from "hooks/useToast"
import {array, object, string} from "yup"
import {getObjectDiff} from "utils"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"

interface ProductFacetFormProps {
  productFacet?: IProductFacet
}

export function ProductFacetForm({productFacet}: ProductFacetFormProps) {
  const isProductFacetManager = useHasAccess(appPermissions.ProductFacetManager)
  const [currentProductFacet, setCurrentProductFacet] = useState(productFacet)
  const [isCreating, setIsCreating] = useState(!productFacet?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  useEffect(() => {
    setIsCreating(!currentProductFacet?.ID)
  }, [currentProductFacet?.ID])

  const defaultValues: Partial<IProductFacet> = {}

  const validationSchema = object().shape({
    Name: string().required("Name is required"),
    xp: object().shape({
      Options: array().min(1, "Must have at least one option").required("Options are required")
    })
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: productFacet || defaultValues,
    mode: "onBlur"
  })

  async function createProductFacet(fields: IProductFacet) {
    const createdProductFacet = await ProductFacets.Create<IProductFacet>(fields)
    successToast({
      description: "Product Facet created successfully."
    })
    router.replace(`/settings/productfacets/${createdProductFacet.ID}`)
  }

  async function updateProductFacet(fields: IProductFacet) {
    const diff = getObjectDiff(currentProductFacet, fields)
    const updatedProductFacet = await ProductFacets.Patch<IProductFacet>(fields.ID, diff)
    successToast({
      description: "Product Facet updated successfully."
    })
    setCurrentProductFacet(updatedProductFacet)
    reset(updatedProductFacet)
  }

  async function onSubmit(fields: IProductFacet) {
    if (isCreating) {
      await createProductFacet(fields)
    } else {
      await updateProductFacet(fields)
    }
  }

  async function deleteProductFacet() {
    try {
      await ProductFacets.Delete(router.query.id as string)
      router.push(".")
      successToast({
        description: "Product Facet deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Product Facet delete failed"
      })
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <ProtectedContent hasAccess={appPermissions.ProductFacetManager}>
          <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
            <Button onClick={() => router.push("/settings/productfacets")} variant="ghost" leftIcon={<TbChevronLeft />}>
              Back
            </Button>
            <ButtonGroup>
              <Button onClick={() => deleteProductFacet()} variant="outline" colorScheme={"danger"} hidden={isCreating}>
                Delete
              </Button>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
            </ButtonGroup>
          </CardHeader>
        </ProtectedContent>
        <CardBody
          display="flex"
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent="space-between"
          gap={6}
        >
          <InputControl
            maxW="sm"
            name="Name"
            label="Name"
            helperText="A name for this facet group"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isProductFacetManager}
          />
          <SelectControl
            maxW="sm"
            name="xp.Options"
            label="Options"
            helperText="Create options for this facet group"
            control={control}
            validationSchema={validationSchema}
            selectProps={{isCreatable: true, isMulti: true}}
            isDisabled={!isProductFacetManager}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
