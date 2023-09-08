import {Card, Button, ButtonGroup, CardBody, CardHeader, Container, Divider} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import {PartialDeep, SecurityProfileAssignment, SecurityProfiles, Suppliers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {ISupplier} from "types/ordercloud/ISupplier"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import {TbChevronLeft} from "react-icons/tb"
import {array, boolean, object, string} from "yup"
import {useSuccessToast} from "hooks/useToast"
import {getObjectDiff} from "utils"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"
import {differenceBy, isEmpty, isEqual} from "lodash"
import {SecurityProfileAssignmentTabs} from "../security-profiles/assignments/SecurityProfileAssignmentTabs"
import {useEffect} from "react"

interface FormFieldValues {
  Supplier: ISupplier
  SecurityProfileAssignments: SecurityProfileAssignment[]
}

interface SupplierFormProps {
  supplier?: ISupplier
  securityProfileAssignments?: SecurityProfileAssignment[]
  refresh?: () => void
}

export function SupplierForm({supplier, securityProfileAssignments = [], refresh}: SupplierFormProps) {
  const isSupplierManager = useHasAccess(appPermissions.SupplierManager)
  const isCreating = !supplier?.ID
  const router = useRouter()
  const successToast = useSuccessToast()

  const defaultValues: PartialDeep<FormFieldValues> = {
    Supplier: {
      Active: true
    },
    SecurityProfileAssignments: securityProfileAssignments
  }

  const validationSchema = object().shape({
    Supplier: object().shape({
      Name: string().required("Name is required"),
      Active: boolean(),
      AllBuyersCanOrder: boolean()
    }),
    SecurityProfileAssignments: array().of(
      object().shape({
        SecurityProfileID: string().required("Security Profile is required")
      })
    )
  })

  const {handleSubmit, control, reset} = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: supplier?.ID
      ? {Supplier: supplier, SecurityProfileAssignments: securityProfileAssignments}
      : defaultValues,
    mode: "onBlur"
  })

  useEffect(() => {
    if (supplier) {
      reset({Supplier: supplier, SecurityProfileAssignments: securityProfileAssignments})
    }
  }, [supplier, securityProfileAssignments, reset])

  async function createSupplier(fields: FormFieldValues) {
    const createdSupplier = await Suppliers.Create<ISupplier>(fields.Supplier)
    const assignmentRequests = fields.SecurityProfileAssignments.map((assignment) => {
      assignment.SupplierID = createdSupplier.ID
      return SecurityProfiles.SaveAssignment(assignment)
    })
    await Promise.all(assignmentRequests)
    successToast({
      description: "Supplier created successfully."
    })
    router.replace(`/suppliers/${createdSupplier.ID}`)
  }

  async function updateSupplier(fields: FormFieldValues) {
    const supplierDiff = getObjectDiff(supplier, fields.Supplier)
    if (!isEmpty(supplierDiff)) {
      await Suppliers.Patch<ISupplier>(supplier.ID, supplierDiff)
    }

    if (!isEqual(securityProfileAssignments, fields.SecurityProfileAssignments)) {
      await updateSecurityProfileAssignments(fields.SecurityProfileAssignments)
    }

    successToast({
      description: "Supplier updated successfully."
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
      await createSupplier(fields)
    } else {
      await updateSupplier(fields)
    }
  }

  return (
    <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
      <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
          <Button onClick={() => router.push("/suppliers")} variant="ghost" leftIcon={<TbChevronLeft />}>
            Back
          </Button>
          <ProtectedContent hasAccess={appPermissions.SupplierManager}>
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
            name="Supplier.Active"
            label="Active"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isSupplierManager}
          />
          <InputControl
            name="Supplier.Name"
            label="Supplier Name"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isSupplierManager}
          />
          <SwitchControl
            name="Supplier.AllBuyersCanOrder"
            label="All Buyers Can Order"
            control={control}
            validationSchema={validationSchema}
            isDisabled={!isSupplierManager}
          />
          {!isCreating && (
            <InputControl
              name="Supplier.DateCreated"
              label="Date created"
              isReadOnly
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isSupplierManager}
            />
          )}
          <ProtectedContent hasAccess={appPermissions.SecurityProfileManager}>
            <>
              <Divider my={6} />
              <SecurityProfileAssignmentTabs
                control={control}
                commerceRole="supplier"
                assignmentLevel="company"
                assignmentLevelId={supplier?.ID}
                showAssignedTab={false}
              />
            </>
          </ProtectedContent>
        </CardBody>
      </Card>
    </Container>
  )
}
