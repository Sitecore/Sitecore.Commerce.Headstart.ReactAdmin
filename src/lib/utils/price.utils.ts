import {PriceBreak, SpecOption} from "ordercloud-javascript-sdk"

import {minBy as _minBy} from "lodash"

export const priceHelper = {
  formatShortPrice,
  formatPrice,
  formatPercentChange,
  calcPrice
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  }).format(amount)
}

function formatShortPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  })
    .format(amount)
    .replace(/\D00(?=\D*$)/, "")
}

function formatPercentChange(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "symbol"
  }).format(amount)
}

//<Text as="span" color="green.400" fontWeight="bold">
//+5.2%
//</Text>

function calcPrice(priceBreaks: PriceBreak[], selectedSpecOptions: SpecOption[], quantity: number): number {
  if (!priceBreaks?.length) return
  const startingBreak = _minBy(priceBreaks, "Quantity")
  const selectedBreak = priceBreaks.reduce((current, candidate) => {
    return candidate.Quantity > current.Quantity && candidate.Quantity <= quantity ? candidate : current
  }, startingBreak)

  return selectedSpecOptions
    ? getSpecMarkup(selectedSpecOptions, selectedBreak, quantity || startingBreak.Quantity)
    : selectedBreak.Price * (quantity || startingBreak.Quantity)
}

function getSpecMarkup(selectedSpecOptions: SpecOption[], selectedBreak: PriceBreak, qty: number): number {
  const markups: Array<number> = new Array<number>()

  selectedSpecOptions.forEach((specOption) => markups.push(singleSpecMarkup(selectedBreak.Price, qty, specOption)))
  return (selectedBreak.Price + markups.reduce((x, acc) => x + acc, 0)) * qty
}

function singleSpecMarkup(unitPrice: number, quantity: number, option: SpecOption): number {
  if (option) {
    switch (option.PriceMarkupType) {
      case "NoMarkup":
        return 0
      case "AmountPerQuantity":
        return option.PriceMarkup
      case "AmountTotal":
        return option.PriceMarkup / quantity
      case "Percentage":
        return option.PriceMarkup * unitPrice * 0.01
    }
  }
}
