import {Flex, Icon, Heading, Box, Grid, GridItem, theme, CardBody, Card, Text} from "@chakra-ui/react"
import {Control, useController} from "react-hook-form"
import {TbFileUpload} from "react-icons/tb"
import schraTheme from "theme/theme"
import {MediaModal} from "./MediaModal"
import {XpImage} from "types/ordercloud/IProduct"
import {DndProvider} from "react-dnd"
import {HTML5Backend} from "react-dnd-html5-backend"
import {ProductDetailFormFields} from "../form-meta"
import {ImageCard} from "./ImageCard"

type MediaTabProps = {
  control: Control<ProductDetailFormFields>
}
export function MediaTab({control}: MediaTabProps) {
  const {
    field: {value: images, onChange}
  } = useController({name: "Product.xp.Images", control})

  const handleAdd = (image: XpImage) => {
    onChange([...images, image])
  }

  const handleRemove = (index: number) => {
    onChange(images.filter((image, i) => i !== index))
  }

  const handleSetPrimary = (index: number) => {
    const newImages = [...images]
    const primary = newImages.splice(index, 1)
    newImages.unshift(primary[0])
    onChange(newImages)
  }

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    const newImages = [...images]
    const dragImage = newImages.splice(dragIndex, 1)
    newImages.splice(hoverIndex, 0, dragImage[0])
    onChange(newImages)
  }

  return (
    <Card w="100%">
      <CardBody>
        <DndProvider backend={HTML5Backend}>
          <Flex alignItems="center">
            <MediaModal onAdd={handleAdd} buttonProps={{variant: "outline", colorScheme: "accent", ml: "auto"}} />
          </Flex>
          {images?.length ? (
            <Box>
              <Grid gridTemplateColumns="repeat(auto-fit, 225px)" gap={4} marginBottom={4}>
                {images.map((image: XpImage, index) => {
                  return (
                    <GridItem
                      key={index}
                      border={`1px solid ${theme.colors.blackAlpha[300]}`}
                      borderRadius={"md"}
                      shadow={"md"}
                    >
                      <ImageCard
                        image={image}
                        index={index}
                        onSetPrimary={handleSetPrimary}
                        onRemove={handleRemove}
                        onMove={handleMove}
                      />
                    </GridItem>
                  )
                })}
              </Grid>
              {images.length > 1 && (
                <Text fontSize="sm" fontStyle="italic" color="gray.500">
                  Images can be dragged to reorder
                </Text>
              )}
            </Box>
          ) : (
            <Box
              alignSelf={"center"}
              shadow="md"
              border={`1px dashed ${schraTheme.colors.gray[300]}`}
              borderRadius="md"
              display="flex"
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              minH={"xs"}
              bgColor={"blackAlpha.50"}
              my={6}
              mx="auto"
              w="full"
              maxW="container.xl"
              gap={4}
            >
              <Icon as={TbFileUpload} fontSize={"5xl"} strokeWidth={"2px"} color="gray.300" />
              <Heading colorScheme="secondary" fontSize="xl">
                No Media
              </Heading>
              <MediaModal onAdd={handleAdd} buttonProps={{variant: "solid", size: "sm", colorScheme: "primary"}} />
            </Box>
          )}
        </DndProvider>
      </CardBody>
    </Card>
  )
}
