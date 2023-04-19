import * as Yup from "yup"
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  InputGroup,
  InputLeftElement,
  ListItem,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  Select,
  SimpleGrid,
  UnorderedList,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  VStack
} from "@chakra-ui/react"
import {DeleteIcon} from "@chakra-ui/icons"
import {InputControl, RadioGroupControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import {Tab, TabList, TabPanel, TabPanels, Tabs} from "@chakra-ui/react"
import {useEffect, useState} from "react"
// import Card from "../card/Card"
import DatePicker from "../datepicker/DatePicker"
import {ExpressionBuilder} from "./ExpressionBuilder"
import {Promotion, Promotions} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {IPromotion} from "types/ordercloud/IPromotion"
import PromotionXpCard from "./PromotionXpCard"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import {emptyStringToNull} from "utils"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  promotion?: Promotion
}

const EligibleExpressionField = (props) => {
  // TODO: fix this
  // const {values, touched, setFieldValue} = useFormikContext()
  // const [field, meta] = useField(props)

  // useEffect(() => {
  //   const eligibleExpression = async () => {
  //     const elExpression = await buildEligibleExpression(values as any)
  //     setFieldValue(props.name, elExpression)
  //   }
  //   eligibleExpression()
  // }, [props.name, setFieldValue, touched, values])

  // // Simplistic Example to close the loop - then we will use the dnd Expression UI Builder and match to this
  // async function buildEligibleExpression(fields) {
  //   let eligibleExpression = "" //Default value when no condition has been specified.
  //   // Minimum Requirements has been selected
  //   switch (fields.xp_MinimumReq) {
  //     case "min-amount": {
  //       eligibleExpression = `order.Subtotal>= ${fields.xp_MinReqValue}`
  //       break
  //     }
  //     case "min-qty": {
  //       eligibleExpression = `items.quantity()>= ${fields.xp_MinReqValue}`
  //       break
  //     }
  //     default: {
  //       eligibleExpression = "true"
  //       break
  //     }
  //   }

  //   return eligibleExpression
  // }

  // return (
  //   <>
  //     <TextareaControl {...props} {...field} />
  //     {!!meta.touched && !!meta.error && <div>{meta.error}</div>}
  //   </>
  // )
  return <div></div>
}

function CreateUpdateForm({promotion}: CreateUpdateFormProps) {
  const formShape = {
    Name: Yup.string().max(100),
    Code: Yup.string().max(100).required("Code is required"),
    StartDate: Yup.date(),
    ExpirationDate: Yup.date(),
    EligibleExpression: Yup.string().max(400).required("Eligible Expression is required"),
    ValueExpression: Yup.string().max(400).required("Value Expression is required"),
    Description: Yup.string().max(100),
    xp_MinReqValue: Yup.number().transform(emptyStringToNull).nullable().typeError("You must specify a number")
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues, onSubmit} =
    useCreateUpdateForm<Promotion>(promotion, formShape, createPromotion, updatePromotion)

  const {
    watch,
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  // TODO: this is not very performant, do we really need the values displayed?
  const values = watch() as any

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const router = useRouter()

  async function createPromotion(fields: Promotion) {
    await Promotions.Create<IPromotion>(fields)
    successToast({
      description: "Promotion created successfully."
    })
    router.push(`/promotions`)
  }

  async function updatePromotion(fields: Promotion) {
    await Promotions.Save<IPromotion>(fields.ID, fields)
    successToast({
      description: "Promotion updated successfully."
    })
    router.push(`/promotions`)
  }

  async function deletePromotion(promotionid) {
    try {
      await Promotions.Delete(promotionid)
      successToast({
        description: "Promotion deleted successfully."
      })
    } catch (e) {
      errorToast({
        description: "Promotion delete failed"
      })
    }
  }

  const SimpleCard = (props: {title?: string; children: React.ReactElement}) => (
    <Card>
      <CardHeader>{props.title && <Heading size="md">{props.title}</Heading>}</CardHeader>
      <CardBody>{props.children}</CardBody>
    </Card>
  )

  return (
    <>
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Box as="form" onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <ButtonGroup>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <Button onClick={() => router.push(`/promotions`)} variant="outline" isLoading={isSubmitting}>
                Cancel
              </Button>
              {!isCreating && (
                <Button variant="outline" onClick={() => deletePromotion(values.ID)} leftIcon={<DeleteIcon />}>
                  Delete
                </Button>
              )}
            </ButtonGroup>
            <Tabs mt={6} colorScheme="brand">
              <TabList>
                {/* This tab contains all default Promotion API options (No extended propreties) */}
                <Tab>Default Options</Tab>
                {/* This tab contains some examples of how we can leverage XP (extended Propreties) */}
                <Tab>Advanced Rules</Tab>
                {/* This tab contains another examples to show the flexibility offered by EligibleExpressions and ValueExpression Fileds. */}
                <Tab>Expression Builder</Tab>
                {/* This tab contains a way to add any other extended properties. */}
                <Tab>Extended Properties (xp)</Tab>
              </TabList>
              <SimpleGrid gridTemplateColumns={"70% 1fr"} gap={6} mt={6}>
                <TabPanels>
                  <TabPanel p={0}>
                    <Card p={6}>
                      <SimpleGrid columns={2} spacing={10}>
                        <Flex flexFlow="column nowrap" gap={4}>
                          <InputControl name="Name" label="Promotion Name" helperText="" control={control} />
                          <TextareaControl name="Description" label="Description" control={control} />
                          <FormControl>
                            <FormLabel>Start Date</FormLabel>
                            <DatePicker selectedDate={startDate} onChange={setStartDate} />
                          </FormControl>
                          <input type="hidden" name="StartDate" value={startDate.toISOString()} />
                          <label htmlFor="RedemptionLimit">Redemption Limit</label>
                          <NumberInput defaultValue={100} max={1000} clampValueOnBlur={false}>
                            <NumberInputField name="RedemptionLimit" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>

                          <HStack spacing={6}>
                            <SwitchControl name="Active" label="Active" control={control} />
                            <SwitchControl name="AutoApply" label="Auto Apply" control={control} />
                          </HStack>

                          <label htmlFor="Priority">Priority</label>
                          <NumberInput defaultValue={1} max={10} clampValueOnBlur={false}>
                            <NumberInputField name="Priority" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </Flex>
                        <Box>
                          <InputControl name="Code" label="Coupon Code" helperText="" control={control} isRequired />

                          <TextareaControl name="FinePrint" label="Fine Print" control={control} />

                          <FormLabel>End Date</FormLabel>
                          <DatePicker selectedDate={endDate} onChange={setEndDate} />
                          <input type="hidden" name="ExpirationDate" value={endDate.toISOString()} />

                          <label htmlFor="RedemptionLimitPerUser">Redemption Limit per user</label>
                          <NumberInput defaultValue={1} max={10} clampValueOnBlur={false}>
                            <NumberInputField name="RedemptionLimitPerUser" />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>

                          <VStack mt={6} spacing={6}>
                            <SwitchControl name="LineItemLevel" label="Line Item Level" control={control} />
                            <SwitchControl name="CanCombine" label="Can be combined" control={control} />
                            <SwitchControl name="AllowAllBuyers" label="Allow all buyers" control={control} />
                          </VStack>
                        </Box>
                      </SimpleGrid>
                    </Card>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Card p={6}>
                      <SimpleGrid columns={2} spacing={10}>
                        <VStack>
                          <RadioGroupControl name="xp_MinimumReq" label="Minimum requirment" control={control}>
                            <VStack alignItems={"flex-start"}>
                              <Radio value="none">None</Radio>
                              <Radio value="min-amount">Minimum purchase amount</Radio>
                              <Radio value="min-qty">Minimum quantity of items</Radio>
                            </VStack>
                          </RadioGroupControl>
                          <InputControl name="xp_MinReqValue" placeholder="Enter amount" control={control} />
                          <FormControl>
                            <FormLabel htmlFor="xp_ScopeTo">Eligibility / Scope to</FormLabel>
                            <Select name="xp_ScopeTo" id="xp_ScopeTo" placeholder="Select option">
                              <option value="buyers">Buyers</option>
                              <option value="buyersgroup">Buyers Group</option>
                              <option value="suppliers">Suppliers</option>
                              <option value="products">Products</option>
                              <option value="categories">Categories</option>
                            </Select>
                          </FormControl>
                        </VStack>
                        <Box>
                          <RadioGroupControl name="xp_Type" label="Promotion Type" control={control}>
                            <Radio value="Percentage">Percentage</Radio>
                            <Radio value="Fixed">Fixed Amount</Radio>
                            <Radio value="Free-shipping">Free Shipping</Radio>
                            <Radio value="BOGO">BOGO</Radio>
                          </RadioGroupControl>

                          {values.xp_Type !== "Free-shipping" && values.xp_Type !== "BOGO" && (
                            <InputGroup>
                              <InputLeftElement pointerEvents="none" color="gray.300" fontSize="1.2em">
                                {values.xp_Type === "Percentage" ? "%" : "$"}
                              </InputLeftElement>
                              <InputControl name="xp_Value" placeholder="Enter amount" control={control} />
                            </InputGroup>
                          )}
                        </Box>
                      </SimpleGrid>
                    </Card>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Card p={6} gap={6}>
                      <SimpleGrid columns={2} spacing={10}>
                        <EligibleExpressionField name="EligibleExpression" label="Eligible Expression" isRequired />
                        <TextareaControl name="ValueExpression" label="Value Expression" control={control} isRequired />
                      </SimpleGrid>
                      <ExpressionBuilder />
                    </Card>
                  </TabPanel>
                  <TabPanel p={0}>
                    <PromotionXpCard promotion={promotion} />
                    {/* <Card p={6}>
                      <SimpleGrid columns={2} spacing={10}>
                      </SimpleGrid>
                    </Card> */}
                  </TabPanel>
                </TabPanels>
                {/* OVERVIEW */}
                <Card p={6}>
                  <Heading as="h2" fontSize="2xl">
                    Overview
                  </Heading>
                  <UnorderedList>
                    <ListItem>Name: {values.Name}</ListItem>
                    <ListItem>Description: {values.Description}</ListItem>
                    <ListItem>Code: {values.Code}</ListItem>
                    <ListItem>Start Date: {values.StartDate}</ListItem>
                    <ListItem>End Date: {values.ExpirationDate}</ListItem>
                    <ListItem>Can Combine: {values.CanCombine ? "Yes" : "No"}</ListItem>
                    <ListItem>Line Item Level: {values.LineItemLevel ? "Yes" : "No"}</ListItem>
                    <ListItem>Allow All Buyers: {values.AllowAllBuyers ? "Yes" : "No"}</ListItem>
                    <ListItem>Redemption Limit: {values.RedemptionLimit}</ListItem>
                    <ListItem>Redemption Limit Per User: {values.RedemptionLimitPerUser}</ListItem>
                    <ListItem>Fine Print: {values.FinePrint}</ListItem>
                    <ListItem>Eligible Expression: {values.EligibleExpression}</ListItem>
                    <ListItem>Value Expression: {values.ValueExpression}</ListItem>
                  </UnorderedList>
                </Card>
              </SimpleGrid>
            </Tabs>
          </Box>
        </Box>
      </Container>
    </>
  )
}
