import BuyerList from "@/components/buyers/list/BuyerList"
import ProtectedContent from "components/auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"

const ProtectedBuyersList = () => {
  return (
    <ProtectedContent hasAccess={[appPermissions.BuyerViewer, appPermissions.BuyerManager]}>
      <BuyerList />
    </ProtectedContent>
  )
}

export default ProtectedBuyersList
