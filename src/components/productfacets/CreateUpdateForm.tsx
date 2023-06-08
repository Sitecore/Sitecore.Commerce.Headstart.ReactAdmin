import * as Yup from "yup"
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text
} from "@chakra-ui/react"
import {InputControl} from "components/react-hook-form"
import {ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useEffect, useState, KeyboardEvent} from "react"
import {HiOutlineX} from "react-icons/hi"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {xpHelper} from "utils"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft, TbX} from "react-icons/tb"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  productfacet?: ProductFacet
}

function CreateUpdateForm({productfacet}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required")
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues} = useCreateUpdateForm<ProductFacet>(
    productfacet,
    formShape,
    createProductFacet,
    updateProductFacet
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  const [inputValue, setInputValue] = useState("")
  const [facetOptions, setFacetOptions] = useState([])

  useEffect(() => {
    setFacetOptions(productfacet?.xp?.Options || [])
  }, [productfacet?.xp?.Options])

  function onSubmit(fields) {
    fields.xp_Options = facetOptions
    const productfacet = xpHelper.unflattenXpObject(fields, "_") as ProductFacet
    if (isCreating) {
      createProductFacet(productfacet)
    } else {
      updateProductFacet(productfacet)
    }
  }

  const handleAddButtonClick = () => {
    const newFacetOptions = [...facetOptions, inputValue]
    setFacetOptions(newFacetOptions)
    setInputValue("")
  }
  const removeFacetOption = (index) => {
    setFacetOptions((oldValues) => {
      return oldValues.filter((_, i) => i !== index)
    })
  }

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

  async function deleteProductFacets() {
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

  const resetForm = () => {
    setFacetOptions(productfacet.xp?.Options || [])
    setInputValue("")
    reset()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault() // prevent form from being submitted
      handleAddButtonClick()
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card>
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
              onClick={() => deleteProductFacets()}
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
          as="form"
          noValidate
          alignItems={"flex-start"}
          justifyContent="space-between"
          onSubmit={handleSubmit(onSubmit)}
          gap={6}
        >
          <FormLabel>
            Facet Options :
            <Text color="gray.400" fontWeight={"light"} fontSize="sm">
              Create options for this facet group
            </Text>
          </FormLabel>
          <InputGroup maxW="sm">
            <Input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a facet value..."
            />
            <InputRightElement right=".5rem">
              <Button
                isDisabled={!inputValue}
                size="sm"
                onClick={() => {
                  handleAddButtonClick()
                }}
              >
                Add
              </Button>
            </InputRightElement>
          </InputGroup>
          <ButtonGroup display="flex" flexWrap="wrap" gap={2}>
            {facetOptions.map((facetOption, index) => (
              <Button
                key={index}
                leftIcon={<TbX />}
                variant={"outline"}
                fontWeight={"normal"}
                borderRadius={"full"}
                onClick={() => removeFacetOption(index)}
                style={{margin: 0}}
              >
                {facetOption}
              </Button>
            ))}
          </ButtonGroup>
        </CardBody>
      </Card>
    </Container>
  )
}
