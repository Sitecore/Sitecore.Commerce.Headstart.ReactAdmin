import {Button, ButtonGroup, Card, CardBody, CardHeader, Container, Text} from "@chakra-ui/react"
import {yupResolver} from "@hookform/resolvers/yup"
import {InputControl, SwitchControl, TextareaControl} from "components/react-hook-form"
import {useRouter} from "hooks/useRouter"
import {Catalogs} from "ordercloud-javascript-sdk"
import {useForm} from "react-hook-form"
import {TbChevronLeft} from "react-icons/tb"
import {ICatalog} from "types/ordercloud/ICatalog"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"
import Link from "next/link"
import {useEffect, useState} from "react"
import {useSuccessToast} from "hooks/useToast"
import {object, string} from "yup"
import {getObjectDiff} from "utils"
import useHasAccess from "hooks/useHasAccess"
import {appPermissions} from "config/app-permissions.config"
import ProtectedContent from "../auth/ProtectedContent"

interface CatalogFormProps {
  catalog?: ICatalog
}
export function CatalogForm({catalog}: CatalogFormProps) {
  const isBuyerCatalogManager = useHasAccess(appPermissions.BuyerCatalogManager)
  const [currentCatalog, setCurrentCatalog] = useState(catalog)
  const [isCreating, setIsCreating] = useState(!catalog?.ID)
  const router = useRouter()
  const successToast = useSuccessToast()

  useEffect(() => {
    setIsCreating(!currentCatalog?.ID)
  }, [currentCatalog?.ID])

  const defaultValues: Partial<ICatalog> = {
    Active: true
  }

  const validationSchema = object().shape({
    Name: string().max(100).required("Name is required"),
    Description: string().max(100)
  })

  const {handleSubmit, control, reset} = useForm<ICatalog>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: catalog || defaultValues,
    mode: "onBlur"
  })

  async function createCatalog(fields: ICatalog) {
    const createdCatalog = await Catalogs.Create<ICatalog>(fields)
    await Catalogs.SaveAssignment({BuyerID: router.query.buyerid as string, CatalogID: createdCatalog.ID})
    successToast({
      description: "Catalog created successfully."
    })
    router.replace(`/buyers/${router.query.buyerid}/catalogs/${createdCatalog.ID}`)
  }

  async function updateCatalog(fields: ICatalog) {
    const diff = getObjectDiff(currentCatalog, fields)
    const updatedCatalog = await Catalogs.Patch<ICatalog>(fields.ID, diff)
    successToast({
      description: "Catalog updated successfully."
    })
    setCurrentCatalog(updatedCatalog)
    reset(updatedCatalog)
  }

  async function onSubmit(fields: ICatalog) {
    if (isCreating) {
      await createCatalog(fields)
    } else {
      await updateCatalog(fields)
    }
  }

  return (
    <>
      <Container maxW="100%" bgColor="st.mainBackgroundColor" flexGrow={1} p={[4, 6, 8]}>
        <Card as="form" noValidate onSubmit={handleSubmit(onSubmit)}>
          <CardHeader display="flex" flexWrap="wrap" justifyContent="space-between">
            <Button
              onClick={() => router.push(`/buyers/${router.query.buyerid}/catalogs`)}
              variant="ghost"
              leftIcon={<TbChevronLeft />}
            >
              Back
            </Button>
            <ProtectedContent hasAccess={appPermissions.BuyerCatalogManager}>
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
              name="Active"
              label="Active"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isBuyerCatalogManager}
            />
            <InputControl
              name="Name"
              label="Catalog Name"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isBuyerCatalogManager}
            />
            <TextareaControl
              name="Description"
              label="Description"
              control={control}
              validationSchema={validationSchema}
              isDisabled={!isBuyerCatalogManager}
            />
            {catalog?.ID && (
              <Link passHref href={`/buyers/${router.query.buyerid}/catalogs/${catalog.ID}/categories`}>
                <Button as="a" variant="outline">
                  Categories ({catalog.CategoryCount})
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      </Container>
    </>
  )
}
