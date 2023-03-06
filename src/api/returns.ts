import {OrderReturn, OrderReturns, Payment, Payments} from "ordercloud-javascript-sdk"

export const returnsService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}

async function getAll() {
  //console.log("returnsService::getAll")
  return await OrderReturns.List()
}

async function getById(id) {
  //console.log("returnsService::getById")
  return await OrderReturns.Get(id)
}

async function create(fields) {
  //console.log("returnsService::create")
  //console.log(fields)
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created order.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  //OrderReturns.Create(fields)
}

async function update(fields) {
  //console.log("returnsService::update")
  //console.log(fields)
  //OrderReturns.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  //console.log("returnsService::_delete")
  if (id) {
    return await OrderReturns.Delete(id)
  }
}
