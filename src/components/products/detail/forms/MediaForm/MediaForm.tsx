import {
  Flex,
  Icon,
  Heading,
  Box,
  Grid,
  GridItem,
  Image,
  theme,
  Button,
  CardBody,
  CardFooter,
  HStack,
  Card,
  Divider,
  Text
} from "@chakra-ui/react"
import {Control, FieldValues, useController} from "react-hook-form"
import {TbFileUpload} from "react-icons/tb"
import schraTheme from "theme/theme"
import {MediaModal} from "./MediaModal"
import * as fieldNames from "./fieldNames"
import {XpImage} from "types/ordercloud/IProduct"
import {DndProvider, useDrag, useDrop} from "react-dnd"
import {useRef} from "react"
import {HTML5Backend} from "react-dnd-html5-backend"

type DetailsFormProps = {
  control: Control<FieldValues, any>
}
export function MediaForm({control}: DetailsFormProps) {
  const {
    field: {value: images, onChange}
  } = useController({name: fieldNames.IMAGES, control})

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
  )
}

interface ImageCardProps {
  image: XpImage
  index: number
  onSetPrimary: (index: number) => void
  onRemove: (index: number) => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}
function ImageCard({image, index, onSetPrimary, onRemove, onMove}: ImageCardProps) {
  const dragItemType = "image"
  const ref = useRef(null)

  // Define drop zone
  const [{handlerId}, drop] = useDrop({
    accept: dragItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover(item: {index: number}, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })

  // define drag source
  const [{isDragging}, drag] = useDrag({
    type: dragItemType,
    item: () => ({index}),
    collect: (monitor) => ({isDragging: monitor.isDragging()})
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <Card height="full" ref={ref} style={{opacity}} data-handler-id={handlerId}>
      <CardBody flexGrow={1}>
        <Image src={image.ThumbnailUrl || image.Url} alt="Product image" />
      </CardBody>
      <Divider color="blackAlpha.300" />
      <CardFooter>
        <HStack width="full">
          {index !== 0 && (
            <Button variant="ghost" width="50%" size="xs" onClick={() => onSetPrimary(index)}>
              Set as primary
            </Button>
          )}
          <Button colorScheme="danger" width="50%" size="xs" onClick={() => onRemove(index)}>
            Delete
          </Button>
        </HStack>
      </CardFooter>
    </Card>
  )
}
