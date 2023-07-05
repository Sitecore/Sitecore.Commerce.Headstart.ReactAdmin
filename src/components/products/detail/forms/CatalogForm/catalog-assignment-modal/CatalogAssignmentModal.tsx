import { Button, ButtonProps, MenuItem, MenuItemProps, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react"
import { FC } from "react"
import { ProductCatalogAssignmentFieldValues } from "types/form/ProductCatalogAssignmentFieldValues"
import { CatalogAssignmentModalContent } from "./CatalogAssignmentModalContent"

interface CatalogAssignmentModalProps {
    onUpdate: (catalogs: ProductCatalogAssignmentFieldValues[]) => void
    onRemove: (index: number) => void
    catalogs?: ProductCatalogAssignmentFieldValues[]
    buttonProps?: ButtonProps
    menuItemProps?: MenuItemProps
    as: "button" | "menuitem"
    product?: string
}

const CatalogAssignmentModal: FC<CatalogAssignmentModalProps> = ({ buttonProps, menuItemProps, onUpdate, onRemove, catalogs, as, product}) => {
    const {isOpen, onOpen, onClose} = useDisclosure()

    const handleCancel = () => {
        onClose()
    }

    const onSubmit = (data: ProductCatalogAssignmentFieldValues[]) => {
        onUpdate(data)
        onClose()
      }

    return (
        <>
            {as === "button" ? (
                <Button {...buttonProps} onClick={onOpen}>
                {buttonProps.children || "Add catalog assignment"}
                </Button>
            ) : (
                <MenuItem onClick={onOpen} {...menuItemProps} />
            )}

            <Modal size="6xl" isOpen={isOpen} onClose={handleCancel}>
                <ModalOverlay />
                <ModalContent>
                    <CatalogAssignmentModalContent
                        catalogs={catalogs}
                        product={product}
                        onUpdate={onSubmit}
                        onCancelModal={handleCancel}
                        onRemove={onRemove}
                    ></CatalogAssignmentModalContent>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CatalogAssignmentModal;