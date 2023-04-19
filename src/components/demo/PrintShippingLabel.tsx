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

export default function PrintShippingLabel() {
  const [loading, setLoading] = useState(false)
  const [isPrintLabelDialogOpen, setPrintLabelDialogOpen] = useState(false)
  const cancelRef = useRef()
  const requestPrintLabel = () => {
    console.log("Demo Feature >> Not implemented!")
    setPrintLabelDialogOpen(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      <Button variant="outline" onClick={() => setPrintLabelDialogOpen(true)}>
        Print Shipping Label
      </Button>
      <AlertDialog
        isOpen={isPrintLabelDialogOpen}
        onClose={() => setPrintLabelDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Print Labels for Selected Orders
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Print Labels for the selected orders onto an Avery label, once the button is clicked behind the scenes a
                job will be kicked off to create the labels in PDF format and then will automatically download to your
                downloads folder in the browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setPrintLabelDialogOpen(false)}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button onClick={requestPrintLabel} disabled={loading}>
                  {loading ? <Spinner color="brand.500" /> : "Print Labels"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
