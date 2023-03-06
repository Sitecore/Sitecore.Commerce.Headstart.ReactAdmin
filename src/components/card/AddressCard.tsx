import {Text, Flex, useStyleConfig, Input, HStack, VStack} from "@chakra-ui/react"

export default function AddressCard(props) {
  return (
    <Flex>
      <VStack>
        <Text width="full">Address</Text>
        <Input placeholder="" value={props.Street1}></Input>
        <Text width="full">Address 2</Text>
        <Input placeholder="" value={props.Street2}></Input>
        <HStack>
          <VStack>
            <Text width="full">City</Text>
            <Input placeholder="" value={props.City}></Input>
          </VStack>
          <VStack>
            <Text width="full">State</Text>
            <Input placeholder="" value={props.State}></Input>
          </VStack>
          <VStack>
            <Text width="full">Postal Code</Text>
            <Input placeholder="" value={props.Zip}></Input>
          </VStack>
        </HStack>
      </VStack>
    </Flex>
  )
}
