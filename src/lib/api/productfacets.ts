import {ProductFacets} from "ordercloud-javascript-sdk"

export const productfacetsService = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
}

async function getAll(filters?) {
  //console.log("productfacetsService::getAll")
  return await ProductFacets.List(filters)
}

async function getById(id) {
  //console.log("productfacetsService::getById")
  return await ProductFacets.Get(id)
}

async function create(fields) {
  //console.log("productfacetsService::create")
  //console.log(fields)
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created facet.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  //Assign the XP PAth to the facet and field name
  fields.XpPath = "Facets." + fields.ID
  ProductFacets.Create(fields)
}

async function update(fields) {
  //console.log("productfacetsService::update")
  //console.log(fields)
  ProductFacets.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  //console.log("productfacetsService::_delete")
  if (id) {
    return await ProductFacets.Delete(id)
  }
}
