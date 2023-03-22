import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Stack} from "@chakra-ui/react"
import {InputControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import Card from "../card/Card"
import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {ICatalog} from "types/ordercloud/ICatalog"
import CatalogXpCard from "./CatalogXpCard"
import {useForm} from "react-hook-form"
import {yupResolver} from "@hookform/resolvers/yup"

export {CreateUpdateForm}

interface CreateUpdateFormProps {
  catalog?: Catalog
}
function CreateUpdateForm({catalog}: CreateUpdateFormProps) {
  const router = useRouter()
  const formShape = {
    Name: Yup.string().max(100).required("Name is required"),
    Description: Yup.string().max(100)
  }
  const {isCreating, successToast, errorToast, validationSchema, defaultValues, onSubmit} =
    useCreateUpdateForm<Catalog>(catalog, formShape, createCatalog, updateCatalog)

  const {
    handleSubmit,
    control,
    formState: {isSubmitting, isValid, isDirty},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues})

  async function createCatalog(fields: Catalog) {
    const createdCatalog = await Catalogs.Create<ICatalog>(fields)
    await Catalogs.SaveAssignment({BuyerID: router.query.buyerid as string, CatalogID: createdCatalog.ID})
    successToast({
      description: "Catalog created successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs`)
  }

  async function updateCatalog(fields: Catalog) {
    const updatedCatalog = await Catalogs.Save<ICatalog>(fields.ID, fields)
    await Catalogs.SaveAssignment({BuyerID: router.query.buyerid as string, CatalogID: updatedCatalog.ID})
    successToast({
      description: "Catalog updated successfully."
    })
    router.push(`/buyers/${router.query.buyerid}/catalogs`)
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <InputControl name="Name" label="Catalog Name" isRequired control={control} />
              <TextareaControl name="Description" label="Description" control={control} />
              <SwitchControl name="Active" label="Active" control={control} />
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
                <Button
                  onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
                  variant="secondaryButton"
                  isLoading={isSubmitting}
                >
                  Cancel
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        </Flex>
      </Card>

      <Card variant="primaryCard" h={"100%"} closedText="Extended Properties Cards">
        <CatalogXpCard catalog={catalog} />
      </Card>
    </>
  )
}
