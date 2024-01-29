import {
  Box,
  Card,
  CardBody,
  Grid,
  GridItem,
  HStack,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react"
import {Categories, Category} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {CategoryForm} from "components/categories"
import ExportToCsv from "components/demo/ExportToCsv"
import {ICategory} from "types/ordercloud/ICategoryXp"
import React from "react"
import TreeView from "components/dndtreeview/TreeView"
import {ocNodeModel} from "@minoru/react-dnd-treeview"
import {useRouter} from "hooks/useRouter"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const CategoriesList = (props) => {
  const [categoriesTreeView, setCategoriesTreeView] = useState([])
  const [selectedNode, setSelectedNode] = useState<ocNodeModel>(null)
  const router = useRouter()
  const {isOpen: isCategoryCreateOpen, onOpen: onOpenCategoryCreate, onClose: onCloseCategoryCreate} = useDisclosure()
  const [parentIdToCreate, setParentIdToCreate] = useState(null)

  const initCategoriesData = useCallback(
    async (catalogid: string) => {
      const categoriesList = await Categories.List<ICategory>(catalogid,{depth:"all"})
      if (selectedNode) {
        const selectedCategoryId = selectedNode.data.ID
        const selectedCategoryExists = categoriesList.Items.find((category) => category.ID === selectedCategoryId)
        if (!selectedCategoryExists) {
          setSelectedNode(null)
        }
      }
      setCategoriesTreeView(await buildTreeView(categoriesList.Items))
    },
    [selectedNode]
  )

  useEffect(() => {
    initCategoriesData(router.query.catalogid as string)
  }, [router.query.catalogid, initCategoriesData])

  async function buildTreeView(treeData: any[]) {
    const treeViewData = treeData.map((item) => {
      return {
        id: item.ID,
        parent: item.ParentID ? item.ParentID : "-",
        text: item.Name,
        type: "category",
        droppable: true,
        data: item
      }
    })
    treeViewData.push({
      id: "__CREATE_CATEGORY_BUTTON__",
      parent: "-",
      text: "",
      droppable: false,
      type: "button",
      data: {}
    })

    return treeViewData
  }
  const handleSelect = (node: ocNodeModel) => setSelectedNode(node)

  const handleCategoryCreate = (category: Category) => {
    setParentIdToCreate(category?.ID)
    onOpenCategoryCreate()
  }

  const onCategoryCreateSuccess = async (category: Category) => {
    onCloseCategoryCreate()
    await initCategoriesData(router.query.catalogid as string)
  }

  return (
    <>
      <Box padding="20px">
        <HStack justifyContent="end" w="100%" mb={5}>
          <HStack>
            <ExportToCsv />
          </HStack>
        </HStack>
        <Card>
          <CardBody>
            <Grid
              templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
              gridTemplateRows={"auto 1fr 30px"}
              gridTemplateColumns={"auto 1fr"}
              h="auto"
              gap="1"
              color="blackAlpha.700"
              fontWeight="bold"
            >
              <GridItem pl="2" area={"header"}></GridItem>
              <GridItem pl="2" area={"nav"} width="300px">
                <TreeView
                  treeData={categoriesTreeView}
                  selectedNode={selectedNode}
                  handleSelect={handleSelect}
                  handleCategoryCreate={handleCategoryCreate}
                  {...props}
                />
              </GridItem>
              <GridItem pl="2" area={"main"}>
                {selectedNode ? (
                  <CategoryForm
                    category={selectedNode.data}
                    onSuccess={onCategoryCreateSuccess}
                    headerComponent={
                      <Heading as="h5" size="md" marginLeft={10} marginTop={5}>
                        Update the selected category
                      </Heading>
                    }
                  />
                ) : (
                  <CategoryForm
                    onSuccess={onCategoryCreateSuccess}
                    category={{Name: "", Description: "", Active: false, ParentID: ""}}
                    headerComponent={
                      <Heading as="h5" size="md" marginLeft={10} marginTop={5}>
                        Create root category
                      </Heading>
                    }
                  />
                )}
              </GridItem>
              <GridItem pl="2" area={"footer"}></GridItem>
            </Grid>
          </CardBody>
        </Card>
      </Box>
      <Modal size="2xl" isOpen={isCategoryCreateOpen} onClose={onCloseCategoryCreate}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          <ModalHeader>Create category</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CategoryForm parentId={parentIdToCreate} onSuccess={onCategoryCreateSuccess} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

const ProtectedCategoriesList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerCatalogViewer, appPermissions.BuyerCatalogManager]}>
      <CategoriesList />
    </ProtectedContent>
  )
}

export default ProtectedCategoriesList
