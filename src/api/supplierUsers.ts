import {SupplierUsers} from "ordercloud-javascript-sdk"

export const supplierUsersService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getSuppliersUsersCount
}

async function list(supplierID, filters?) {
  console.log("usersService::List")
  return await SupplierUsers.List(supplierID, filters)
}

async function getById(supplierID, userID) {
  console.log("usersService::getById")
  return await SupplierUsers.Get(supplierID, userID)
}

async function create(supplierID, user) {
  console.log("users::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created supplier.
  //Customizing the ID generation business logic here for Demo purpose.
  user.ID = user.SupplierUsername
  return await SupplierUsers.Create(supplierID, user)
}

async function update(supplierID, userID, user) {
  console.log("SupplierUsersService::update")
  return await SupplierUsers.Patch(supplierID, userID, user)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(supplierID, userID) {
  console.log("SupplierUsersService::_delete")
  if (supplierID) {
    return await SupplierUsers.Delete(supplierID, userID)
  }
}
async function getSuppliersUsersCount(supplierID) {
  console.log("suppliersService::getSupplierUsersCount")
  if (supplierID) {
    const usersList = await SupplierUsers.List(supplierID)
    return usersList?.Meta?.TotalCount
  } else return 0
}
