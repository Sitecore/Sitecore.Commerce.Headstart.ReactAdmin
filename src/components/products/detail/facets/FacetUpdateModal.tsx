import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonProps,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react"
import {FormEvent, useEffect, useRef} from "react"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {array, object, string} from "yup"
import {SelectControl} from "@/components/react-hook-form"
import {IProductFacet} from "types/ordercloud/IProductFacet"
import {Link} from "@chakra-ui/next-js"
import ProtectedContent from "@/components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

interface FacetUpdateModalProps {
  availableFacets: IProductFacet[]
  facetIds?: string[]
  onUpdate: (facetIds: string[]) => void
  buttonProps?: ButtonProps
}
export function FacetUpdateModal({availableFacets, facetIds = [], onUpdate, buttonProps}: FacetUpdateModalProps) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef()
  const selectedOptions = facetIds.filter((id) => availableFacets.find((facet) => facet.ID === id))
  const availableFacetFields = availableFacets.map((facet) => ({label: facet.Name, value: facet.ID}))
  const validationSchema = object().shape({
    SelectedFacets: array().of(string())
  })
  const {handleSubmit, control, reset} = useForm({
    mode: "onBlur",
    resolver: yupResolver(validationSchema),
    defaultValues: {SelectedFacets: selectedOptions} as any
  })

  useEffect(() => {
    reset({SelectedFacets: facetIds.filter((id) => availableFacets.find((facet) => facet.ID === id))})
  }, [facetIds, reset, availableFacets])

  const handleSubmitPreventBubbling = (event: FormEvent) => {
    // a version of handleSubmit that prevents
    // the parent form from being submitted
    // which would actually try to save the product (not desired)
    event.preventDefault()
    event.stopPropagation()
    handleSubmit(onSubmit)(event)
  }

  const handleCancel = () => {
    onClose()
  }

  const onSubmit = (update: {SelectedFacets: string[]}) => {
    onUpdate(update.SelectedFacets)
    onClose()
  }

  return (
    <>
      <ProtectedContent hasAccess={appPermissions.ProductManager}>
        <Button {...buttonProps} onClick={onOpen}>
          {facetIds.length ? "Edit Facets" : "Add Facets"}
        </Button>
      </ProtectedContent>

      <Modal size="5xl" isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        {availableFacets.length ? (
          <ModalContent as="form" noValidate onSubmit={handleSubmitPreventBubbling}>
            <ModalHeader>Update Facets</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <SelectControl
                name="SelectedFacets"
                control={control}
                validationSchema={validationSchema}
                selectProps={{
                  isMulti: true,
                  options: availableFacetFields
                }}
              ></SelectControl>
            </ModalBody>
            <ModalFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button onClick={handleCancel} variant="outline">
                  Cancel
                </Button>
                <SubmitButton control={control} variant="solid" colorScheme="primary">
                  Submit
                </SubmitButton>
              </HStack>
            </ModalFooter>
          </ModalContent>
        ) : (
          <AlertDialog leastDestructiveRef={cancelRef} onClose={onClose} isOpen={isOpen}>
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>No Global Facets</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>
                It doesnt look like there are any global facets available.{" "}
                <Link href="/settings/productfacets">Click here</Link> to create a global facet first, and then you can
                come back and add it to this product.
              </AlertDialogBody>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </Modal>
    </>
  )
}
