import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, HStack, Stack} from "@chakra-ui/react"
import {Categories, Category} from "ordercloud-javascript-sdk"
import {InputControl, SwitchControl, TextareaControl} from "components/formik"
import {Formik} from "formik"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {ICategory} from "types/ordercloud/ICategoryXp"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  category?: Category
  headerComponent?: React.ReactNode
  parentId?: string
  onSuccess?: (category: Category) => void
}
function CreateUpdateForm({category, headerComponent, parentId, onSuccess}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  }
  const {isCreating, successToast, errorToast, validationSchema, initialValues, onSubmit} =
    useCreateUpdateForm<Category>(category, formShape, createCategory, updateCategory)

  async function createCategory(fields: Category) {
    fields.ParentID = parentId
    const createdCategory = await Categories.Create<ICategory>(router.query.catalogid as string, fields)
    await Categories.SaveAssignment(router.query.catalogid as string, {
      CategoryID: createdCategory.ID,
      BuyerID: router.query.buyerid as string,
      UserGroupID: router.query.usergroupid as string
    })
    successToast({
      description: "Category created successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
  }

  async function updateCategory(fields: Category) {
    const updatedCategory = await Categories.Save<ICategory>(router.query.catalogid as string, fields.ID, fields)
    await Categories.SaveAssignment(router.query.catalogid as string, {
      CategoryID: updatedCategory.ID,
      BuyerID: router.query.buyerid as string,
      UserGroupID: router.query.usergroupid as string
    })
    successToast({
      description: "Category updated successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
  }

  async function deleteCategory(categoryid) {
    try {
      await Categories.Delete(router.query.catalogid as string, categoryid)
      successToast({
        description: "Category deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Category delete failed"
      })
    }
    if (onSuccess) {
      onSuccess(category)
    }
  }

  return (
    <Box
      borderRadius="xl"
      border="1px"
      borderColor="gray.200"
      pt="2"
      pb="2"
      mb="6"
      w="100%"
      width="full"
      position="relative"
      _hover={{
        textDecoration: "none",
        borderRadius: "10px"
      }}
    >
      {headerComponent}
      <Flex flexDirection="column" p="10">
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({
            // most of the useful available Formik props
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
                <InputControl name="Name" label="Category Name" />
                <TextareaControl name="Description" label="Description" />
                <SwitchControl name="Active" label="Active" colorScheme="teal" size="lg" />
                <ButtonGroup>
                  <HStack justifyContent="space-between" w="100%" mb={5}>
                    <Box>
                      <Button variant="primaryButton" type="submit" isLoading={isSubmitting} mr="15px">
                        Save
                      </Button>
                      <Button
                        onClick={() => {
                          resetForm()
                        }}
                        type="reset"
                        variant="secondaryButton"
                        isLoading={isSubmitting}
                        mr="15px"
                      >
                        Reset
                      </Button>
                      <Button
                        onClick={() =>
                          router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
                        }
                        variant="secondaryButton"
                        isLoading={isSubmitting}
                        mr="15px"
                      >
                        Cancel
                      </Button>
                    </Box>
                    {!isCreating && (
                      <Button variant="secondaryButton" onClick={() => deleteCategory(values.ID)}>
                        Delete
                      </Button>
                    )}
                  </HStack>
                </ButtonGroup>
              </Stack>
            </Box>
          )}
        </Formik>
      </Flex>
    </Box>
  )
}
