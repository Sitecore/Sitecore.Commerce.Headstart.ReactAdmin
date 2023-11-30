import {Box, Button, ButtonGroup, Flex, HStack, Stack, Text} from "@chakra-ui/react"
import {Categories} from "ordercloud-javascript-sdk"
import {InputControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import {useRouter} from "hooks/useRouter"
import {ICategory} from "types/ordercloud/ICategoryXp"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {boolean, object, string} from "yup"
import {useErrorToast, useSuccessToast} from "hooks/useToast"
import {useEffect, useState} from "react"

interface CategoryFormProps {
  category?: ICategory
  headerComponent?: React.ReactNode
  parentId?: string
  onSuccess?: (category: ICategory) => void
}
export function CategoryForm({category, headerComponent, parentId, onSuccess}: CategoryFormProps) {
  const [currentCategory, setCurrentCategory] = useState(category)
  const [isCreating, setIsCreating] = useState(!category?.ID)

  const router = useRouter()
  const catalogID = router.isReady ? router.query.catalogid.toString() : null
  const buyerID = router.isReady ? router.query.buyerid.toString() : null
  const userGroupID = router.isReady ? router.query.usergroupid?.toString() : null

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  useEffect(() => {
    setIsCreating(!currentCategory?.ID)
  }, [currentCategory?.ID])

  const defaultValues: Partial<ICategory> = {
    Active: true
  }

  const validationSchema = object().shape({
    Active: boolean(),
    Name: string().max(100).required("Name is required"),
    Description: string().nullable().max(100)
  })

  const {handleSubmit, control, reset} = useForm<ICategory>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: category || defaultValues,
    mode: "onBlur"
  })

  async function createCategory(fields: ICategory) {
    fields.ParentID = parentId
    const createdCategory = await Categories.Create<ICategory>(catalogID, fields)
    await Categories.SaveAssignment(catalogID, {
      CategoryID: createdCategory.ID,
      BuyerID: buyerID,
      UserGroupID: userGroupID
    })
    successToast({
      description: "Category created successfully."
    })
    setCurrentCategory(createdCategory)
    reset(createdCategory)
  }

  async function updateCategory(fields: ICategory) {
    const updatedCategory = await Categories.Save<ICategory>(catalogID, fields.ID, fields)
    await Categories.SaveAssignment(catalogID, {
      CategoryID: updatedCategory.ID,
      BuyerID: buyerID,
      UserGroupID: userGroupID
    })
    successToast({
      description: "Category updated successfully."
    })
    setCurrentCategory(updatedCategory)
    reset(updatedCategory)
  }

  async function onSubmit(fields: ICategory) {
    if (isCreating) {
      await createCategory(fields)
    } else {
      await updateCategory(fields)
    }
  }

  async function deleteCategory(categoryid) {
    try {
      await Categories.Delete(catalogID, categoryid)
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
              <SwitchControl name="Active" label="Active" control={control} validationSchema={validationSchema} />
              <InputControl name="Name" label="Category Name" control={control} validationSchema={validationSchema} />
              <TextareaControl
                name="Description"
                label="Description"
                control={control}
                validationSchema={validationSchema}
              />
              <SwitchControl
                name="Active"
                label="Active"
                colorScheme="teal"
                size="lg"
                control={control}
                validationSchema={validationSchema}
              />
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
                      onClick={() => router.push(`/buyers/${buyerID}/catalogs/${catalogID}/categories`)}
                      variant="outline"
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
        </Flex>
      </Box>
    </>
  )
}
