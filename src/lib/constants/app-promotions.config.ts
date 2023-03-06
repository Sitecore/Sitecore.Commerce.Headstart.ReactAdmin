import {Promotions} from "ordercloud-javascript-sdk"

export const appPromotions = [
  {
    Name: "$10 off any order greater than $50",
    EligibleExpression: '"order.Subtotal > 50"',
    ValueExpression: '"10"'
  },
  {
    Name: "Free Shipping when you spend $60",
    EligibleExpression: '"order.Subtotal >= 60"',
    ValueExpression: '"order.ShippingCost"'
  },
  {
    Name: "BOGO (limited to 1 free item)",
    EligibleExpression: " \"items.quantity(ProductID = 'ABC') > 1\"",
    ValueExpression: " \"items.total(ProductID = 'ABC') / items.quantity(ProductID = 'ABC')\""
  },
  {
    Name: "$5 off the order total when any line item has a given product ID",
    EligibleExpression: " \"items.any(ProductID = '123')\"",
    ValueExpression: ' "5"'
  },
  {
    Name: "15% off all line items with a product assigned to a given CategoryID",
    EligibleExpression: " \"item.product.incategory('Bikes')\"",
    ValueExpression: '"item.LineSubtotal * .15"'
  },
  {
    Name: "10% off when all products are on sale with a maximum promotion discount of $20 (utilizing product xp)",
    EligibleExpression: ' "items.all(Product.xp.OnSale = true)"',
    ValueExpression: ' "min(order.Subtotal * .1, 20)"'
  },
  {
    Name: "30% off when you buy 10 or more products assigned to a given CategoryID",
    EligibleExpression: " \"items.quantity(product.incategory('GuitarAccessories')) >= 10\"",
    ValueExpression: " \"items.total(product.incategory('GuitarAccessories')) * .3\""
  },
  {
    Name: "20% off when you buy these 2 products together (no quantity limit)",
    EligibleExpression: " \"items.any(ProductID = 'ABC') and items.any(ProductID = 'XYZ')\"",
    ValueExpression: " \"(items.total(ProductID = 'ABC') + items.total(ProductID = 'XYZ')) * .2\""
  },
  {
    Name: "10% off your entire order when you spend more than $200 in these categories",
    EligibleExpression:
      " \"items.total(product.incategory('Kitchen')) + items.total(product.incategory('Bedding')) + items.total(product.incategory('Bathroom')) > 200\"",
    ValueExpression: ' "order.Subtotal * .1"'
  },
  {
    Name: "$50 off line items from a given supplier when you spend more than $100 on that supplier's products",
    EligibleExpression: " \"item.SupplierID = '123' and items.total(SupplierID = '123') >= 100\"",
    ValueExpression: " \"50 / items.count(SupplierID = '123')\""
  },
  {
    Name: "25% off a user's first order (utilizing user xp)",
    EligibleExpression: ' "order.FromUser.xp.FirstOrder = true"',
    ValueExpression: ' "order.Subtotal * .25"'
  },
  {
    Name: "BOGO (scales with quantity)",
    EligibleExpression: " \"items.quantity(ProductID = 'XYZ') > 1\"",
    ValueExpression:
      " \"((items.quantity(ProductID='XYZ')/2) - (items.quantity(ProductID='XYZ') % 2 * .5)) * items.total (ProductID='XYZ') / items.quantity(ProductID='XYZ')\""
  }
]
