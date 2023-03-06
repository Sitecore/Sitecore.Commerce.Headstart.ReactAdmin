import {Catalogs, Suppliers, UserGroups, Users} from "ordercloud-javascript-sdk"

export const suppliersService = {
  list,
  getById,
  create,
  update,
  delete: _delete
}

async function list(filters?) {
  console.log("suppliersService::List")
  return await Suppliers.List(filters)
}

async function getById(supplierID) {
  console.log("suppliersService::getById")
  return await Suppliers.Get(supplierID)
}

async function create(supplier) {
  console.log("suppliersService::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created supplier.
  //Customizing the ID generation business logic here for Demo purpose.
  supplier.ID = supplier.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await Suppliers.Create(supplier)
}

async function update(supplier) {
  console.log("suppliersService::update")
  return await Suppliers.Patch(supplier.ID, supplier)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(supplierID) {
  console.log("suppliersService::_delete")
  if (supplierID) {
    return await Suppliers.Delete(supplierID)
  }
}
