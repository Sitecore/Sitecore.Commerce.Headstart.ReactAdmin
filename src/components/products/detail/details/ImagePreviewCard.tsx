import {Button, HStack, VStack, Heading, Image, Text, CardProps, Card, CardBody, CardHeader} from "@chakra-ui/react"
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
      <CardBody>
        <Image
          maxWidth="300px"
          w="full"
          rounded="md"
          shadow="sm"
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
                  <Button
                    variant="unstyled"
                    onClick={() => {
                      setSelectedImage(index)
                    }}
                  >
                    <Image
                      boxSize="75px"
                      objectFit="scale-down"
                      mt={4}
                      transition="transform .15s ease"
                      _hover={{shadow: "md", transform: "translateY(-1px)"}}
                      rounded="md"
                      alt={"Product Image"}
                      src={image?.ThumbnailUrl || image?.Url || "/raster/dummy-image-square.jpg"}
                      onError={loadFallbackImage}
                      border={index == selectedImage && "1px solid lightgray"}
                    />
                  </Button>
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
