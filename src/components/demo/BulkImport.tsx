import {ViewIcon} from "@chakra-ui/icons"
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  MenuItem,
  Spinner,
  Text
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"

interface BulkImportProps {
  variant?: "button" | "menuitem"
}
export default function BulkImport({variant = "button"}: BulkImportProps) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const cancelRef = useRef()
  function requestBulkImport() {
    console.log("Demo Feature >> Not implemented!")
    setIsOpen(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {variant === "button" ? (
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Bulk Import
        </Button>
      ) : (
        <MenuItem onClick={() => setIsOpen(true)}>Bulk Import</MenuItem>
      )}
      <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)} leastDestructiveRef={cancelRef}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bulk Import
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">Import new data from an external data source, spreadsheet, or JSON file.</Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button ref={cancelRef} onClick={() => setIsOpen(false)} disabled={loading} variant="outline">
                  Cancel
                </Button>
                <Button variant="solid" colorScheme="primary" onClick={() => requestBulkImport()} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Bulk Import"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
