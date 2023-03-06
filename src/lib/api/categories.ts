import {Categories, CategoryAssignment} from "ordercloud-javascript-sdk"

export const categoriesService = {
  list,
  listAssignements,
  getById,
  create,
  update,
  delete: _delete,
  getCategoriesCountByCatalogID,
  saveAssignment
}

async function list(catalogID) {
  console.log("categoriesService::List")
  return await Categories.List(catalogID, {depth: "all", pageSize: 100})
}

async function listAssignements(catalogID) {
  console.log("categoriesService::ListAssignement")
  return await Categories.ListAssignments(catalogID)
}

async function getById(catalogID, categoryID) {
  console.log("categoriesService::getById")
  console.log(categoryID)
  return await Categories.Get(catalogID, categoryID)
}

async function create(catalogID, category) {
  console.log("categoriesService::create")
  return await Categories.Create(catalogID, category)
}

async function update(catalogID, category) {
  console.log("categoriesService::update")
  return await Categories.Patch(catalogID, category.ID, category)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(catalogID, categoryID) {
  console.log("categoriesService::_delete")
  if (catalogID) {
    return await Categories.Delete(catalogID, categoryID)
  }
}

async function getCategoriesCountByCatalogID(catalogID) {
  console.log("categoriesService::getCatalogsCountByBuyerId")
  if (catalogID) {
    const categoriesList = await Categories.List(catalogID)
    return categoriesList?.Meta?.TotalCount
  } else return 0
}

// async function getCategoriesbyCatalogID(buyerID) {
//   console.log("catalogsService::getCatalogsbyBuyerId")
//   const catalogsAssignments = await Categories.ListAssignments({
//     buyerID: buyerID
//   })
//   let catalogAssignmentsIds = catalogsAssignments.Items.map(
//     (item) => item.CatalogID
//   )
//   console.log(catalogAssignmentsIds)
//   const catalogsList = await Categories.List({
//     filters: {ID: catalogAssignmentsIds.join("|")}
//   })
//   console.log(catalogsList)
//   return catalogsList
// }

async function saveAssignment(catalogID, categoryID, buyerID, userGroupID) {
  console.log("categoriesService::createCatalogAssignment")
  let categoryAssignement: CategoryAssignment
  categoryAssignement = {
    CategoryID: categoryID,
    BuyerID: buyerID,
    UserGroupID: userGroupID,
    Visible: true, // Default Value for Demo purpose
    ViewAllProducts: true // Default Value for Demo purpose
  }

  return await Categories.SaveAssignment(catalogID, categoryAssignement)
}
