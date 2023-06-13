import {useEffect, useState} from "react"
import {Categories, Category} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import XpCard from "../card/XpCard"
import {ICategory, ICategoryXp} from "types/ordercloud/ICategoryXp"

type CategoryDataProps = {
  catalogID: string
  category: Category & {xp?: unknown}
}

export default function CategoryXpCard({catalogID, category}: CategoryDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<ICategoryXp>(Object.assign({}, category?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])
  let router = useRouter()

  useEffect(() => {
    setFormValues(Object.assign({}, category?.xp))
  }, [category?.xp])

  const onCategorySave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newCategory: ICategory = category
      delete newCategory.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newCategory["xp"] = tempXPs
      await Categories.Save<ICategory>(catalogID, category?.ID, newCategory)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newCategory: ICategory = {
        ...category,
        xp: formValues
      }
      await Categories.Patch<ICategory>(catalogID, category?.ID, newCategory)
    }

    setIsEditingBasicData(false)
    setIsLoading(false)
    router.back()
  }

  return (
    <>
      <XpCard
        data={category}
        formValues={formValues}
        setFormValues={setFormValues}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditingBasicData={isEditingBasicData}
        setIsEditingBasicData={setIsEditingBasicData}
        setIsDeleting={setIsDeleting}
        xpsToBeDeleted={xpsToBeDeleted}
        setXpsToBeDeleted={setXpsToBeDeleted}
        onSave={onCategorySave}
      />
    </>
  )
}
