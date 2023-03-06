import {
  useColorModeValue,
  Heading,
  Box,
  Text,
  Image,
  Button,
  HStack,
  Tooltip,
  Input,
  Collapse,
  Center,
  VStack
} from "@chakra-ui/react"
import {ComposedProduct, GetComposedProduct} from "../../services/ordercloud.service"
import {ProductXPs, XpImage} from "lib/types/ProductXPs"
import {Product, Products} from "ordercloud-javascript-sdk"
import {ChangeEvent, useState} from "react"
import {FiCheck, FiX, FiEdit, FiPlus, FiMinus} from "react-icons/fi"
import BrandedBox from "../branding/BrandedBox"
import BrandedSpinner from "../branding/BrandedSpinner"

type ProductDataProps = {
  composedProduct: ComposedProduct
  setComposedProduct: React.Dispatch<React.SetStateAction<ComposedProduct>>
}

export default function ProductMediaInformation({composedProduct, setComposedProduct}: ProductDataProps) {
  const [isEditingBasicData, setIsEditingBasicData] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const okColor = useColorModeValue("okColor.800", "okColor.200")
  const errorColor = useColorModeValue("errorColor.800", "errorColor.200")
  const [formValues, setFormValues] = useState({
    images: composedProduct?.Product?.xp?.Images
  })
  const [selectedImage, setSelectedImage] = useState(0)
  const [expanded, setExpanded] = useState(true)

  const onEditClicked = (e) => {
    e.preventDefault()
    setFormValues((v) => ({
      ...v,
      ["images"]: composedProduct?.Product?.xp?.Images ?? []
    }))
    setIsEditingBasicData(true)
    setExpanded(true)
  }

  const onAbortClicked = (e) => {
    e.preventDefault()
    setIsEditingBasicData(false)
  }

  const handleInputChange = (fieldKey: number) => (e: ChangeEvent<HTMLInputElement>) => {
    var newVal = e.target.value
    var emptyVal = null
    var tmpImages = [...formValues.images]
    var tmpImage: XpImage = {
      Url: newVal,
      ThumbnailUrl: newVal
    }

    tmpImages[fieldKey] = tmpImage

    setFormValues((v) => ({
      ...v,
      ["images"]: tmpImages
    }))
  }

  const onDeleteProductImageClicked = (url: string) => async (e) => {
    setIsLoading(true)
    var tmpImages = [...formValues.images]
    tmpImages = tmpImages.filter((element) => element.Url != url)
    setFormValues((v) => ({
      ...v,
      ["images"]: tmpImages
    }))

    setIsLoading(false)
  }

  const onNewProductImageClicked = async (e) => {
    setIsLoading(true)
    var tmpImages: XpImage[] = []
    if (formValues.images) {
      tmpImages = [...formValues.images]
    }

    var tmpImage: XpImage = {
      Url: "",
      ThumbnailUrl: ""
    }

    tmpImages.push(tmpImage)
    setFormValues((v) => ({
      ...v,
      ["images"]: tmpImages
    }))

    setIsLoading(false)
  }

  const onProductSave = async () => {
    setIsLoading(true)
    const images: XpImage[] = []
    formValues.images.map((item) => {
      const xpImage: XpImage = {
        Url: item.Url,
        ThumbnailUrl: item.ThumbnailUrl
      }
      images.push(xpImage)
    })
    // For now focus on first image in list
    if (images.length == 0) {
      const xpImage: XpImage = {
        Url: formValues.images[0]?.Url ?? "",
        ThumbnailUrl: formValues.images[0]?.ThumbnailUrl ?? ""
      }
      images.push(xpImage)
    }

    const newProduct: Product<ProductXPs> = {
      Name: composedProduct?.Product?.Name,
      xp: {
        Name: "Test",
        Images: images
      }
    }

    await Products.Patch(composedProduct?.Product?.ID, newProduct)

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
      <Heading size={{base: "sm", md: "md", lg: "md"}}>Media</Heading>

      {(isLoading || !composedProduct?.Product) && expanded ? (
        <Box pt={6} textAlign={"center"}>
          Updating... <BrandedSpinner />
        </Box>
      ) : (
        <>
          <Collapse in={expanded}>
            <Box width="full" pt={4} pl={14} pb="50">
              <>
                <Text>Images:</Text>
                {formValues?.images?.map((image, key) => {
                  return isEditingBasicData ? (
                    <HStack key={key} mt={3}>
                      <Text>{key + 1}</Text>
                      <Input value={image.Url} onChange={handleInputChange(key)} />
                      <Tooltip pt={2} label="Remove Product Image">
                        <Button onClick={onDeleteProductImageClicked(image.Url)} variant="secondaryButton">
                          Delete
                        </Button>
                      </Tooltip>
                    </HStack>
                  ) : (
                    <></>
                  )
                })}{" "}
                {!isEditingBasicData ? (
                  <Image
                    boxSize="200px"
                    objectFit="scale-down"
                    mt={4}
                    alt={"Product Image"}
                    src={composedProduct?.Product?.xp?.Images[selectedImage].Url}
                  />
                ) : (
                  <></>
                )}
                <HStack mt={4}>
                  {composedProduct?.Product?.xp?.Images?.map((image, key) => {
                    return !isEditingBasicData ? (
                      <VStack key={key}>
                        <Text>{key + 1}</Text>

                        {(image?.Url ?? "") == "" ? (
                          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                            <>No Image</>
                          </Heading>
                        ) : (
                          <>
                            <Image
                              boxSize="75px"
                              objectFit="scale-down"
                              mt={4}
                              alt={"Product Image"}
                              src={image?.ThumbnailUrl}
                              border={key == selectedImage ? "1px solid" : ""}
                              onClick={() => {
                                setSelectedImage(key)
                              }}
                            />
                          </>
                        )}
                      </VStack>
                    ) : (
                      <></>
                    )
                  })}
                </HStack>
                {isEditingBasicData && formValues?.images[formValues?.images?.length - 1]?.Url != "" ? (
                  <Tooltip label="Add new Product Image">
                    <Box pt={4}>
                      <Center>
                        <Button onClick={onNewProductImageClicked} variant="secondaryButton">
                          Add Image
                        </Button>
                      </Center>
                    </Box>
                  </Tooltip>
                ) : (
                  <></>
                )}
              </>
            </Box>
          </Collapse>
        </>
      )}
      {isEditingBasicData ? (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Save">
            <Button aria-label="Save" onClick={onProductSave} variant="primaryButton">
              Save
            </Button>
          </Tooltip>
          <Tooltip label="Cancel">
            <Button colorScheme="brandButtons" aria-label="Cancel" variant="secondaryButton" onClick={onAbortClicked}>
              Cancel
            </Button>
          </Tooltip>
        </HStack>
      ) : (
        <HStack float={"right"} position="absolute" bottom="20px">
          <Tooltip label="Edit">
            <Button aria-label="Edit" variant="tertiaryButton" onClick={onEditClicked}>
              Edit
            </Button>
          </Tooltip>
        </HStack>
      )}
    </>
  )
}
