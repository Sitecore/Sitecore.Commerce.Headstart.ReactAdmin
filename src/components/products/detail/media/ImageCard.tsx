import ProtectedContent from "@/components/auth/ProtectedContent"
import {Card, CardBody, Divider, CardFooter, HStack, Button, Image} from "@chakra-ui/react"
import {appPermissions} from "config/app-permissions.config"
import {useRef} from "react"
import {useDrop, useDrag} from "react-dnd"
import {XpImage} from "types/ordercloud/IProduct"

interface ImageCardProps {
  image: XpImage
  index: number
  onSetPrimary: (index: number) => void
  onRemove: (index: number) => void
  onMove: (dragIndex: number, hoverIndex: number) => void
}
export function ImageCard({image, index, onSetPrimary, onRemove, onMove}: ImageCardProps) {
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

  const loadFallbackImage = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    event.currentTarget.src = "/raster/dummy-image-square.jpg"
  }

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <Card height="full" ref={ref} style={{opacity}} data-handler-id={handlerId}>
      <CardBody flexGrow={1}>
        <Image src={image.ThumbnailUrl || image.Url} onError={loadFallbackImage} alt="Product image" />
      </CardBody>
      <Divider color="blackAlpha.300" />
      <ProtectedContent hasAccess={appPermissions.ProductManager}>
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
      </ProtectedContent>
    </Card>
  )
}
