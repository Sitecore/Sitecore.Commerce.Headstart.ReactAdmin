import {Products} from "ordercloud-javascript-sdk"

export const productsService = {
  list,
  getById,
  create,
  update,
  delete: _delete
}

async function list() {
  //console.log("productsService::getAll")
  return await Products.List()
}

async function getById(id) {
  //console.log("productsService::getById")
  return await Products.Get(id)
}

async function create(fields) {
  //console.log("productsService::create")
  //console.log(fields)
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created product.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  //Products.Create(fields)
}

async function update(fields) {
  //console.log("productsService::update")
  //console.log(fields)
  //Products.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  //console.log("productsService::_delete")
  if (id) {
    return await Products.Delete(id)
  }
}
