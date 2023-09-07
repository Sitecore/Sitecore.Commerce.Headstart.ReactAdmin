/*
 * Usage:
 *   const { alert, confirm, prompt } = useModals()
 *   alert("Hey!") // awaitable too
 *   if (await confirm("Are you sure?")) ...
 *   const result = await prompt("Enter a URL")
 */

import {
  Button,
  Flex,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text
} from "@chakra-ui/react"
import {createContext, ReactNode, useCallback, useContext, useRef, useState} from "react"

enum ModalType {
  Alert,
  Confirm,
  Prompt
}

export type Modals = {
  alert: (message: string | ReactNode, opts?: ModalOpenerProps) => Promise<boolean | null>
  confirm: (message: string | ReactNode, opts?: ModalOpenerProps) => Promise<boolean | null>
  prompt: (
    message: string | ReactNode,
    opts?: ModalOpenerProps & {
      defaultValue?: string
    }
  ) => Promise<string | null>
}

export type ModalOpenerProps = {
  okText?: string
  cancelText?: string
  icon?: ReactNode
  modalProps?: Partial<React.ComponentProps<typeof Modal>>
  okButtonProps?: Partial<React.ComponentProps<typeof Button>>
  cancelButtonProps?: Partial<React.ComponentProps<typeof Button>>
}

const defaultContext: Modals = {
  alert() {
    throw new Error("<ModalProvider> is missing")
  },
  confirm() {
    throw new Error("<ModalProvider> is missing")
  },
  prompt() {
    throw new Error("<ModalProvider> is missing")
  }
}

const Context = createContext<Modals>(defaultContext)

interface AnyEvent {
  preventDefault(): void
}

export const ModalProvider = ({children}: {children: ReactNode}) => {
  const [modal, setModal] = useState<ReactNode | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const ok = useRef<HTMLButtonElement>(null)

  const createOpener = useCallback(
    (type: ModalType) =>
      (message: string, opts: ModalOpenerProps & {defaultValue?: string} = {}) =>
        new Promise<boolean | string | undefined>((resolve) => {
          const handleClose = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            resolve(undefined)
          }

          const handleCancel = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) {
              resolve(undefined)
            } else {
              resolve(false)
            }
          }

          const handleOK = (e?: AnyEvent) => {
            e?.preventDefault()
            setModal(null)
            if (type === ModalType.Prompt) {
              resolve(input.current?.value)
            } else {
              resolve(true)
            }
          }

          setModal(
            <Modal
              isOpen={true}
              onClose={handleClose}
              initialFocusRef={type === ModalType.Prompt ? input : ok}
              {...opts.modalProps}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalBody mt={5}>
                  <Flex gap={4} alignItems="center">
                    {opts.icon}
                    <Stack spacing={5}>
                      <Text>{message}</Text>
                      {type === ModalType.Prompt && <Input ref={input} defaultValue={opts.defaultValue} />}
                    </Stack>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <HStack justifyContent="space-between" width="full">
                    {type !== ModalType.Alert && (
                      <Button mr={3} variant="outline" onClick={handleCancel} {...opts.cancelButtonProps}>
                        {opts.cancelText ?? "Cancel"}
                      </Button>
                    )}
                    <Button onClick={handleOK} ref={ok} colorScheme="primary" {...opts.okButtonProps}>
                      {opts.okText ?? "OK"}
                    </Button>
                  </HStack>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )
        }),
    []
  )

  return (
    <Context.Provider
      value={
        {
          alert: createOpener(ModalType.Alert),
          confirm: createOpener(ModalType.Confirm),
          prompt: createOpener(ModalType.Prompt)
        } as Modals
      }
    >
      {children}
      {modal}
    </Context.Provider>
  )
}

const useAwaitableModal = () => useContext(Context)

export default useAwaitableModal
