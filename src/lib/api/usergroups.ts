import {UserGroups} from "ordercloud-javascript-sdk"

export const userGroupsService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getUserGroupsCountByBuyerID
}

async function list(buyerID, filters?) {
  console.log("userGroupsService::List")
  return await UserGroups.List(buyerID, filters)
}

async function getById(buyerID, userGroupID) {
  console.log("userGroupsService::getById")
  return await UserGroups.Get(buyerID, userGroupID)
}

async function create(buyerID, userGroup) {
  console.log("userGroups::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  userGroup.ID = userGroup.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return await UserGroups.Create(buyerID, userGroup)
}

async function update(buyerID, userGroupID, userGroup) {
  console.log("buyersService::update")
  return await UserGroups.Patch(buyerID, userGroupID, userGroup)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID, userGroupID) {
  console.log("buyersService::_delete")
  if (buyerID) {
    return await UserGroups.Delete(buyerID, userGroupID)
  }
}

async function getUserGroupsCountByBuyerID(buyerID) {
  console.log("buyersService::getUserGroupsCountByBuyerID")
  if (buyerID) {
    const userGroupsList = await UserGroups.List(buyerID)
    return userGroupsList?.Meta?.TotalCount
  } else return 0
}
