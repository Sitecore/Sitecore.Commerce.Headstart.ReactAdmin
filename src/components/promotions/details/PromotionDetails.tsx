import ProtectedContent from "@/components/auth/ProtectedContent"
import {SwitchControl, InputControl, ResetButton, TextareaControl} from "@/components/react-hook-form"
import SubmitButton from "@/components/react-hook-form/submit-button"
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  CardBody,
  Card,
  CardHeader,
  VStack,
  Button,
  ButtonGroup,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  Heading,
  AccordionPanel,
  AccordionIcon,
  HStack
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {appPermissions} from "config/app-permissions.config"
import router from "next/router"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {IPromotion} from "types/ordercloud/IPromotion"
import {emptyStringToNull} from "utils"
import {object, string, date, number, boolean, bool} from "yup"
import {PromotionExpressionBuilder} from "../PromotionExpressionBuilder/PromotionExpressionBuilder"

interface PromotionDetailsProps {
  promotion?: IPromotion
}
export function PromotionDetails({promotion}: PromotionDetailsProps) {
  const isCreatingNew = !promotion?.ID

  const defaultValues = {
    Active: true
  }

  const validationSchema = object().shape({
    // Promotion details
    Name: string().required("Name is required").max(100),
    Description: string().max(2000),
    FinePrint: string().max(2000),
    Code: string().max(100).required("Code is required"),
    Active: boolean(),
    OwnerID: string(),

    // Promotion application
    AutoApply: boolean(),
    Priority: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
    AllowAllBuyers: boolean(),
    LineItemLevel: boolean(),

    // Promotion limits
    StartDate: date(),
    ExpirationDate: date(),
    RedemptionLimit: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
    RedemptionLimitPerUser: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
    RedemptionCount: number().transform(emptyStringToNull).nullable(), // readonly
    CanCombine: boolean(),

    // Promotion expressions
    EligibleExpression: string()
      .max(400, "Eligible expression has a max length of 400 characters")
      .required("Eligible Expression is required"),
    EligibleExpressionValid: bool().required().oneOf([true], "Eligible Expression is invalid"),
    ValueExpression: string()
      .max(400, "Value expression has a max length of 400 characters")
      .required("Value Expression is required"),
    ValueExpressionValid: bool().required().oneOf([true], "Value Expression is invalid")
  })

  const {handleSubmit, control, reset} = useForm<IPromotion>({
    resolver: yupResolver(validationSchema),
    defaultValues: promotion || defaultValues,
    mode: "onBlur"
  })

  const onSubmit = (fields: IPromotion) => {
    console.log(fields)
  }

  return (
    <Container maxW="full" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.push("/buyers")} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={appPermissions.PromotionManager}>
            <ButtonGroup>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
            </ButtonGroup>
          </ProtectedContent>
        </CardHeader>
        <CardBody>
          <Tabs variant="enclosed" maxW="container.2xl">
            <TabList>
              <Tab>Promotion Settings</Tab>
              <Tab>Expression Builder</Tab>
              <Tab>Assignments</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Accordion allowToggle={true} defaultIndex={[0]}>
                  <AccordionItem>
                    <AccordionButton>
                      <Heading as="h3" size="sm" fontWeight="medium" flex="1" textAlign="left">
                        Details
                      </Heading>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <VStack gap={3} marginTop={3}>
                        <SwitchControl
                          name="Active"
                          label="Active"
                          control={control}
                          validationSchema={validationSchema}
                        />
                        <InputControl name="Name" label="Name" control={control} validationSchema={validationSchema} />
                        <InputControl name="Code" label="Code" control={control} validationSchema={validationSchema} />
                        <InputControl
                          name="OwnerID"
                          label="Owner ID"
                          control={control}
                          validationSchema={validationSchema}
                        />

                        <TextareaControl
                          name="Description"
                          label="Description"
                          control={control}
                          validationSchema={validationSchema}
                        />
                        <TextareaControl
                          name="FinePrint"
                          label="Fine print"
                          control={control}
                          validationSchema={validationSchema}
                        />
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton>
                      <Heading as="h3" size="sm" fontWeight="medium" flex="1" textAlign="left">
                        Application Rules
                      </Heading>
                      <AccordionIcon />
                    </AccordionButton>

                    <AccordionPanel>
                      <VStack gap={3} marginTop={3}>
                        <SwitchControl
                          name="AllowAllBuyers"
                          label="Allow all buyers"
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="If enabled, this promotion will be available to all buyers. If disabled, you will need to assign this promotion to specific buyers."
                        />
                        <SwitchControl
                          name="AutoApply"
                          label="Auto apply"
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="Whether or not this promotion should be auto-applied instead of requiring the user to enter a code."
                        />
                        <SwitchControl
                          name="LineItemLevel"
                          label="Line Item Level"
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="Whether this promotion should be applied to individual line items, as opposed to the entire order."
                        />
                        <InputControl
                          name="Priority"
                          label="Priority"
                          inputProps={{type: "number"}}
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="Lets you specify the order in which promotions are applied. Promotions with a higher priority (lower number) will be applied first. This is useful when using auto-applied promotions"
                        />
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <AccordionButton>
                      <Heading as="h3" size="sm" fontWeight="medium" flex="1" textAlign="left">
                        Usage Limits
                      </Heading>
                    </AccordionButton>

                    <AccordionPanel>
                      <VStack gap={3} marginTop={3}>
                        <SwitchControl
                          name="CanCombine"
                          label="Can combine"
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="Whether or not this promotion can be combined with other promotions."
                        />
                        <HStack width="full">
                          <InputControl
                            name="StartDate"
                            label="Start date"
                            inputProps={{type: "date"}}
                            control={control}
                            validationSchema={validationSchema}
                          />
                          <InputControl
                            name="ExpirationDate"
                            label="End date"
                            inputProps={{type: "date"}}
                            control={control}
                            validationSchema={validationSchema}
                          />
                        </HStack>

                        <InputControl
                          name="RedemptionLimit"
                          label="Redemption limit"
                          inputProps={{type: "number"}}
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="The maximum number of times this promotion can be redeemed across all users"
                        />
                        <InputControl
                          name="RedemptionLimitPerUser"
                          label="Redemption limit per user"
                          inputProps={{type: "number"}}
                          control={control}
                          validationSchema={validationSchema}
                          tooltipText="The maximum number of times this promotion can be redeemed by a single user."
                        />
                        {!isCreatingNew && (
                          <InputControl
                            name="RedemptionCount"
                            label="Redemption count"
                            control={control}
                            validationSchema={validationSchema}
                            isDisabled={true}
                          />
                        )}
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </TabPanel>
              <TabPanel>
                <PromotionExpressionBuilder
                  expressionType="Eligible"
                  control={control}
                  validationSchema={validationSchema}
                />
                <PromotionExpressionBuilder
                  expressionType="Value"
                  control={control}
                  validationSchema={validationSchema}
                />
              </TabPanel>
              <TabPanel></TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Container>
  )
}
