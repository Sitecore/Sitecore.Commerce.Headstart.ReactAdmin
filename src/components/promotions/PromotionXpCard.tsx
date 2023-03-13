import {useEffect, useState} from "react"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import XpCard from "../card/XpCard"
import {IPromotion, IPromotionXp} from "types/ordercloud/IPromotion"

type PromotionDataProps = {
  promotion: Promotion & {xp?: unknown}
}

export default function PromotionXpCard({promotion}: PromotionDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<IPromotionXp>(Object.assign({}, promotion?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])
  let router = useRouter()

  useEffect(() => {
    setFormValues(Object.assign({}, promotion?.xp))
  }, [promotion?.xp])

  const onPromotionSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newPromotion: IPromotion = promotion
      delete newPromotion.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newPromotion["xp"] = tempXPs
      await Promotions.Save<IPromotion>(promotion?.ID, newPromotion)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newPromotion: IPromotion = {
        ...promotion,
        xp: formValues
      }
      await Promotions.Patch<IPromotion>(promotion?.ID, newPromotion)
    }

    setIsEditingBasicData(false)
    setIsLoading(false)
    router.back()
  }

  return (
    <>
      <XpCard
        data={promotion}
        formValues={formValues}
        setFormValues={setFormValues}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditingBasicData={isEditingBasicData}
        setIsEditingBasicData={setIsEditingBasicData}
        setIsDeleting={setIsDeleting}
        xpsToBeDeleted={xpsToBeDeleted}
        setXpsToBeDeleted={setXpsToBeDeleted}
        onSave={onPromotionSave}
      />
    </>
  )
}
