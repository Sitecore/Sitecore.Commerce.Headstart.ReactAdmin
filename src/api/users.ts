import {Users} from "ordercloud-javascript-sdk"

export const usersService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  getUsersCountByBuyerID
}

async function list(buyerID, filters?) {
  console.log("usersService::List")
  return await Users.List(buyerID, filters)
}

async function getById(buyerID, userID) {
  console.log("usersService::getById")
  return await Users.Get(buyerID, userID)
}

async function create(buyerID, user) {
  console.log("users::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the new created buyer.
  //Customizing the ID generation business logic here for Demo purpose.
  user.ID = user.Username
  return await Users.Create(buyerID, user)
}

async function update(buyerID, userID, user) {
  console.log("UsersService::update")
  return await Users.Patch(buyerID, userID, user)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(buyerID, userID) {
  console.log("UsersService::_delete")
  if (buyerID) {
    return await Users.Delete(buyerID, userID)
  }
}
async function getUsersCountByBuyerID(buyerID) {
  console.log("buyersService::getUsersCountByBuyerID")
  if (buyerID) {
    const usersList = await Users.List(buyerID)
    return usersList?.Meta?.TotalCount
  } else return 0
}
