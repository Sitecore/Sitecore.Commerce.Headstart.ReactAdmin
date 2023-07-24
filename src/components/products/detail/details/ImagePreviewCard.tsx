import {HStack, VStack, Heading, Image, Text, CardProps, Card, CardBody, CardHeader} from "@chakra-ui/react"
import {useState} from "react"
import {XpImage} from "types/ordercloud/IProduct"

interface ImagePreviewCardProps extends CardProps {
  images?: XpImage[]
}
export function ImagePreviewCard({images = [], ...cardProps}: ImagePreviewCardProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const loadFallbackImage = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/raster/dummy-image-square.jpg"
  }
  return (
    <Card {...cardProps}>
      <CardHeader>
        <Heading size="md"></Heading>
      </CardHeader>
      <CardBody>
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
      </CardBody>
    </Card>
  )
}
