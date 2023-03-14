import {useEffect, useState} from "react"
import {Users} from "ordercloud-javascript-sdk"
import {ISupplierUser, ISupplierUserXp} from "types/ordercloud/ISupplierUser"
import {IBuyerUser, IBuyerUserXp} from "types/ordercloud/IBuyerUser"
import {useRouter} from "hooks/useRouter"
import XpCard from "../card/XpCard"

type UserDataProps = {
  organizationID: string
  user: (IBuyerUser | ISupplierUser) & {xp?: unknown}
}

export default function UserXpCard({organizationID, user}: UserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<ISupplierUserXp | IBuyerUserXp>(Object.assign({}, user?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])
  let router = useRouter()

  useEffect(() => {
    setFormValues(Object.assign({}, user?.xp))
  }, [user?.xp])

  const onUserSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newUser: IBuyerUser | ISupplierUser = user
      delete newUser.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newUser["xp"] = tempXPs
      await Users.Save<IBuyerUser | ISupplierUser>(organizationID, user?.ID, newUser)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newUser: IBuyerUser | ISupplierUser = {
        ...user,
        xp: formValues
      }
      await Users.Patch<IBuyerUser | ISupplierUser>(organizationID, user?.ID, newUser)
    }

    setIsEditingBasicData(false)
    setIsLoading(false)
    router.back()
  }

  return (
    <>
      <XpCard
        data={user}
        formValues={formValues}
        setFormValues={setFormValues}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        isEditingBasicData={isEditingBasicData}
        setIsEditingBasicData={setIsEditingBasicData}
        setIsDeleting={setIsDeleting}
        xpsToBeDeleted={xpsToBeDeleted}
        setXpsToBeDeleted={setXpsToBeDeleted}
        onSave={onUserSave}
      />
    </>
  )
}
