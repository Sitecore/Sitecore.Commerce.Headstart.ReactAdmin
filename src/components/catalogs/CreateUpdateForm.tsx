import {Button, ButtonGroup, Card, CardBody, CardHeader, Container} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {InputControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import {useRouter} from "hooks/useRouter"
import {Catalog, Catalogs} from "ordercloud-javascript-sdk"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {ICatalog} from "types/ordercloud/ICatalog"
import * as Yup from "yup"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import CatalogXpCard from "./CatalogXpCard"

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
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

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
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Card>
          <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
              variant="outline"
              isLoading={isSubmitting}
              leftIcon={<TbChevronLeft />}
            >
              Back
            </Button>
            <ButtonGroup>
              <ResetButton control={control} reset={reset} variant="outline">
                Discard Changes
              </ResetButton>
              <SubmitButton control={control} variant="solid" colorScheme="primary">
                Save
              </SubmitButton>
            </ButtonGroup>
          </CardHeader>
          <CardBody
            display="flex"
            flexDirection={"column"}
            as="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            gap={4}
            maxW={{xl: "container.md"}}
          >
            <InputControl name="Name" label="Catalog Name" isRequired control={control} />
            <TextareaControl name="Description" label="Description" control={control} />
            <SwitchControl name="Active" label="Active" control={control} />
          </CardBody>
        </Card>
        <Card mt={6}>
          <CatalogXpCard catalog={catalog} />
        </Card>
      </Container>
    </>
  )
}
