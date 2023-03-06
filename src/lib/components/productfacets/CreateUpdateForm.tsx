import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, FormLabel, HStack, Icon, Stack, Text} from "@chakra-ui/react"
import {InputControl} from "formik-chakra-ui"
import {ProductFacet} from "ordercloud-javascript-sdk"
import Card from "../card/Card"
import {Field, Formik} from "formik"
import {useRouter} from "next/router"
import {productfacetsService} from "lib/api/productfacets"
import {useEffect, useState, KeyboardEvent} from "react"
import {HiOutlineX} from "react-icons/hi"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"
import {xpHelper} from "lib/utils"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  productfacet?: ProductFacet
}

function CreateUpdateForm({productfacet}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required")
  }
  const {isCreating, successToast, errorToast, validationSchema, initialValues} = useCreateUpdateForm<ProductFacet>(
    productfacet,
    formShape,
    createProductFacet,
    updateProductFacet
  )
  const [inputValue, setInputValue] = useState("")
  const [facetOptions, setFacetOptions] = useState([])

  useEffect(() => {
    setFacetOptions(productfacet?.xp?.Options || [])
  }, [productfacet?.xp?.Options])

  function onSubmit(fields, {setStatus, setSubmitting}) {
    setStatus()
    fields.xp_Options = facetOptions
    const productfacet = xpHelper.unflattenXpObject(fields, "_") as ProductFacet
    if (isCreating) {
      createProductFacet(productfacet)
    } else {
      updateProductFacet(productfacet)
    }
    setSubmitting()
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
    await productfacetsService.create(fields)
    successToast({
      description: "Product Facet created successfully."
    })
    router.push(".")
  }

  async function updateProductFacet(fields: ProductFacet) {
    await productfacetsService.update(fields)
    successToast({
      description: "Product Facet updated successfully."
    })
    router.push(".")
  }

  async function deleteProductFacets() {
    try {
      await productfacetsService.delete(router.query.id)
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

  const reset = () => {
    setFacetOptions(productfacet.xp?.Options || [])
    setInputValue("")
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
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            // most of the usefull available Formik props
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            setFieldValue,
            resetForm
          }) => (
            <Box as="form" onSubmit={handleSubmit as any}>
              <Stack spacing={5}>
                <InputControl name="Name" label="Product Facet Name" />
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
                  <Field name="xp_Options">
                    {({
                      field, // { name, value, onChange, onBlur }
                      form: {touched, errors}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                      meta
                    }) => (
                      <div>
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(event) => setInputValue(event.target.value)}
                          onKeyDown={handleKeyDown}
                          className="add-facet-option-input"
                          placeholder="Add a facet value..."
                        />
                        {meta.touched && meta.error && <div className="error">{meta.error}</div>}
                      </div>
                    )}
                  </Field>
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
                      <Button variant="primaryButton" type="submit" isLoading={isSubmitting} mr="15px">
                        Save
                      </Button>
                      <Button onClick={reset} type="reset" variant="secondaryButton" isLoading={isSubmitting} mr="15px">
                        Reset
                      </Button>
                      <Button
                        onClick={() => router.push("/settings/productfacets")}
                        variant="secondaryButton"
                        isLoading={isSubmitting}
                        mr="15px"
                      >
                        Cancel
                      </Button>
                    </Box>
                    <Button
                      onClick={() => deleteProductFacets()}
                      variant="secondaryButton"
                      isLoading={isSubmitting}
                      hidden={isCreating}
                    >
                      Delete
                    </Button>
                  </HStack>
                </ButtonGroup>
              </Stack>
            </Box>
          )}
        </Formik>
      </Flex>
    </Card>
  )
}
