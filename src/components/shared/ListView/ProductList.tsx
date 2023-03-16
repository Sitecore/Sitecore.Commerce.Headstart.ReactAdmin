import ProductCard from "@/components/products/ProductCard"
import {Container} from "@chakra-ui/react"
import {Products} from "ordercloud-javascript-sdk"
import {IProduct} from "types/ordercloud/IProduct"
import ListView from "./ListView"
import ProductListToolbar from "./ProductListToolbar"

const ProductQueryMap = {
  s: "Search"
}

const ProductList = () => {
  return (
    <ListView<IProduct>
      service={Products.List}
      queryMap={ProductQueryMap}
      gridOptions={{templateColumns: "repeat(4, 1fr)"}}
      renderCard={(p, index, selected, onSelectChange) => (
        <ProductCard product={p} selected={selected} onProductSelected={onSelectChange} />
      )}
    >
      {({children, ...listViewChildProps}) => (
        <Container maxW="container.2xl">
          <ProductListToolbar {...listViewChildProps} />
          {children}
        </Container>
      )}
    </ListView>
  )
}

export default ProductList
