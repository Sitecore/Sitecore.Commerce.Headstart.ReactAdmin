import {Promotions} from "ordercloud-javascript-sdk"

export const promotionsService = {
  list,
  getById,
  create,
  update,
  delete: _delete,
  buildEligibleExpression,
  buildValueExpression
}

async function list(filters?) {
  console.log("promotionsService::getAll")
  return await Promotions.List(filters)
}

async function getById(id) {
  console.log("promotionsService::getById")
  console.log(id)
  return await Promotions.Get(id)
}

async function create(fields) {
  console.log("promotionsService::create")
  //Demo sample : By default OrderCloud will assign a unique ID to the newly created order.
  //Customizing the ID generation business logic here for Demo purpose.
  fields.ID = fields.Name.toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
  console.log(fields)
  Promotions.Create(fields)
}

async function update(fields) {
  //console.log("promotionsService::update")
  //console.log(fields)
  Promotions.Patch(fields.ID, fields)
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(id) {
  //console.log("promotionsService::_delete")
  if (id) {
    return await Promotions.Delete(id)
  }
}

// Expressions Structure
// Propreties
//items.any() (true if any item on the order matches filter)
//items.all() (true if all items match filter)
//items.quantity()(returns sum of line item quantities matching your specified condition)
//items.count()(returns number of line items on the order matching your specified condition)
//items.total() (compare result to a dollar amount)

// Simplistic Example to close the loop - then we will use the dnd Expression UI Builder and match to this
async function buildEligibleExpression(fields) {
  console.log("buildEligibleExpression")
  let eligibleExpression = "" //Default value when no condition has been specified.
  // Minimum Requirements has been selected
  switch (fields.xp_MinimumReq) {
    case "min-amount": {
      eligibleExpression = `order.Subtotal>= ${fields.xp_MinReqValue}`
      break
    }
    case "min-qty": {
      eligibleExpression = `items.quantity()>= ${fields.xp_MinReqValue}`
      break
    }
    default: {
      eligibleExpression = "true"
      break
    }
  }

  return eligibleExpression
}

// Simplistic Example to close the loop - then we will use the dnd Expression UI Builder and match to this
async function buildValueExpression(fields) {
  let valueExpression = "0" //Default value when no condition has been specified.
  switch (fields.xp_Type) {
    case "Percentage": {
      valueExpression = `order.Subtotal * ${fields.xp_Value / 100})`
      break
    }
    case "Fixed": {
      valueExpression = `${fields.xp_Value}`
      break
    }
    case "Free-shipping": {
      valueExpression = `order.ShippingCost`
    }

    default: {
      valueExpression = "0"
      break
    }
  }
  return valueExpression
}
