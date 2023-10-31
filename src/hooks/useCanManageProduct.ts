import {appPermissions} from "config/app-permissions.config"
import {useMemo} from "react"
import useHasAccess from "./useHasAccess"
import {useAuth} from "./useAuth"
import {IProduct} from "types/ordercloud/IProduct"
import {appSettings} from "config/app-settings"

export const useCanManageProduct = (product?: IProduct): boolean => {
  const isProductManager = useHasAccess(appPermissions.ProductManager)
  const {isAdmin} = useAuth()

  const canManageProduct = useMemo(() => {
    if (isAdmin) {
      return isProductManager
    }
    if (!product?.ID) {
      // Product is being created, doesn't have an owner yet
      return true
    }
    // suppliers can only see products they own and marketplace owned products they have been allowed to sell
    // if the OwnerID isn't the marketplaceID, then we know the product is theirs
    const isProductOwner = product.OwnerID !== appSettings.marketplaceId
    return isProductManager && isProductOwner
  }, [isProductManager, isAdmin, product?.OwnerID, product?.ID])

  return canManageProduct
}
