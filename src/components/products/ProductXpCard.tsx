import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {Products} from "ordercloud-javascript-sdk"
import {useEffect, useState} from "react"
import {IProduct, IProductXp} from "types/ordercloud/IProduct"
import XpCard from "../card/XpCard"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductXpCard({composedProduct, setComposedProduct}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<IProductXp>(Object.assign({}, composedProduct?.Product?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])

  useEffect(() => {
    setFormValues(Object.assign({}, composedProduct?.Product?.xp))
  }, [composedProduct?.Product?.xp])

  const onProductSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newProduct: IProduct = composedProduct.Product
      delete newProduct.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newProduct["xp"] = tempXPs
      await Products.Save<IProduct>(composedProduct?.Product?.ID, newProduct)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newProduct: IProduct = {
        Name: composedProduct?.Product?.Name,
        xp: formValues
      }
      await Products.Patch<IProduct>(composedProduct?.Product?.ID, newProduct)
    }

    // Hack to ensure Data are loaded before showing -> AWAIT is not enough
    setTimeout(async () => {
      var product = await GetComposedProduct(composedProduct?.Product?.ID)
      setComposedProduct(product)
      setTimeout(() => {
        setIsEditingBasicData(false)
        setIsLoading(false)
      }, 1000)
    }, 4500)
  }

  return (
    <>
      <XpCard
        data={composedProduct?.Product}
        formValues={formValues}
        setFormValues={setFormValues}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditingBasicData={isEditingBasicData}
        setIsEditingBasicData={setIsEditingBasicData}
        setIsDeleting={setIsDeleting}
        xpsToBeDeleted={xpsToBeDeleted}
        setXpsToBeDeleted={setXpsToBeDeleted}
        onSave={onProductSave}
      />
    </>
  )
}
