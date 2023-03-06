import {PriceSchedule} from "ordercloud-javascript-sdk"
import {ChangeEvent, FunctionComponent} from "react"
import {Input} from "@chakra-ui/react"
interface QuantityInputProps {
  controlId: string
  priceSchedule: PriceSchedule
  label?: string
  disabled?: boolean
  quantity: number
  onChange: (quantity: number) => void
}

const QuantityInput: FunctionComponent<QuantityInputProps> = ({
  controlId,
  priceSchedule,
  label = "Quantity",
  disabled,
  quantity,
  onChange
}) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value))
  }

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value))
  }

  return (
    <label htmlFor={controlId}>
      {/* {label} */}
      {priceSchedule.RestrictedQuantity ? (
        // eslint-disable-next-line
        <select id={controlId} disabled={disabled} value={quantity} onChange={handleSelectChange}>
          {priceSchedule.PriceBreaks.map((pb) => (
            <option key={pb.Quantity} value={pb.Quantity}>
              {pb.Quantity}
            </option>
          ))}
        </select>
      ) : (
        <Input
          id={controlId}
          disabled={disabled}
          type="number"
          min={priceSchedule.MinQuantity}
          max={priceSchedule.MaxQuantity}
          step={1}
          value={quantity}
          onChange={handleInputChange}
        />
      )}
    </label>
  )
}

export default QuantityInput
