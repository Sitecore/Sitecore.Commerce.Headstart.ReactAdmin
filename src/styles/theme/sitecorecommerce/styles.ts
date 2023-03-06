import {last} from "lodash"

export const styles = {
  // styles for the `body`
  global: {
    body: {
      bg: "bodyBg",
      color: "text",

      fontSize: "sm",

      _dark: {
        color: "textColor.100"
      },
      h1: {
        fontWeight: "300 !important",
        color: "gray.300 !important",
        fontSize: "32px !important",
        width: "100%",
        textAlign: "left",
        my: "15px !important"
      },
      //MOVE THESE TO PROPER PLACE AFTER V1 RELEASE
      ".chakra-input__group": {
        isolation: "auto"
      },
      ".facet-input": {
        input: {
          bg: "inputBg",
          border: "1px",
          borderColor: "gray.200",
          mb: "GlobalPadding",
          width: "100%",
          height: "40px",
          pl: "GlobalPadding"
        }
      },
      "input[type=text]": {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.800",
        mb: "20px"
      },
      input: {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.800",
        mb: "20px"
      },
      "input:read-only": {
        bg: "none",
        border: "1px solid",
        borderColor: "gray.200",
        PointerEvent: "none"
      },
      ".chakra-input": {
        bg: "inputBg",
        border: "1px",
        borderColor: "gray.800",
        mb: "20px"
      },
      ".css-1jj9yua": {height: "38px"},
      ".breadcrumb": {
        ol: {
          "list-style": "none",
          li: {
            "list-style": "none",
            position: "relative",
            display: "inline-flex",
            height: "100%",
            "text-transform": "capitalize",
            color: "gray.400",
            "letter-spacing": "1px",
            "font-size": "12px",
            ml: "2px",
            mt: "5px",
            mr: "5px",
            mb: "5px",
            cursor: "pointer",
            fontWeight: "normal",
            _after: {
              content: '" >> "',
              pl: "10px",
              pr: "0"
            },
            _last: {
              color: "#252525",
              //"justify-content": "center",
              //"align-items": "center",
              //"box-shadow": "0 2px 5px rgba(0,0,0,0.26)",
              //border: "1px",
              //borderColor: "gray.300",
              //padding: "0 40px",
              //borderRadius: "md",
              _after: {
                content: '""',
                pl: "0px",
                pr: "0px"
              }
            },
            _hover: {
              color: "#252525",
              borderColor: "#252525"
            }
          }
        }
      },
      ".TreeView_app__mdeVn": {
        div: {
          p: {
            display: "none"
          }
        },
        ".tree-node": {
          py: "20px",
          _hover: {
            bgColor: "gray.200"
          }
        },
        ul: {
          listStyle: "none",
          border: "0px",
          li: {
            fontWeight: 500,
            borderBottom: "1px",
            borderColor: "gray.200",
            cursor: "pointer",
            _first: {
              borderTop: "1px",
              borderColor: "gray.200"
            },
            svg: {
              //display: "none"
            },
            ul: {
              marginTop: "0px",
              li: {
                _last: {
                  borderBottom: "0px"
                  // borderColor: "gray.200"
                },
                ul: {
                  marginTop: "0px",
                  li: {
                    _last: {
                      borderBottom: "0px"
                      // borderColor: "gray.200"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
