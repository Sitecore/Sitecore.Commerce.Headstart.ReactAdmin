import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack,
  Spinner,
  Text
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"

export default function ExportToPdf() {
  const [loading, setLoading] = useState(false)
  const [isExportPDFDialogOpen, setExportPDFDialogOpen] = useState(false)
  const cancelRef = useRef()
  const requestExportPDF = () => {
    console.log("Demo Feature >> Not implemented!")
    setExportPDFDialogOpen(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <Button variant="outline" onClick={() => setExportPDFDialogOpen(true)}>
        Export to Pdf
      </Button>
      <AlertDialog
        isOpen={isExportPDFDialogOpen}
        onClose={() => setExportPDFDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export Selected Orders to PDF
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected items to a PDF, once the export button is clicked behind the scense a job will be
                kicked off to create the pdf and then will automatically download to your downloads folder in the
                browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportPDFDialogOpen(false)}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button variant="solid" colorScheme="primary" onClick={requestExportPDF} disabled={loading}>
                  {loading ? <Spinner color="accent.500" /> : "Export Orders PDF"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
