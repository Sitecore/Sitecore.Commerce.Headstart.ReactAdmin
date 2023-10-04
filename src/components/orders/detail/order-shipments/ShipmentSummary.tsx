import {
  Card,
  CardBody,
  ButtonGroup,
  IconButton,
  SimpleGrid,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionProps,
  AccordionButton,
  AccordionIcon,
  useMediaQuery
} from "@chakra-ui/react"
import {IShipment} from "types/ordercloud/IShipment"
import {ShipmentItemTableSummary} from "./ShipmentItemTableSummary"
import {ILineItem} from "types/ordercloud/ILineItem"
import {dateHelper} from "utils"
import {PropsWithChildren} from "react"
import theme from "theme/theme"
import {HeaderItem} from "@/components/shared/HeaderItem"

interface ShipmentSummaryProps extends PropsWithChildren, AccordionProps {
  shipment: IShipment
  lineItems: ILineItem[]
}
export function ShipmentSummary({lineItems, shipment, children, ...containerProps}: ShipmentSummaryProps) {
  const isInModal = !Boolean(children)
  const [isMobile] = useMediaQuery(`(max-width: ${theme.breakpoints["md"]})`, {
    ssr: true,
    fallback: false // return false on the server, and re-evaluate on the client side
  })

  return (
    <Accordion allowToggle={!isInModal} defaultIndex={isInModal ? [0] : []} {...containerProps}>
      <AccordionItem border="none">
        <Card
          backgroundColor="st.mainBackgroundColor"
          shadow="none"
          borderWidth={".5px"}
          borderColor="chakra-border-subtle"
        >
          <CardBody>
            <SimpleGrid
              w="full"
              gridTemplateColumns={isInModal && !isMobile ? "1fr 1fr" : "repeat(auto-fit, minmax(150px, 1fr))"}
              gap={4}
            >
              <HeaderItem
                direction={isInModal || isMobile ? "row" : "column"}
                alignItems={isInModal || isMobile ? "center" : "start"}
                label="Shipping Date"
                value={shipment?.DateShipped ? dateHelper.formatShortDate(shipment.DateShipped) : "N/A"}
              />
              <HeaderItem
                direction={isInModal || isMobile ? "row" : "column"}
                alignItems={isInModal || isMobile ? "center" : "start"}
                label="Tracking Number"
                value={shipment?.TrackingNumber || "N/A"}
              />
              <HeaderItem
                direction={isInModal || isMobile ? "row" : "column"}
                alignItems={isInModal || isMobile ? "center" : "start"}
                label="Carrier"
                value={shipment?.Shipper || "N/A"}
              />
              <HeaderItem
                direction={isInModal || isMobile ? "row" : "column"}
                alignItems={isInModal || isMobile ? "center" : "start"}
                label="Shipping Method"
                value={shipment?.xp?.ShippingMethod || "N/A"}
              />
              <ButtonGroup justifyContent="flex-end" alignItems="center" display={isInModal ? "none" : "flex"}>
                {children}
                <AccordionButton style={{aspectRatio: "1 / 1"}} as={IconButton} w="auto" icon={<AccordionIcon />} />
              </ButtonGroup>
            </SimpleGrid>
            {isInModal && (
              <AccordionPanel padding={0} marginTop={3}>
                <ShipmentItemTableSummary
                  lineItems={lineItems}
                  shipment={shipment}
                  isInModal={isInModal}
                  isMobile={isMobile}
                />
              </AccordionPanel>
            )}
          </CardBody>
        </Card>
        {!isInModal && (
          <AccordionPanel padding={0} marginTop={3}>
            <Card
              backgroundColor="st.mainBackgroundColor"
              shadow="none"
              borderWidth={".5px"}
              borderColor="chakra-border-subtle"
            >
              <CardBody>
                <ShipmentItemTableSummary
                  lineItems={lineItems}
                  shipment={shipment}
                  isInModal={isInModal}
                  isMobile={isMobile}
                />
              </CardBody>
            </Card>
          </AccordionPanel>
        )}
      </AccordionItem>
    </Accordion>
  )
}
