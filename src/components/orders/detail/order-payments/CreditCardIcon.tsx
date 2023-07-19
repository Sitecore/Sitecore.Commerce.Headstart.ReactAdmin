import {VisaIcon, MastercardIcon, AmericanExpressIcon, DiscoverIcon, CreditIcon} from "@/components/icons/Icons"
import {IconProps} from "@chakra-ui/react"

interface CreditCardIconProps extends IconProps {
  cardType: string
}
export function CreditCardIcon({cardType, ...iconProps}: CreditCardIconProps) {
  const caseInsensitiveCardType = cardType?.toLowerCase()
  const cardTypeMap = {
    visa: <VisaIcon {...iconProps} />,
    mastercard: <MastercardIcon {...iconProps} />,
    americanexpress: <AmericanExpressIcon {...iconProps} />,
    discover: <DiscoverIcon {...iconProps} />
  }
  return cardTypeMap[caseInsensitiveCardType] || <CreditIcon {...iconProps} />
}
