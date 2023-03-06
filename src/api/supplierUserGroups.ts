import {SupplierUserGroups} from "ordercloud-javascript-sdk"

export const supplierUserGroupsService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getSuppliersUserGroupsCount
}

async function list(supplierID, filters?) {
  console.log("userGroupsService::List")
  return await SupplierUserGroups.List(supplierID, filters)
}

async function getById(supplierID, userGroupID) {
  console.log("userGroupsService::getById")
  return await SupplierUserGroups.Get(supplierID, userGroupID)
}

async function create(supplierID, userGroup) {
  console.log("userGroups::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created supplier.
  //Customizing the ID generation business logic here for Demo purpose.
  userGroup.ID = userGroup.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await SupplierUserGroups.Create(supplierID, userGroup)
}

async function update(supplierID, userGroupID, userGroup) {
  console.log("suppliersService::update")
  return await SupplierUserGroups.Patch(supplierID, userGroupID, userGroup)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(supplierID, userGroupID) {
  console.log("suppliersService::_delete")
  if (supplierID) {
    return await SupplierUserGroups.Delete(supplierID, userGroupID)
  }
}

async function getSuppliersUserGroupsCount(supplierID) {
  console.log("suppliersService::getSupplierUserGroupsCountBySupplierID")
  if (supplierID) {
    const userGroupsList = await SupplierUserGroups.List(supplierID)
    return userGroupsList?.Meta?.TotalCount
  } else return 0
}
