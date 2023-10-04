import {ChevronDownIcon} from "@chakra-ui/icons"
import {
  HStack,
  SimpleGrid,
  Checkbox,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Flex
} from "@chakra-ui/react"
import {ChangeEvent, useState} from "react"
import {ProductDetailTab} from "./ProductDetail"

interface ViewManagerProps {
  viewVisibility: Record<ProductDetailTab, boolean>
  setViewVisibility: (update: Record<ProductDetailTab, boolean>) => void
}

export default function ViewManager({viewVisibility, setViewVisibility}: ViewManagerProps) {
  const [visibility, setVisibility] = useState(viewVisibility)
  const onSubmit = (onClose: () => void) => {
    setViewVisibility(visibility)
    onClose()
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const update = {...visibility, [event.target.value]: event.target.checked}
    setVisibility(update)
  }
  const views = Object.keys(visibility)

  return (
    <Popover>
      {({onClose}) => (
        <>
          <PopoverTrigger>
            <Button variant="outline">
              <HStack>
                <Text>Views </Text>
                <ChevronDownIcon />
              </HStack>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <SimpleGrid columns={[1, 2]} spacing={2}>
                {views.map((view) => (
                  <Checkbox key={view} value={view} isChecked={visibility[view]} onChange={handleChange}>
                    {view}
                  </Checkbox>
                ))}
              </SimpleGrid>
            </PopoverBody>
            <PopoverFooter>
              <Flex justifyContent="space-between">
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="solid" colorScheme="primary" onClick={() => onSubmit(onClose)}>
                  Apply
                </Button>
              </Flex>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}
