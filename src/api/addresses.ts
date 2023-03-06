import {Addresses} from "ordercloud-javascript-sdk"

export const addressesService = {
  list,
  getById,
  create,
  update,
  delete: _delete
}

async function list(buyerID) {
  console.log("userGroupsService::List")
  return await Addresses.List(buyerID)
}

async function getById(buyerID, addressID) {
  console.log("userGroupsService::getById")
  return await Addresses.Get(buyerID, addressID)
}

async function create(buyerID, address) {
  console.log("userGroups::create")
  return await Addresses.Create(buyerID, address)
}

async function update(buyerID, addressID, address) {
  console.log("buyersService::update")
  return await Addresses.Patch(buyerID, addressID, address)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID, addressID) {
  console.log("buyersService::_delete")
  if (buyerID) {
    return await Addresses.Delete(buyerID, addressID)
  }
}
