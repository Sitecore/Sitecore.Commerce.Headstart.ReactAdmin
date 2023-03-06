import {compact} from "lodash"
import {Address} from "ordercloud-javascript-sdk"

export const addressHelper = {
  formatOneLineAddress
}

function formatOneLineAddress(address: Address): string {
  let addressParts = compact([`${address.Street1} ${address.Street2}`, address.City, address.State, address.Zip])
  return addressParts.join(", ")
}
