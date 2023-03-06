import * as Yup from "yup"
import {Box, Button, ButtonGroup, Flex, Heading, List, ListIcon, ListItem, Stack} from "@chakra-ui/react"
import {ErrorMessage, Field, Formik} from "formik"
import {InputControl, SwitchControl} from "formik-chakra-ui"
import Card from "../card/Card"
import {MdCheckCircle} from "react-icons/md"
import {User} from "ordercloud-javascript-sdk"
import {useRouter} from "next/router"
import {useState} from "react"
import {useCreateUpdateForm} from "lib/hooks/useCreateUpdateForm"

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
    Email: Yup.string().email("Email is invalid").required("Email is required"),
    Password: Yup.string().required("Password is required").min(10, "Password must be at least 6 characters"),
    ConfirmPassword: Yup.string()
      .transform((x) => (x === "" ? undefined : x))
      .when("Password", (password, schema) => {
        if (password || isAddMode) return schema.required("Confirm Password is required")
      })
      .oneOf([Yup.ref("Password")], "Passwords must match")
  }
  const {successToast, validationSchema, initialValues, onSubmit} = useCreateUpdateForm<User>(
    user,
    formShape,
    createUser,
    updateUser
  )
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  let parentId
  if (router.query.buyerid !== undefined) parentId = router.query.buyerid
  if (router.query.supplierid !== undefined) parentId = router.query.supplierid

  async function createUser(fields: User) {
    await ocService.create(parentId, fields)
    successToast({
      description: "User created successfully."
    })
    router.back()
  }

  async function updateUser(fields: User) {
    await ocService.update(parentId, router.query.userid, fields)
    successToast({
      description: "User updated successfully."
    })
    router.back()
  }

  return (
    <>
      <Card variant="primaryCard">
        <Flex flexDirection="column" p="10">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
            {({
              // most of the usefull available Formik props
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              setFieldValue,
              resetForm
            }) => (
              <Box as="form" onSubmit={handleSubmit as any}>
                <Stack spacing={5}>
                  <InputControl name="Username" label="Username" />
                  <InputControl name="FirstName" label="First name" />
                  <InputControl name="LastName" label="Last name" />
                  <InputControl name="Email" label="Email" />
                  <InputControl name="Phone" label="Phone" />
                  <SwitchControl name="Active" label="Active" />
                  {/* {isAddMode && (  This has been commented to fix a validation bug duing update */}
                  <>
                    <label htmlFor="Password">Password</label>
                    <Box position="relative">
                      <Field
                        style={{width: "100%"}}
                        label="Password"
                        name="Password"
                        pr="4.5rem"
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                      />
                      <Button position="absolute" right="2px" top="2px" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                      </Button>
                    </Box>
                    <ErrorMessage name="Password" />
                    <label htmlFor="ConfirmPassword">Confirm Password</label>
                    <Field
                      label="Confirm Password"
                      name="ConfirmPassword"
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <ErrorMessage name="ConfirmPassword" />
                  </>
                  {/* )} */}
                  <ButtonGroup>
                    <Button variant="primaryButton" type="submit" isLoading={isSubmitting}>
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        resetForm()
                      }}
                      type="reset"
                      variant="secondaryButton"
                      isLoading={isSubmitting}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => router.back()} variant="secondaryButton" isLoading={isSubmitting}>
                      Cancel
                    </Button>
                  </ButtonGroup>
                </Stack>
              </Box>
            )}
          </Formik>
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
        </>
      )}
    </>
  )
}
