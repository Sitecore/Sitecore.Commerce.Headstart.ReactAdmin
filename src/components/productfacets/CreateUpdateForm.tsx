import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, FormLabel, HStack, Icon, Stack, Text} from "@chakra-ui/react"
import {InputControl} from "components/react-hook-form"
import {ProductFacet, ProductFacets} from "ordercloud-javascript-sdk"
import Card from "../card/Card"
import {useRouter} from "hooks/useRouter"
import {useEffect, useState, KeyboardEvent} from "react"
import {HiOutlineX} from "react-icons/hi"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {xpHelper} from "utils"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"

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
    formState: {isSubmitting, isValid, isDirty},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues})

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
    <Card variant="primaryCard">
      <Flex flexDirection="column" p="10">
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={5}>
            <InputControl name="Name" label="Product Facet Name" control={control} isRequired />
            <FormLabel>
              Facet Options :<Text fontSize="sm">Create options for this facet group?</Text>
            </FormLabel>
            <Box id="facetlist" mt="GlobalPadding" mb="40px">
              <HStack className="facet-option-list">
                {facetOptions.map((facetOption, index) => (
                  <Box className="facet-option-container" key={index}>
                    <div className="facet-option-name">
                      {
                        <>
                          <Box
                            border="1px"
                            borderColor="lightGray"
                            pt="10px"
                            pb="10px"
                            pr="10px"
                            pl="30px"
                            position="relative"
                            borderRadius="md"
                          >
                            <Icon
                              as={HiOutlineX}
                              mr="10px"
                              ml="10px"
                              position="absolute"
                              left="0px"
                              top="14px"
                              cursor="pointer"
                              onClick={() => removeFacetOption(index)}
                            />
                            {facetOption}
                          </Box>
                        </>
                      }
                    </div>
                  </Box>
                ))}
              </HStack>
            </Box>
            <Box position="relative" className="facet-input">
              <div>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={handleKeyDown}
                  className="add-facet-option-input"
                  placeholder="Add a facet value..."
                />
              </div>
              <Button
                position="absolute"
                right="0"
                top="0"
                onClick={() => {
                  handleAddButtonClick()
                }}
              >
                Add
              </Button>
            </Box>
            <ButtonGroup>
              <HStack justifyContent="space-between" w="100%" mb={5}>
                <Box>
                  <Button
                    variant="solid"
                    colorScheme="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    mr="15px"
                    isDisabled={!isValid || !isDirty}
                  >
                    Save
                  </Button>
                  <Button onClick={resetForm} type="reset" variant="outline" isLoading={isSubmitting} mr="15px">
                    Reset
                  </Button>
                  <Button
                    onClick={() => router.push("/settings/productfacets")}
                    variant="outline"
                    isLoading={isSubmitting}
                    mr="15px"
                  >
                    Cancel
                  </Button>
                </Box>
                <Button
                  onClick={() => deleteProductFacets()}
                  variant="outline"
                  isLoading={isSubmitting}
                  hidden={isCreating}
                >
                  Delete
                </Button>
              </HStack>
            </ButtonGroup>
          </Stack>
        </Box>
      </Flex>
    </Card>
  )
}
