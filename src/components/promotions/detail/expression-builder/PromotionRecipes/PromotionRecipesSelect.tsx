import {groupBy} from "lodash"
import {GroupedReactSelectOption, ReactSelectOption} from "types/form/ReactSelectOption"
import promoRecipes from "./promo-recipes.json"
import {Select} from "chakra-react-select"
import {useState} from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  HStack,
  Button,
  useDisclosure,
  Tooltip,
  VStack
} from "@chakra-ui/react"
import {ValueEditorProps} from "react-querybuilder"
import {transformFunctions} from "./transformFunctions"
import {InfoOutlineIcon} from "@chakra-ui/icons"
import {CustomValueEditor} from "../PromotionExpressionBuilder/components/CustomValueEditor"
import {usePromoExpressions} from "hooks/usePromoExpressions"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"

export interface PromoRecipeVariable {
  label: string
  ordercloudProperty: string
  transformFunctionName: string
  token: string
  value: any
  captureUserInput: boolean
}

interface PromotionRecipesSelectProps {
  onChange: (eligibleExpressionQuery: any, valueExpressionQuery: any, isLineItemLevel: boolean) => void
}

export function PromotionRecipesSelect({onChange}: PromotionRecipesSelectProps) {
  const isPromotionManager = useHasAccess(appPermissions.PromotionManager)
  const {fields} = usePromoExpressions()
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [promoRecipeName, setPromoRecipeName] = useState("")
  const [promoRecipeVariables, setPromoRecipeVariables] = useState([] as PromoRecipeVariable[])
  const options = groupPromoRecipes()

  function groupPromoRecipes() {
    const grouped = Object.entries(groupBy(promoRecipes, "group"))
    return grouped.reduce((acc, [groupName, group]) => {
      const groupOptions = group.map((o) => ({label: o.label, value: o.label}))
      acc.push({label: groupName, options: groupOptions})
      return acc
    }, [] as GroupedReactSelectOption[])
  }

  const handleChange = (option: ReactSelectOption) => {
    setPromoRecipeName(option.value)
    const promoRecipe = promoRecipes.find((o) => o.label === option.value)
    if (promoRecipe) {
      if (promoRecipe.variables?.length) {
        setPromoRecipeVariables(promoRecipe.variables)
        onOpen()
      } else {
        onChange(promoRecipe.eligibleExpressionQuery, promoRecipe.valueExpressionQuery, promoRecipe.isLineItemLevel)
      }
    }
  }

  const handleChangeWithVariables = (recipeVariables: PromoRecipeVariable[]) => {
    let promoRecipe = promoRecipes.find((p) => p.label === promoRecipeName)
    let promoRecipeStringified = JSON.stringify(promoRecipe)

    recipeVariables.forEach((variable, index) => {
      let updatedValue = variable.value
      if (variable.transformFunctionName) {
        updatedValue = transformFunctions[variable.transformFunctionName](variable, recipeVariables)
        recipeVariables[index].value = updatedValue
      }
      promoRecipeStringified = promoRecipeStringified.replace(
        new RegExp(`"${variable.token}"`, "g"),
        updatedValue?.includes?.("{") ? updatedValue : JSON.stringify(updatedValue)
      )
    })
    promoRecipe = JSON.parse(promoRecipeStringified)
    onChange(promoRecipe.eligibleExpressionQuery, promoRecipe.valueExpressionQuery, promoRecipe.isLineItemLevel)
    setPromoRecipeVariables([])
  }

  return (
    <>
      <FormControl>
        <FormLabel>
          Promotion Recipes{" "}
          <Tooltip
            label="A collection of pre-built promotions that you can customize to fit your specific needs."
            placement="right"
            aria-label="Tooltip for prebuilt promotions field"
          >
            <InfoOutlineIcon fontSize="sm" color="gray.600" />
          </Tooltip>
        </FormLabel>
        <Select<ReactSelectOption, false, GroupedReactSelectOption>
          options={options}
          value={options.flatMap((o) => o.options).find((o) => o.value === promoRecipeName)}
          onChange={handleChange}
          formatGroupLabel={(groupedOption) => groupedOption.label}
          isDisabled={!isPromotionManager}
          chakraStyles={{
            container: (baseStyles) => ({...baseStyles, maxWidth: "500px"})
          }}
        />
      </FormControl>
      <Modal isOpen={isOpen && promoRecipeVariables?.length > 0} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Enter details for recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack gap={4}>
              {promoRecipeVariables
                .filter((variable) => {
                  return variable.captureUserInput === undefined || variable.captureUserInput === true
                })
                .map((variable) => {
                  const fieldData = fields.find((f) => f.name === variable.ordercloudProperty)
                  const valueEditorProps = {
                    operator: "=",
                    field: variable.ordercloudProperty,
                    fieldData,
                    inputType: fieldData?.inputType || "text",
                    valueSource: "value"
                  } as ValueEditorProps
                  return (
                    <FormControl key={variable.label}>
                      <FormLabel>{variable.label}</FormLabel>
                      <CustomValueEditor
                        {...valueEditorProps}
                        showInModal={true}
                        handleOnChange={(newVal) => {
                          variable.value = newVal
                        }}
                        handleOnParentChange={(newVal) => {
                          const parentVariable = promoRecipeVariables.find(
                            (v) => v.token === `${variable.token}__PARENT`
                          )
                          parentVariable.value = newVal
                        }}
                      />
                    </FormControl>
                  )
                })}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack width="full">
              <Button
                onClick={() => {
                  setPromoRecipeVariables([])
                  onClose()
                }}
              >
                Cancel
              </Button>
              <Button colorScheme="primary" onClick={() => handleChangeWithVariables(promoRecipeVariables)}>
                Submit
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
