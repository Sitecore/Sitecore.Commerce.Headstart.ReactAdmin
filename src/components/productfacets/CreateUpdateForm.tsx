import * as Yup from "yup"
import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {InputControl} from "components/react-hook-form"
import {ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import ChipInputControl from "../react-hook-form/chip-input-control"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  productfacet?: ProductFacet
}

function CreateUpdateForm({productfacet}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required"),
    xp_Options: Yup.array().min(1, "Must have at least one option").required("Options are required")
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues, onSubmit} =
    useCreateUpdateForm<ProductFacet>(productfacet, formShape, createProductFacet, updateProductFacet)

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  async function createProductFacet(fields: ProductFacet) {
    await ProductFacets.Create<IProductFacet>(fields)
    successToast({
      description: "Product Facet created successfully."
    })
    router.push(".")
  }

  async function updateProductFacet(fields: ProductFacet) {
    await ProductFacets.Save<IProductFacet>(fields.ID, fields)
    successToast({
      description: "Product Facet updated successfully."
    })
    router.push(".")
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
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button
            onClick={() => router.push("/settings/productfacets")}
            variant="outline"
            isLoading={isSubmitting}
            leftIcon={<TbChevronLeft />}
          >
            Back
          </Button>
          <ButtonGroup>
            <Button
              onClick={() => deleteProductFacet()}
              variant="outline"
              colorScheme={"danger"}
              isLoading={isSubmitting}
              hidden={isCreating}
            >
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
          />
          <ChipInputControl
            maxW="sm"
            name="xp_Options"
            label="Options"
            helperText="Create options for this facet group"
            inputProps={{placeholder: "Add a facet option..."}}
            control={control}
            validationSchema={validationSchema}
          />
        </CardBody>
      </Card>
    </Container>
  )
}
