import {PLACEHOLDER_ID} from "@/components/security-profiles/assignments/SecurityProfileAssignmentList"
import {sortBy, uniq, uniqBy} from "lodash"
import {
  AdminUserGroups,
  Buyers,
  SecurityProfile,
  SecurityProfileAssignment,
  SecurityProfiles,
  SupplierUserGroups,
  Suppliers,
  UserGroups
} from "ordercloud-javascript-sdk"
import {useCallback, useEffect, useState} from "react"
import {IAdminUserGroup} from "types/ordercloud/IAdminUserGroup"
import {IBuyer} from "types/ordercloud/IBuyer"
import {IBuyerUserGroup} from "types/ordercloud/IBuyerUserGroup"
import {ISupplier} from "types/ordercloud/ISupplier"
import {ISupplierUserGroup} from "types/ordercloud/ISupplierUserGroup"
import {SecurityProfileAssignmentLevel} from "types/ordercloud/SecurityProfileAssignmentLevel"

interface BuyerGroupData {
  userGroup: IBuyerUserGroup
  buyerID: string
}

interface SupplierGroupData {
  userGroup: ISupplierUserGroup
  supplierID: string
}

interface RowData {
  securityProfile: SecurityProfile
  assignments: SecurityProfileAssignment[]
  inheritedAssignedParties: {
    buyer?: IBuyer
    supplier?: ISupplier
    admin?: boolean
    buyerUserGroups?: BuyerGroupData[]
    supplierUserGroups?: SupplierGroupData[]
    adminUserGroups?: IAdminUserGroup[]
  }
  isInherited: boolean
  isAssignedAtCurrentLevel: boolean
}

interface RelatedData {
  securityProfiles: SecurityProfile[]
  buyers: IBuyer[]
  suppliers: ISupplier[]
  buyerUserGroups: BuyerGroupData[]
  supplierUserGroups: SupplierGroupData[]
  adminUserGroups: IAdminUserGroup[]
}

interface UseSecurityProfileAssignmentRowsProps {
  assignments: SecurityProfileAssignment[]
  assignmentLevel: SecurityProfileAssignmentLevel
  commerceRole: "buyer" | "supplier" | "admin"
}

export function useSecurityProfileAssignmentRows({
  assignments,
  assignmentLevel,
  commerceRole
}: UseSecurityProfileAssignmentRowsProps) {
  const [profiles, setProfiles] = useState([] as SecurityProfile[])
  const [buyers, setBuyers] = useState([] as IBuyer[])
  const [suppliers, setSuppliers] = useState([] as ISupplier[])
  const [rows, setRows] = useState<RowData[]>([])

  const hasAssignmentAtLevel = useCallback(
    (assignment: SecurityProfileAssignment, level: SecurityProfileAssignmentLevel): boolean => {
      switch (level) {
        case "user":
          return Boolean(assignment.UserID)
        case "group":
          return Boolean(assignment.UserGroupID)
        case "company":
          if (commerceRole === "buyer") {
            return assignment.BuyerID && !assignment.UserGroupID && !assignment.UserID
          } else if (commerceRole === "supplier") {
            return assignment.SupplierID && !assignment.UserGroupID && !assignment.UserID
          } else {
            return !assignment.BuyerID && !assignment.SupplierID && !assignment.UserGroupID && !assignment.UserID
          }
      }
    },
    [commerceRole]
  )

  const getAssignmentsAtLevel = useCallback(
    (assignments: SecurityProfileAssignment[], level: SecurityProfileAssignmentLevel) => {
      return assignments.filter((assignment) => hasAssignmentAtLevel(assignment, level))
    },
    [hasAssignmentAtLevel]
  )

  const getSecurityProfiles = useCallback(async () => {
    if (profiles?.length) {
      // we get all security profiles upfront so this doesn't need to be called again
      return profiles
    }
    const securityProfilesList = await SecurityProfiles.List({
      pageSize: 100
    })
    const _securityProfiles = securityProfilesList.Items
    setProfiles(_securityProfiles)
    return _securityProfiles
  }, [profiles])

  const getBuyers = useCallback(async () => {
    if (commerceRole !== "buyer") {
      return []
    }
    const relevantAssignments = getAssignmentsAtLevel(assignments, "company").filter(
      // This ID means the buyer hasn't been created yet, so no need to retrive
      (assignment) => assignment.BuyerID !== PLACEHOLDER_ID
    )
    if (!relevantAssignments.length) {
      return []
    }
    const alreadyHasBuyers = relevantAssignments.every((assignment) =>
      buyers.map((b) => b.ID).includes(assignment.BuyerID)
    )
    if (alreadyHasBuyers) {
      // no need to make an api call if we already have the buyers
      return buyers
    }

    const buyerIds = uniq(relevantAssignments.map((assignment) => assignment.BuyerID))
    if (!buyerIds.length) {
      return []
    }
    const buyerList = await Buyers.List({pageSize: 100, filters: {ID: buyerIds.join("|")}})
    const _buyers = buyerList.Items
    setBuyers(_buyers)
    return _buyers
  }, [commerceRole, assignments, getAssignmentsAtLevel, buyers])

  const getSuppliers = useCallback(async () => {
    if (commerceRole !== "supplier") {
      return []
    }
    const relevantAssignments = getAssignmentsAtLevel(assignments, "company").filter(
      // This ID means the supplier hasn't been created yet, so no need to retrive
      (assignment) => assignment.SupplierID !== PLACEHOLDER_ID
    )
    if (!relevantAssignments.length) {
      return []
    }
    const alreadyHasSuppliers = relevantAssignments.every((assignment) =>
      suppliers.map((s) => s.ID).includes(assignment.SupplierID)
    )
    if (alreadyHasSuppliers) {
      // no need to make an api call if we already have the suppliers
      return suppliers
    }

    const supplierIds = uniq(relevantAssignments.map((assignment) => assignment.SupplierID))
    if (!supplierIds.length) {
      return []
    }
    const supplierList = await Suppliers.List({pageSize: 100, filters: {ID: supplierIds.join("|")}})
    const _suppliers = supplierList.Items
    setSuppliers(_suppliers)
    return _suppliers
  }, [commerceRole, assignments, getAssignmentsAtLevel, suppliers])

  const getBuyerUserGroups = useCallback(async () => {
    if (commerceRole !== "buyer" || assignmentLevel !== "user") {
      return []
    }
    const relevantAssignments = getAssignmentsAtLevel(assignments, "group").filter(
      // This ID means the usergroup hasn't been created yet, so no need to retrive
      (assignment) => assignment.UserGroupID !== PLACEHOLDER_ID
    )
    if (!relevantAssignments.length) {
      return []
    }
    const buyerUserGroupRequests = relevantAssignments.map(async (assignment) => {
      const userGroup = await UserGroups.Get(assignment.BuyerID, assignment.UserGroupID)
      return {userGroup, buyerID: assignment.BuyerID}
    })
    return await Promise.all(buyerUserGroupRequests)
  }, [commerceRole, assignmentLevel, assignments, getAssignmentsAtLevel])

  const getSupplierUserGroups = useCallback(async () => {
    if (commerceRole !== "supplier" || assignmentLevel !== "user") {
      return []
    }
    const relevantAssignments = getAssignmentsAtLevel(assignments, "group").filter(
      // This ID means the usergroup hasn't been created yet, so no need to retrive
      (assignment) => assignment.UserGroupID !== PLACEHOLDER_ID
    )
    if (!relevantAssignments.length) {
      return [] as SupplierGroupData[]
    }
    const supplierGroupRequests = relevantAssignments.map(async (assignment) => {
      const userGroup = await SupplierUserGroups.Get(assignment.SupplierID, assignment.UserGroupID)
      return {userGroup, supplierID: assignment.SupplierID}
    })
    return await Promise.all(supplierGroupRequests)
  }, [commerceRole, assignmentLevel, assignments, getAssignmentsAtLevel])

  const getAdminUserGroups = useCallback(async () => {
    if (commerceRole !== "admin") {
      return
    }
    const relevantAssignments = getAssignmentsAtLevel(assignments, "group").filter(
      // This ID means the usergroup hasn't been created yet, so no need to retrive
      (assignment) => assignment.UserGroupID !== PLACEHOLDER_ID
    )
    if (!relevantAssignments.length) {
      return []
    }
    const adminUserGroupRequests = relevantAssignments.map((assignment) => AdminUserGroups.Get(assignment.UserGroupID))
    return await Promise.all(adminUserGroupRequests)
  }, [commerceRole, assignments, getAssignmentsAtLevel])

  const updateInheritedAssignedParties = useCallback(
    (
      assignment: SecurityProfileAssignment,
      inheritedAssignedParties: RowData["inheritedAssignedParties"],
      relatedData: RelatedData
    ): RowData["inheritedAssignedParties"] => {
      if (hasAssignmentAtLevel(assignment, "company")) {
        if (commerceRole === "buyer") {
          inheritedAssignedParties.buyer = relatedData.buyers.find((b) => b.ID === assignment.BuyerID)
        } else if (commerceRole === "supplier") {
          inheritedAssignedParties.supplier = relatedData.suppliers.find((s) => s.ID === assignment.SupplierID)
        } else {
          inheritedAssignedParties.admin = true
        }
      } else if (hasAssignmentAtLevel(assignment, "group")) {
        if (commerceRole === "buyer") {
          const additionalGroups = relatedData.buyerUserGroups.filter(
            (g) => g.userGroup.ID === assignment.UserGroupID && g.buyerID === assignment.BuyerID
          )
          const updatedGroups = [...(inheritedAssignedParties.buyerUserGroups || []), ...additionalGroups]
          const uniqueGroups = uniqBy(updatedGroups, (g) => g.userGroup.ID + g.buyerID)
          inheritedAssignedParties.buyerUserGroups = uniqueGroups
        } else if (commerceRole === "supplier") {
          const additionalGroups = relatedData.supplierUserGroups.filter(
            (g) => g.userGroup.ID === assignment.UserGroupID && g.supplierID === assignment.SupplierID
          )
          const updatedGroups = [...(inheritedAssignedParties.supplierUserGroups || []), ...additionalGroups]
          const uniqueGroups = uniqBy(updatedGroups, (g) => g.userGroup.ID + g.supplierID)
          inheritedAssignedParties.supplierUserGroups = uniqueGroups
        } else {
          const additionalGroups = relatedData.adminUserGroups.filter((g) => g.ID === assignment.UserGroupID)
          const updatedGroups = [...(inheritedAssignedParties.adminUserGroups || []), ...additionalGroups]
          const uniqueGroups = uniqBy(updatedGroups, (group) => group.ID)
          inheritedAssignedParties.adminUserGroups = uniqueGroups
        }
      }

      return inheritedAssignedParties
    },
    [commerceRole, hasAssignmentAtLevel]
  )

  useEffect(() => {
    const initialize = async () => {
      const [securityProfiles, buyerUserGroups, supplierUserGroups, adminUserGroups, buyers, suppliers] =
        await Promise.all([
          getSecurityProfiles(),
          getBuyerUserGroups(),
          getSupplierUserGroups(),
          getAdminUserGroups(),
          getBuyers(),
          getSuppliers()
        ])

      const relatedData: RelatedData = {
        securityProfiles,
        buyerUserGroups,
        supplierUserGroups,
        adminUserGroups,
        buyers,
        suppliers
      }
      const _rows: RowData[] = relatedData.securityProfiles.map((securityProfile) => {
        return {
          securityProfile: securityProfile,
          assignments: [],
          isInherited: false,
          isAssignedAtCurrentLevel: false,
          inheritedAssignedParties: {}
        }
      })
      assignments.forEach((assignment) => {
        const isInherited = !hasAssignmentAtLevel(assignment, assignmentLevel)
        const row = _rows.find((row) => row.securityProfile.ID === assignment.SecurityProfileID)
        if (row) {
          row.assignments.push(assignment)
          row.isAssignedAtCurrentLevel = row.isAssignedAtCurrentLevel || !isInherited
          row.isInherited = row.isInherited || isInherited
          row.inheritedAssignedParties = updateInheritedAssignedParties(
            assignment,
            row.inheritedAssignedParties,
            relatedData
          )
        }
      })
      setRows(sortBy(_rows, (row) => row.securityProfile.Name))
    }
    initialize()
  }, [
    getAdminUserGroups,
    getBuyerUserGroups,
    getBuyers,
    getSuppliers,
    getSecurityProfiles,
    getSupplierUserGroups,
    hasAssignmentAtLevel,
    assignmentLevel,
    assignments,
    updateInheritedAssignedParties
  ])

  return {rows}
}
