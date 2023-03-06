import {IntegrationEvents, OrderWorksheet, Orders} from "ordercloud-javascript-sdk"

export const ordersService = {
  list,
  getById,
  create,
  update
  //delete: _delete
}

async function list() {
  //console.log("ordersService::getAll")
  return await Orders.List("All")
}

async function getById(id) {
  //console.log("ordersService::getById")
  const worksheet = await IntegrationEvents.GetWorksheet("All", id)
  return await worksheet
}

async function create(fields) {
  //console.log("ordersService::create")
  //console.log(fields)
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created order.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  //Orders.Create(fields)
}

async function update(fields) {
  //console.log("ordersService::update")
  //console.log(fields)
  //Orders.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
// async function _delete(id) {
//   //console.log("ordersService::_delete")
//   if (id) {
//     return await Orders.Delete(id)
//   }
// }
