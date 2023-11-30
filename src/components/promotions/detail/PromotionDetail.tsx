import ProtectedContent from "@/components/auth/ProtectedContent"
import {ResetButton} from "@/components/react-hook-form"
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
  Button,
  ButtonGroup,
  Container
} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {appPermissions} from "config/app-permissions.config"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {IPromotion} from "types/ordercloud/IPromotion"
import {emptyStringToNull, getObjectDiff} from "utils"
import {object, string, date, number, boolean, array} from "yup"
import {RuleGroupTypeIC} from "react-querybuilder"
import {DetailsTab} from "./details/DetailsTab"
import {ApplicationRulesTab} from "./application-rules/ApplicationRulesTab"
import {UsageLimitsTab} from "./usage-limits/UsageLimitsTab"
import {ExpressionBuilderTab} from "./expression-builder/ExpressionBuilderTab"
import {PromoAssignmentTab} from "./assignments/PromoAssignmentTab"
import {PromotionAssignment, Promotions} from "ordercloud-javascript-sdk"
import {differenceBy, merge} from "lodash"
import {usePromotionDetail} from "hooks/usePromoDetail"
import {useRouter} from "next/router"

export interface PromotionDetailFormFields {
  Promotion: IPromotion & {EligibleExpressionValid?: boolean; ValueExpressionValid?: boolean}
  PromotionAssignments: PromotionAssignment[]
}

type PromotionDetailsProps = ReturnType<typeof usePromotionDetail>

export function PromotionDetail({
  promotion,
  promotionAssignments,
  defaultOwnerId,
  fetchPromotion,
  fetchPromotionAssignments
}: PromotionDetailsProps) {
  const isCreatingNew = !promotion?.ID
  const initialQuery: RuleGroupTypeIC = {rules: [], id: "root"}
  const router = useRouter()

  const defaultValues: PromotionDetailFormFields = {
    Promotion: {
      Active: true,
      AllowAllBuyers: true,
      Code: "",
      EligibleExpression: "",
      ValueExpression: "",
      OwnerID: defaultOwnerId,
      xp: {
        eligibleExpressionQuery: initialQuery,
        valueExpressionQuery: initialQuery
      }
    },
    PromotionAssignments: []
  }

  const validationSchema = object().shape({
    Promotion: object().shape({
      // Promotion details
      Name: string().required("Name is required").max(100),
      Description: string().max(2000).nullable(),
      FinePrint: string().max(2000).nullable(),
      Code: string().max(100).required("Code is required"),
      Active: boolean(),
      OwnerID: string(),

      // Promotion application
      AutoApply: boolean(),
      Priority: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
      AllowAllBuyers: boolean(),
      LineItemLevel: boolean(),

      // Promotion limits
      StartDate: date().nullable(),
      ExpirationDate: date().nullable(),
      RedemptionLimit: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
      RedemptionLimitPerUser: number().transform(emptyStringToNull).nullable().typeError("You must specify a number"),
      RedemptionCount: number().transform(emptyStringToNull).nullable(), // readonly
      CanCombine: boolean(),

      // Promotion expressions
      EligibleExpression: string()
        .max(400, "Eligible expression has a max length of 400 characters")
        .required("Eligible Expression is required"),
      EligibleExpressionValid: boolean().required().oneOf([true], "Eligible Expression is invalid"),
      ValueExpression: string()
        .max(400, "Value expression has a max length of 400 characters")
        .required("Value Expression is required"),
      ValueExpressionValid: boolean().required().oneOf([true], "Value Expression is invalid"),
      xp: object().shape({
        eligibleExpressionQuery: object(),
        valueExpressionQuery: object()
      })
    }),
    PromotionAssignments: array().of(
      object().shape({
        BuyerID: string(),
        UserGroupID: string().nullable()
      })
    )
  })

  const {handleSubmit, control, reset} = useForm<PromotionDetailFormFields>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: promotion?.ID
      ? {Promotion: promotion, PromotionAssignments: promotionAssignments || []}
      : defaultValues,
    mode: "onBlur"
  })

  const onSubmit = async (formFields: PromotionDetailFormFields) => {
    let updatedPromotion: IPromotion
    if (isCreatingNew) {
      updatedPromotion = await Promotions.Create(formFields.Promotion)
    } else {
      const oldPromo = promotion
      const newPromo = formFields.Promotion
      const diff = getObjectDiff(oldPromo, newPromo) as IPromotion
      updatedPromotion = await Promotions.Patch(newPromo.ID, diff)
    }

    if (updatedPromotion.AllowAllBuyers) {
      const existingAssignments = await Promotions.ListAssignments({promotionID: updatedPromotion.ID})
      const deleteRequests = existingAssignments.Items.map((assignment) =>
        Promotions.DeleteAssignment(assignment.PromotionID, {
          buyerID: assignment.BuyerID,
          userGroupID: assignment.UserGroupID
        })
      )
      await Promise.all(deleteRequests)
    } else {
      const newAssignments = formFields.PromotionAssignments.map((assignment) => {
        assignment.PromotionID = updatedPromotion.ID
        return assignment
      })
      const oldAssignmentList = await Promotions.ListAssignments({promotionID: updatedPromotion.ID})
      const oldAssignments = oldAssignmentList.Items

      const addAssignments = differenceBy(
        newAssignments,
        oldAssignments,
        (ass) => ass.BuyerID + ass.PromotionID + ass.UserGroupID
      )
      const deleteAssignments = differenceBy(
        oldAssignments,
        newAssignments,
        (ass) => ass.BuyerID + ass.PromotionID + ass.UserGroupID
      )

      const addAssignmentRequests = addAssignments.map((ass) => Promotions.SaveAssignment(ass))
      const deleteAssignmentRequests = deleteAssignments.map((ass) =>
        Promotions.DeleteAssignment(ass.PromotionID, {buyerID: ass.BuyerID, userGroupID: ass.UserGroupID})
      )

      await Promise.all([...addAssignmentRequests, ...deleteAssignmentRequests])
    }

    if (isCreatingNew) {
      router.replace(`/promotions/${updatedPromotion.ID}`)
    } else {
      const [finalPromotion, finalPromotionAssignments] = await Promise.all([
        fetchPromotion(updatedPromotion.ID),
        fetchPromotionAssignments(updatedPromotion.ID)
      ])
      reset({
        Promotion: finalPromotion,
        PromotionAssignments: finalPromotionAssignments
      })
    }
  }

  return (
    <Container maxW="full" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.back()} variant="ghost" leftIcon={<TbChevronLeft />}>
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
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Details</Tab>
              <Tab>Application Rules</Tab>
              <Tab>Usage Limits</Tab>
              <Tab>Expression Builder</Tab>
              <ProtectedContent hasAccess={appPermissions.PromotionManager}>
                <Tab>Assignments</Tab>
              </ProtectedContent>
            </TabList>
            <TabPanels>
              <TabPanel maxW="container.lg">
                <DetailsTab control={control} validationSchema={validationSchema} isCreatingNew={isCreatingNew} />
              </TabPanel>
              <TabPanel>
                <ApplicationRulesTab control={control} validationSchema={validationSchema} />
              </TabPanel>
              <TabPanel>
                <UsageLimitsTab control={control} validationSchema={validationSchema} isCreatingNew={isCreatingNew} />
              </TabPanel>
              <TabPanel>
                <ExpressionBuilderTab
                  control={control}
                  validationSchema={validationSchema}
                  initialQuery={initialQuery}
                  promotion={promotion}
                />
              </TabPanel>
              <TabPanel>
                <PromoAssignmentTab control={control} validationSchema={validationSchema} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardBody>
      </Card>
    </Container>
  )
}
