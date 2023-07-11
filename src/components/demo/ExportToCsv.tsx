import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Hide,
  HStack,
  Icon,
  MenuItem,
  Show,
  Spinner,
  Text
} from "@chakra-ui/react"
import {useEffect, useRef, useState} from "react"
import {TbShoppingCartPlus, TbTableExport} from "react-icons/tb"

interface ExportToCsvProps {
  variant?: "button" | "menuitem"
}
export default function ExportToCsv({variant = "button"}: ExportToCsvProps) {
  const [loading, setLoading] = useState(false)
  const [isExportCSVDialogOpen, setExportCSVDialogOpen] = useState(false)
  const cancelRef = useRef()
  function requestExportCSV() {
    console.log("Demo Feature >> Not implemented!")
    setExportCSVDialogOpen(false)
  }

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {variant === "menuitem" ? (
        <MenuItem justifyContent="space-between" onClick={() => setExportCSVDialogOpen(true)}>
          Export to CSV <TbTableExport />
        </MenuItem>
      ) : (
        <Button variant="outline" onClick={() => setExportCSVDialogOpen(true)}>
          Export to CSV
        </Button>
      )}
      <AlertDialog
        isOpen={isExportCSVDialogOpen}
        onClose={() => setExportCSVDialogOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Export items to CSV
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text display="inline">
                Export the selected items to a CSV, once the export button is clicked behind the scenes a job will be
                kicked off to create the csv and then will automatically download to your downloads folder in the
                browser.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack justifyContent="space-between" w="100%">
                <Button
                  ref={cancelRef}
                  onClick={() => setExportCSVDialogOpen(false)}
                  disabled={loading}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button variant="solid" colorScheme="primary" onClick={() => requestExportCSV()} disabled={loading}>
                  {loading ? <Spinner color="accent.500" /> : "Export items to CSV"}
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
