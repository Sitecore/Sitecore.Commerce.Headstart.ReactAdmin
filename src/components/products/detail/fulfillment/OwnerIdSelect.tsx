import {BaseProps, SelectControl} from "@/components/react-hook-form"
import {appSettings} from "config/app-settings"
import {useAuth} from "hooks/useAuth"
import {Suppliers} from "ordercloud-javascript-sdk"
import {useCallback} from "react"
import {Control} from "react-hook-form"

interface OwnerIdSelectProps extends Omit<BaseProps, "name"> {
  control: Control<any>
  validationSchema: any
  isCreatingNew?: boolean
}

export function OwnerIdSelect({control, validationSchema, isCreatingNew, ...baseProps}: OwnerIdSelectProps) {
  const {isAdmin} = useAuth()

  const getShipFromCompanyOptions = useCallback(async () => {
    const suppliers = await Suppliers.List()
    const supplierOptions = suppliers.Items.map((supplier) => ({
      label: `Supplier: ${supplier.ID}`,
      value: supplier.ID
    }))
    return [
      {
        label: "Admin",
        value: appSettings.marketplaceId
      },
      ...supplierOptions
    ]
  }, [])

  if (!isAdmin) {
    // Viewing the owner is only relevant for admins because suppliers
    // can only ever see their own products
    return
  }
  return (
    <SelectControl
      selectProps={{
        placeholder: "Select company",
        loadOptions: getShipFromCompanyOptions,
        chakraStyles: {
          container: (baseStyles) => ({...baseStyles, whiteSpace: "nowrap", minW: "350px"})
        }
      }}
      label="Owner"
      validationSchema={validationSchema}
      name="Product.OwnerID"
      control={control}
      isDisabled={!isCreatingNew}
      {...baseProps}
    />
  )
}
