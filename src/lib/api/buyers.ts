import {Buyers, Catalogs, UserGroups, Users} from "ordercloud-javascript-sdk"

export const buyersService = {
  list,
  getById,
  create,
  update,
  delete: _delete
}

async function list(filters?: any) {
  console.log("buyersService::List")
  return await Buyers.List(filters)
}

async function getById(buyerID) {
  console.log("buyersService::getById")
  return await Buyers.Get(buyerID)
}

async function create(buyer) {
  console.log("buyersService::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  buyer.ID = buyer.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await Buyers.Create(buyer)
}

async function update(buyer) {
  console.log("buyersService::update")
  return await Buyers.Patch(buyer.ID, buyer)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID) {
  console.log("buyersService::_delete")
  if (buyerID) {
    return await Buyers.Delete(buyerID)
  }
}
