import {ChevronDownIcon} from "@chakra-ui/icons"
import {
  Menu,
  MenuButton,
  HStack,
  MenuList,
  MenuItem,
  VStack,
  CheckboxGroup,
  SimpleGrid,
  Checkbox,
  Text,
  Popover,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverCloseButton,
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
  return (
    <Popover>
      {({onClose}) => (
        <>
          <PopoverTrigger>
            <Button>
              <HStack>
                <Text>Views </Text>
                <ChevronDownIcon />
              </HStack>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>Manage Product Views</PopoverHeader>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverBody margin={10}>
              <SimpleGrid columns={2} spacing={3}>
                <Checkbox value="details" isChecked={visibility.details} onChange={handleChange}>
                  Details
                </Checkbox>
                <Checkbox value="pricing" isChecked={visibility.pricing} onChange={handleChange}>
                  Pricing
                </Checkbox>
                <Checkbox value="variants" isChecked={visibility.variants} onChange={handleChange}>
                  Variants
                </Checkbox>
                <Checkbox value="media" isChecked={visibility.media} onChange={handleChange}>
                  Media
                </Checkbox>
                <Checkbox value="facets" isChecked={visibility.facets} onChange={handleChange}>
                  Facets
                </Checkbox>
                <Checkbox value="seo" isChecked={visibility.seo} onChange={handleChange}>
                  SEO
                </Checkbox>
              </SimpleGrid>
            </PopoverBody>
            <PopoverFooter>
              <Flex justifyContent="space-between">
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="primaryButton" onClick={() => onSubmit(onClose)}>
                  Save
                </Button>
              </Flex>
            </PopoverFooter>
          </PopoverContent>
        </>
      )}
    </Popover>
  )
}
