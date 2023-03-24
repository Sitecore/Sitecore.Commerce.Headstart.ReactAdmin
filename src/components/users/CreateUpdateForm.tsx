import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Heading, List, ListIcon, ListItem, Stack} from "@chakra-ui/react"
import {InputControl, SwitchControl} from "components/react-hook-form"
import Card from "../card/Card"
import {MdCheckCircle} from "react-icons/md"
import {User} from "ordercloud-javascript-sdk"
import {useRouter} from "hooks/useRouter"
import {useState} from "react"
import {useCreateUpdateForm} from "hooks/useCreateUpdateForm"
import UserXpCard from "./UserXpCard"
import {yupResolver} from "@hookform/resolvers/yup"
import {useForm} from "react-hook-form"
import ResetButton from "../react-hook-form/reset-button"
import SubmitButton from "../react-hook-form/submit-button"

export {CreateUpdateForm}
interface CreateUpdateFormProps {
  user?: User
  ocService: any
}
function CreateUpdateForm({user, ocService}: CreateUpdateFormProps) {
  const isAddMode = !user
  let router = useRouter()
  const formShape = {
    Username: Yup.string().max(100).required("Name is required"),
    FirstName: Yup.string().required("First Name is required"),
    LastName: Yup.string().required("Last Name is required"),
    Email: Yup.string().email("Email is invalid").required("Email is required")
  }
  const {successToast, validationSchema, defaultValues, onSubmit} = useCreateUpdateForm<User>(
    user,
    formShape,
    createUser,
    updateUser
  )

  const {
    watch,
    handleSubmit,
    control,
    formState: {isSubmitting},
    reset
  } = useForm({resolver: yupResolver(validationSchema), defaultValues, mode: "onBlur"})

  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  let parentId
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid

  async function createUser(fields: User) {
    await ocService.Create(parentId, fields)
    successToast({
      description: "User created successfully."
    })
    router.back()
  }

  async function updateUser(fields: User) {
    await ocService.Save(parentId, router.query.userid, fields)
    successToast({
      description: "User updated successfully."
    })
    router.back()
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Box as="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <InputControl name="Username" label="Username" control={control} isRequired />
              <InputControl name="FirstName" label="First name" control={control} isRequired />
              <InputControl name="LastName" label="Last name" control={control} isRequired />
              <InputControl name="Email" label="Email" control={control} isRequired />
              <InputControl name="Phone" label="Phone" control={control} />
              <SwitchControl name="Active" label="Active" control={control} />
              <ButtonGroup>
                <SubmitButton control={control} variant="solid" colorScheme="primary">
                  Save
                </SubmitButton>
                <ResetButton control={control} reset={reset} variant="outline">
                  Discard Changes
                </ResetButton>
                <Button onClick={() => router.back()} variant="outline" isLoading={isSubmitting}>
                  Cancel
                </Button>
              </ButtonGroup>
            </Stack>
          </Box>
        </Flex>
      </Card>

      {!isAddMode && user?.AvailableRoles && (
        <>
          <Card variant="primaryCard">
            <Flex flexDirection="column" p="10">
              <Heading as="h5" size="md">
                Available Roles
              </Heading>
              <List spacing={3}>
                {user.AvailableRoles.map((role) => (
                  <ListItem key={role}>
                    <ListIcon as={MdCheckCircle} color="green.500" />
                    {role}
                  </ListItem>
                ))}
              </List>
            </Flex>
          </Card>
          <Card variant="primaryCard" h={"100%"} closedText="Extended Properties Cards">
            <UserXpCard organizationID={parentId} user={user} />
          </Card>
        </>
      )}
    </>
  )
}
