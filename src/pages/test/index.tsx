import {NextSeo} from "next-seo"
import ProductList from "../../components/shared/ListView/ProductList"

export async function getServerSideProps() {
  return {
    props: {
      header: {
        title: `Products List`,
        metas: {
          hasBreadcrumbs: true,
          hasBuyerContextSwitch: false
        }
      }
    }
  }
}

const TestPage = () => {
  return (
    <>
      <NextSeo title="Products List" />
      <ProductList />
    </>
  )
}

export default TestPage
