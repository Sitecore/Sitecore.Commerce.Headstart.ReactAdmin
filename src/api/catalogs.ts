import {CatalogAssignment, Catalogs} from "ordercloud-javascript-sdk"

export const catalogsService = {
  list,
  listAssignements,
  getById,
  create,
  update,
  delete: _delete,
  getCatalogsCountByBuyerID,
  getCatalogsbyBuyerID,
  saveAssignment
}

async function list(filters?) {
  console.log("catalogsService::List")
  return await Catalogs.List(filters)
}

async function listAssignements(buyerID) {
  console.log("catalogsService::ListAssignement")
  return await Catalogs.ListAssignments({buyerID: buyerID})
}

async function getById(catalogID) {
  console.log("catalogsService::getById")
  return await Catalogs.Get(catalogID)
}

async function create(catalog) {
  console.log("catalogsService::create")
  return await Catalogs.Create(catalog)
}

async function update(catalog) {
  console.log("catalogsService::update")
  return await Catalogs.Patch(catalog.ID, catalog)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(catalogID) {
  console.log("catalogsService::_delete")
  if (catalogID) {
    return await Catalogs.Delete(catalogID)
  }
}

async function getCatalogsCountByBuyerID(buyerID) {
  console.log("catalogsService::getCatalogsCountByBuyerId")
  if (buyerID) {
    const catalogsList = await Catalogs.ListAssignments({buyerID: buyerID})
    return catalogsList?.Meta?.TotalCount
  } else return 0
}

async function getCatalogsbyBuyerID(buyerID) {
  console.log("catalogsService::getCatalogsbyBuyerId")
  const catalogsAssignments = await Catalogs.ListAssignments({buyerID: buyerID})
  let catalogAssignmentsIds = catalogsAssignments.Items.map((item) => item.CatalogID)
  const catalogsList = await Catalogs.List({
    filters: {ID: catalogAssignmentsIds.join("|")}
  })
  return catalogsList
}

async function saveAssignment(buyerID, catalogID) {
  console.log("catalogsService::createCatalogAssignment")
  let catalogAssignement: CatalogAssignment
  catalogAssignement = {
    CatalogID: catalogID,
    BuyerID: buyerID,
    ViewAllCategories: true, // Default Value for Demo purpose
    ViewAllProducts: true // Default Value for Demo purpose
  }
  return await Catalogs.SaveAssignment(catalogAssignement)
}
