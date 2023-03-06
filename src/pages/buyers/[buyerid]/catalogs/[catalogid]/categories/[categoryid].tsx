import {useEffect, useState} from "react"
import {CreateUpdateForm} from "lib/components/categories/CreateUpdateForm"
import {Box} from "@chakra-ui/react"
import {Category} from "ordercloud-javascript-sdk"
import ProtectedContent from "lib/components/auth/ProtectedContent"
import {appPermissions} from "lib/constants/app-permissions.config"
import {categoriesService} from "lib/api"
import {useRouter} from "next/router"

/* This declare the page title and enable the breadcrumbs in the content header section. */
export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: "Edit category",
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      },
      revalidate: 5 * 60
    }
  }
}

const CategoryListItem = (props) => {
  const router = useRouter()
  const [category, setCategory] = useState({} as Category)
  useEffect(() => {
    const categoryid = props.selectedNode?.id || router.query.categoryid
    if (categoryid)
      categoriesService.getById(router.query.catalogid, categoryid).then((category) => {
        setCategory(category)
      })
  }, [props.selectedNode, router.query.catalogid, router.query.categoryid])
  return <>{category?.ID ? <CreateUpdateForm category={category} /> : <div> Loading</div>}</>
}
const ProtectedCategoryListItem = (props) => {
  return (
    <ProtectedContent hasAccess={appPermissions.BuyerManager}>
      <Box padding="20px">
        <CategoryListItem {...props} />
      </Box>
    </ProtectedContent>
  )
}

export default ProtectedCategoryListItem
