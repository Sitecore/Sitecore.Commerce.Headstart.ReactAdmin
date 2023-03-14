import {Box, Text, HStack, Icon} from "@chakra-ui/react"
import {HiOutlineX} from "react-icons/hi"

export default function TagContainer(props) {
  return (
    <Box width="full" pb={2} pt={4}>
      <HStack className="item-list" wrap="wrap">
        {Object.keys(props.tags).map((name, key) => {
          return true && typeof props.tags[name] != "object" ? (
            <Box className="item-container" key={key} pb="5px">
              <div className="item-name">
                {
                  <>
                    <Box
                      border="1px"
                      borderColor="lightGray"
                      pt="10px"
                      pb="10px"
                      pr="10px"
                      pl={props.isEditing ? "30px" : "10px"}
                      position="relative"
                      borderRadius="md"
                      bgColor={props.isEditing ? "bodyBg" : ""}
                      opacity={props.toBeDeleted.includes(name) ? "50%" : "100%"}
                      color={props.toBeDeleted.includes(name) ? "red" : ""}
                    >
                      {props.isEditing ? (
                        <Icon
                          as={HiOutlineX}
                          mr="10px"
                          ml="10px"
                          position="absolute"
                          left="0px"
                          top="14px"
                          cursor="pointer"
                          onClick={props.onDeleteClicked(name)}
                        />
                      ) : (
                        <></>
                      )}
                      <Text
                        cursor={props.isEditing ? "pointer" : ""}
                        onClick={() => {
                          props.isEditing ? props.onNameClicked(name) : ""
                        }}
                      >
                        {name.replace("###", "")}
                      </Text>
                    </Box>
                  </>
                }
              </div>
            </Box>
          ) : (
            <></>
          )
        })}
      </HStack>
    </Box>
  )
}
