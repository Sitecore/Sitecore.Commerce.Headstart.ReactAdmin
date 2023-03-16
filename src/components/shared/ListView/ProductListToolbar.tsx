import BrandedSpinner from "@/components/branding/BrandedSpinner"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Stack,
  Text,
  useDisclosure
} from "@chakra-ui/react"
import {useErrorToast} from "hooks/useToast"
import {PartialDeep, Products} from "ordercloud-javascript-sdk"
import {ChangeEvent, FC, useRef, useState} from "react"
import {IProduct} from "types/ordercloud/IProduct"
import {ListViewChildrenProps} from "./ListView"
import ProductFilters from "./ProductFilters"
import ProductSearch from "./ProductSearch"

interface ProductListToolbarProps extends Omit<ListViewChildrenProps, "children"> {}

const ProductListToolbar: FC<ProductListToolbarProps> = ({
  metaInformationDisplay,
  viewModeToggle,
  updateQuery,
  queryParams,
  selected,
  loading
}) => {
  const [selectedPromotion, setselectedPromotion] = useState("")
  const [promotions, setPromotions] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [isMassEditing, setIsMassEditing] = useState(false)
  const [isBulkImportDialogOpen, setBulkImportDialogOpen] = useState(false)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const [isPromotionDialogOpen, setPromotionDialogOpen] = useState(false)
  const errorToast = useErrorToast()
  const cancelRef = useRef()
  const {
    isOpen: isOpenMassEditProducts,
    onOpen: onOpenselectedProductIds,
    onClose: onCloseMassEditProducts
  } = useDisclosure()

  const {isOpen: isOpenAddProduct, onOpen: onOpenAddProduct, onClose: onCloseAddProduct} = useDisclosure()
  const onMassEditOpenClicked = async (e) => {
    if (!selected.length) {
      errorToast({
        title: "No Products selected",
        description: "Please select at least 1 Product for mass editing"
      })
    } else {
      onOpenselectedProductIds()
    }
  }
  const requestExportCSV = () => {}
  const requestImportCSV = () => {}

  const [isFormValid, setIsFormValid] = useState(false)
  const [formValues, setFormValues] = useState({
    id: "",
    name: "",
    description: "",
    isActive: false,
    isInactive: false
  })
  const handleInputChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormValues((v) => {
      const updatedValues = {...v, [fieldKey]: e.target.value}
      setIsFormValid(updatedValues.id !== "" && updatedValues.name !== "")
      return updatedValues
    })
  }

  const handleCheckboxChange = (fieldKey: string) => (e: ChangeEvent<HTMLInputElement>) => {
    if (fieldKey == "isActive" && formValues["isInactive"]) {
      setFormValues((v) => ({...v, ["isInactive"]: false}))
    } else if (fieldKey == "isInactive" && formValues["isActive"]) {
      setFormValues((v) => ({...v, ["isActive"]: false}))
    }
    setFormValues((v) => ({...v, [fieldKey]: !!e.target.checked}))
  }

  const onExecuteMassEdit = async () => {
    setIsMassEditing(true)
    var activate = formValues.isActive
    var deactivate = formValues.isInactive
    var newActivationStatus = activate ? true : deactivate ? false : null
    if (newActivationStatus == null) {
      errorToast({
        title: "No Activation Status set",
        description: "Please choose at least 1 activation status"
      })
      setIsMassEditing(false)
      return
    }
  }

  return (
    <>
      <Stack direction="row" mb={5}>
        <ProductSearch value={queryParams["Search"]} onSearch={updateQuery("s")} />
        <ProductFilters />

        <Button variant="secondaryButton" onClick={onMassEditOpenClicked}>
          Bulk Edit
        </Button>
        <Button variant="secondaryButton" onClick={() => setPromotionDialogOpen(true)}>
          Assign Promotion
        </Button>
        <Button variant="secondaryButton" onClick={() => setBulkImportDialogOpen(true)}>
          Bulk Import
        </Button>
        <Box as="span" flexGrow="1"></Box>
        {metaInformationDisplay}
        <Box as="span" width="2"></Box>
        {viewModeToggle}
        <Button variant="primaryButton">Create Product</Button>
      </Stack>

      <Modal isOpen={isOpenMassEditProducts} onClose={onCloseMassEditProducts}>
        <ModalOverlay backdropFilter="blur(10px) hue-rotate(90deg)" />
        <ModalContent>
          {isMassEditing ? (
            <ModalHeader textAlign={"center"}>
              MassEditing... <BrandedSpinner />
            </ModalHeader>
          ) : (
            <>
              <ModalHeader>Mass Edit Products</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <Text>You have selected {selected.length} Products</Text>
                <FormControl mt={4}>
                  <FormLabel>Activate</FormLabel>
                  <Checkbox isChecked={formValues.isActive} onChange={handleCheckboxChange("isActive")} />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Deactivate</FormLabel>
                  <Checkbox isChecked={formValues.isInactive} onChange={handleCheckboxChange("isInactive")} />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <HStack justifyContent="space-between" w="100%">
                  <Button onClick={onCloseMassEditProducts} variant="secondaryButton">
                    Cancel
                  </Button>
                  <Button colorScheme="purple" mr={3} onClick={onExecuteMassEdit} variant="primaryButton">
                    Save
                  </Button>
                </HStack>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isBulkImportDialogOpen}
        onClose={() => setBulkImportDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bulk Import Products
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Bulk import products from an excel or csv file, once the upload button is clicked behind the scenes a
                job will be kicked off load each of the products included in your files, once it has completed you will
                see them appear in your search.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setBulkImportDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestImportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Import Products"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isPromotionDialogOpen}
        onClose={() => setPromotionDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Attach a Promotion
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Select a promotion from the dropdown to assign to the previously selected products.
                <Select title="Select promotion" mt="20px" value={selectedPromotion}>
                  {!!promotions.length &&
                    promotions.map((promotion) => (
                      <option key={promotion.ID} value={promotion.ID}>
                        {promotion.Name}
                      </option>
                    ))}
                </Select>
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setPromotionDialogOpen(false)}
                  disabled={loading}
                  variant="secondaryButton"
                >
                  Cancel
                </Button>
                <Button onClick={requestImportCSV} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Assign Promotion"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default ProductListToolbar
