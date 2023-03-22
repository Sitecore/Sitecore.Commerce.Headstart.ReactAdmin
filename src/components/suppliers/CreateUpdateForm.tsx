import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import Card from "../card/Card"
import {Supplier, Suppliers} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {ISupplier} from "types/ordercloud/ISupplier"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  supplier?: Supplier
}

function CreateUpdateForm({supplier}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().required("Name is required"),
    Active: Yup.bool(),
    AllBuyersCanOrder: Yup.bool()
  }
  const {isCreating, successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<Supplier>(
    supplier,
    formShape,
    createSupplier,
    updateSupplier
  )

  const {
    handleSubmit,
    control,
    formState: {isSubmitting, isValid, isDirty},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues})

  async function createSupplier(fields: Supplier) {
    await Suppliers.Create<ISupplier>(fields)
    successToast({
      description: "Supplier created successfully."
    })
    router.push(".")
  }

  async function updateSupplier(fields: Supplier) {
    await Suppliers.Save<ISupplier>(fields.ID, fields)
    successToast({
      description: "Supplier updated successfully."
    })
    router.push(".")
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <InputControl name="Name" label="Supplier Name" control={control} isRequired />
              <SwitchControl name="Active" label="Active" control={control} />
              <SwitchControl name="AllBuyersCanOrder" label="All Buyers Can Order" control={control} />
              {!isCreating && <InputControl name="DateCreated" label="Date created" isReadOnly control={control} />}
              <ButtonGroup>
                <Button
                  variant="primaryButton"
                  type="submit"
                  isLoading={isSubmitting}
                  isDisabled={!isValid || !isDirty}
                >
                  Save
                </Button>
                <Button onClick={reset} type="reset" variant="secondaryButton" isLoading={isSubmitting}>
                  Reset
                </Button>
                <Button onClick={() => router.push("/suppliers")} variant="secondaryButton" isLoading={isSubmitting}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        </Flex>
      </Card>
    </>
  )
}
