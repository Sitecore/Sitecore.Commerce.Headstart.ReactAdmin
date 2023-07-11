import {HStack, VStack, Heading, Image, Text} from "@chakra-ui/react"
import {useState} from "react"
import {XpImage} from "types/ordercloud/IProduct"

interface ImagePreviewProps {
  images?: XpImage[]
}
export default function ImagePreview({images = []}: ImagePreviewProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const loadFallbackImage = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/raster/dummy-image-square.jpg"
  }
  return (
    <>
      <Image
        maxWidth="300px"
        mt={4}
        alt={"Product Image"}
        src={images?.length ? images[selectedImage].Url : "/raster/dummy-image-square.jpg"}
        onError={loadFallbackImage}
      />
      <HStack mt={4}>
        {images.map((image, index) => {
          return (
            <VStack key={index}>
              <Text>{index + 1}</Text>

              {image?.Url ? (
                <Image
                  boxSize="75px"
                  objectFit="scale-down"
                  mt={4}
                  alt={"Product Image"}
                  src={image?.ThumbnailUrl || image?.Url || "/raster/dummy-image-square.jpg"}
                  onError={loadFallbackImage}
                  border={index == selectedImage ? "1px solid" : ""}
                  onClick={() => {
                    setSelectedImage(index)
                  }}
                />
              ) : (
                <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={500}>
                  <>No Image</>
                </Heading>
              )}
            </VStack>
          )
        })}
      </HStack>
    </>
  )
}
