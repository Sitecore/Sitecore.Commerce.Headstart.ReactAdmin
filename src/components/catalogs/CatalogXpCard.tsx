import {useEffect, useState} from "react"
import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import XpCard from "../card/XpCard"
import {IAdminUserXp} from "types/ordercloud/IAdminUser"
import {ICatalog} from "types/ordercloud/ICatalog"

type CatalogDataProps = {
  catalog: Catalog & {xp?: unknown}
}

export default function CatalogXpCard({catalog}: CatalogDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<IAdminUserXp>(Object.assign({}, catalog?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])
  let router = useRouter()

  useEffect(() => {
    setFormValues(Object.assign({}, catalog?.xp))
  }, [catalog?.xp])

  const onCatalogSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newCatalog: ICatalog = catalog
      delete newCatalog.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newCatalog["xp"] = tempXPs
      await Catalogs.Save<ICatalog>(catalog?.ID, newCatalog)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newCatalog: ICatalog = {
        ...catalog,
        xp: formValues
      }
      await Catalogs.Patch<ICatalog>(catalog?.ID, newCatalog)
    }

    setIsEditingBasicData(false)
    setIsLoading(false)
    router.back()
  }

  return (
    <>
      <XpCard
        data={catalog}
        formValues={formValues}
        setFormValues={setFormValues}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditingBasicData={isEditingBasicData}
        setIsEditingBasicData={setIsEditingBasicData}
        setIsDeleting={setIsDeleting}
        xpsToBeDeleted={xpsToBeDeleted}
        setXpsToBeDeleted={setXpsToBeDeleted}
        onSave={onCatalogSave}
      />
    </>
  )
}
