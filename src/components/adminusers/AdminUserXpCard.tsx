import {useEffect, useState} from "react"
import {AdminUsers, User} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import XpCard from "../card/XpCard"
import {IAdminUser, IAdminUserXp} from "types/ordercloud/IAdminUser"

type AdminUserDataProps = {
  user: User & {xp?: unknown}
}

export default function AdminUserXpCard({user}: AdminUserDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formValues, setFormValues] = useState<IAdminUserXp>(Object.assign({}, user?.xp))
  const [xpsToBeDeleted, setXpsToBeDeleted] = useState<string[]>([])
  let router = useRouter()

  useEffect(() => {
    setFormValues(Object.assign({}, user?.xp))
  }, [user?.xp])

  const onUserSave = async () => {
    setIsLoading(true)
    if (isDeleting) {
      var newUser: IAdminUser = user
      delete newUser.xp
      var tempXPs = Object.assign({}, formValues)
      xpsToBeDeleted.forEach((e) => delete tempXPs[e])
      newUser["xp"] = tempXPs
      await AdminUsers.Save<IAdminUser>(user?.ID, newUser)
      setIsDeleting(false)
      setXpsToBeDeleted([])
    } else {
      const newUser: IAdminUser = {
        ...user,
        xp: formValues
      }
      await AdminUsers.Patch<IAdminUser>(user?.ID, newUser)
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
