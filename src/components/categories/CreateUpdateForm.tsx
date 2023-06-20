import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, HStack, Stack, Text} from "@chakra-ui/react"
import {Categories, Category} from "ordercloud-javascript-sdk"
import {InputControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {ICategory} from "types/ordercloud/ICategoryXp"
import Card from "../card/Card"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import SubmitButton from "../react-hook-form/submit-button"
import {isValid} from "date-fns"
import ResetButton from "../react-hook-form/reset-button"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  category?: Category
  headerComponent?: React.ReactNode
  parentId?: string
  onSuccess?: (category: Category) => void
}
function CreateUpdateForm({category, headerComponent, parentId, onSuccess}: CreateUpdateFormProps) {
  const router = useRouter()
  const catalogID = router.query.catalogid as string
  const formShape = {
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues, onSubmit} =
    useCreateUpdateForm<Category>(category, formShape, createCategory, updateCategory)

  const {
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

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
    <>
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
          <Box as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <InputControl name="Name" label="Category Name" isRequired control={control} />
              <TextareaControl name="Description" label="Description" control={control} />
              <SwitchControl name="Active" label="Active" colorScheme="teal" size="lg" control={control} />
              <ButtonGroup>
                <HStack justifyContent="space-between" w="100%" mb={5}>
                  <Box>
                    <SubmitButton control={control} variant="solid" colorScheme="primary" mr="15px">
                      Save
                    </SubmitButton>
                    <ResetButton control={control} reset={reset} variant="outline">
                      Discard Changes
                    </ResetButton>
                    <Button
                      onClick={() =>
                        router.push(`/buyers/${router.query.buyerid}/catalogs/${router.query.catalogid}/categories`)
                      }
                      variant="outline"
                      isLoading={isSubmitting}
                      mr="15px"
                    >
                      Cancel
                    </Button>
                  </Box>
                  {!isCreating && (
                    <Button variant="outline" onClick={() => deleteCategory(category.ID)}>
                      Delete
                    </Button>
                  )}
                </HStack>
              </ButtonGroup>
            </Stack>
          </Box>
          {!isCreating && (
            <Card variant="primaryCard" h={"100%"} closedText="Extended Properties Cards">
              <Text>Under construction</Text>
            </Card>
          )}
        </Flex>
      </Box>
    </>
  )
}
