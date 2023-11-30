import {Button, ButtonGroup, Card, CardBody, CardHeader, Container, Divider} from "@chakra-ui/react"
import {InputControl, SelectControl, SwitchControl} from "components/react-hook-form"
import {Buyers, Catalogs, PartialDeep, SecurityProfileAssignment, SecurityProfiles} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ICatalog} from "types/ordercloud/ICatalog"
import {IBuyer} from "types/ordercloud/IBuyer"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import SubmitButton from "../react-hook-form/submit-button"
import ResetButton from "../react-hook-form/reset-button"
import {TbChevronLeft} from "react-icons/tb"
import {array, boolean, number, object, string} from "yup"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"
import ProtectedContent from "../auth/ProtectedContent"
import {appPermissions} from "config/app-permissions.config"
import useHasAccess from "hooks/useHasAccess"
import {differenceBy, isEmpty, isEqual} from "lodash"
import {SecurityProfileAssignmentTabs} from "../security-profiles/assignments/SecurityProfileAssignmentTabs"
import {useCallback, useEffect} from "react"

interface FormFieldValues {
  Buyer: IBuyer
  SecurityProfileAssignments: SecurityProfileAssignment[]
}
interface BuyerFormProps {
  buyer?: IBuyer
  securityProfileAssignments?: SecurityProfileAssignment[]
  refresh?: () => void
}
export function BuyerForm({buyer, securityProfileAssignments = [], refresh}: BuyerFormProps) {
  const isBuyerManager = useHasAccess(appPermissions.BuyerManager)
  const isCreating = !buyer?.ID
  const router = useRouter()
  const successToast = useSuccessToast()

  const defaultValues: PartialDeep<FormFieldValues> = {
    Buyer: {
      Active: true
    },
    SecurityProfileAssignments: securityProfileAssignments
  }

  const validationSchema = object().shape({
    Buyer: object().shape({
      Active: boolean(),
      Name: string().required("Name is required"),
      DefaultCatalogID: string()
    }),
    SecurityProfileAssignments: array().of(
      object().shape({
        SecurityProfileID: string().required("Security Profile is required")
      })
    )
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: buyer?.ID ? {Buyer: buyer, SecurityProfileAssignments: securityProfileAssignments} : defaultValues,
    mode: "onBlur"
  })

  useEffect(() => {
    if (buyer) {
      reset({Buyer: buyer, SecurityProfileAssignments: securityProfileAssignments})
    }
  }, [buyer, securityProfileAssignments, reset])

  async function createBuyer(fields: FormFieldValues) {
    const createdBuyer = await Buyers?.Create<IBuyer>(fields.Buyer)
    const assignmentRequests = fields.SecurityProfileAssignments.map((assignment) => {
      assignment.BuyerID = createdBuyer.ID
      return SecurityProfiles.SaveAssignment(assignment)
    })
    await Promise.all(assignmentRequests)
    successToast({
      description: "Buyer created successfully."
    })
    router.replace(`/buyers/${createdBuyer.ID}`)
  }

  async function updateBuyer(fields: FormFieldValues) {
    const buyerDiff = getObjectDiff(buyer, fields.Buyer)
    if (!isEmpty(buyerDiff)) {
      await Buyers.Patch<IBuyer>(buyer.ID, buyerDiff)
    }

    if (!isEqual(securityProfileAssignments, fields.SecurityProfileAssignments)) {
      await updateSecurityProfileAssignments(fields.SecurityProfileAssignments)
    }

    successToast({
      description: "Buyer updated successfully."
    })
    refresh()
  }

  async function updateSecurityProfileAssignments(newAssignments: SecurityProfileAssignment[]) {
    const addAssignments = differenceBy(
      newAssignments,
      securityProfileAssignments,
      (ass) => ass.BuyerID + ass.SecurityProfileID + ass.SupplierID + ass.UserGroupID + ass.UserID
    )
    const deleteAssignments = differenceBy(
      securityProfileAssignments,
      newAssignments,
      (ass) => ass.BuyerID + ass.SecurityProfileID + ass.SupplierID + ass.UserGroupID + ass.UserID
    )

    const addAssignmentRequests = addAssignments.map((assignment) => SecurityProfiles.SaveAssignment(assignment))
    const deleteAssignmentRequests = deleteAssignments.map((assignment) =>
      SecurityProfiles.DeleteAssignment(assignment.SecurityProfileID, {
        buyerID: assignment.BuyerID,
        supplierID: assignment.SupplierID,
        userGroupID: assignment.UserGroupID,
        userID: assignment.UserID
      })
    )
    await Promise.all([...addAssignmentRequests, ...deleteAssignmentRequests])
  }

  async function onSubmit(fields: FormFieldValues) {
    if (isCreating) {
      await createBuyer(fields)
    } else {
      await updateBuyer(fields)
    }
  }

  const loadCatalogs = useCallback(async (inputValue: string) => {
    const allCatalogs = await Catalogs.List<ICatalog>({
      search: inputValue,
      pageSize: 5
    })
    return allCatalogs.Items.map((catalog) => ({label: catalog.Name, value: catalog.ID}))
  }, [])

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.push("/buyers")} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={appPermissions.BuyerManager}>
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
        <CardBody display="flex" flexDirection={"column"} gap={4} maxW={{xl: "container.md"}}>
          <SwitchControl
            name="Buyer.Active"
            label="Active"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isBuyerManager}
          />
          <InputControl
            name="Buyer.Name"
            label="Buyer Name"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isBuyerManager}
          />
          <SelectControl
            name="Buyer.DefaultCatalogID"
            label="Default Catalog"
            selectProps={{
              placeholder: "Select option",
              loadOptions: loadCatalogs
            }}
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isBuyerManager}
          />

          {!isCreating && (
            <InputControl
              name="Buyer.DateCreated"
              label="Date Created"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isBuyerManager}
              isReadOnly
            />
          )}
          <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
            <>
              <Divider my={6} />
              <SecurityProfileAssignmentTabs
                control={control}
                commerceRole="buyer"
                assignmentLevel="company"
                assignmentLevelId={buyer?.ID}
                showAssignedTab={false}
              />
            </>
          </ProtectedContent>
        </CardBody>
      </Card>
    </Container>
  )
}
