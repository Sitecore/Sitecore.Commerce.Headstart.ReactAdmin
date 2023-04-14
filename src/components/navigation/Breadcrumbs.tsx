import React, { useEffect, useState } from "react"
import { useRouter } from "hooks/useRouter"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, useColorModeValue } from "@chakra-ui/react"
import NextLink from "next/link"
import { ChevronRightIcon } from "@chakra-ui/icons"
import { TbDashboard, TbHome, TbLayout } from "react-icons/tb"
import Dashboard from "@/pages/dashboard"
import { Link } from "./Link"

export interface Breadcrumb {
  text: string
  href: string
}

/**
 * renders a dynamic Breadcrumb navigation based on the current path
 */
export const Breadcrumbs = () => {
  const router = useRouter()
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([])
  const activeBreadcrumbColor = useColorModeValue("primary.500", "primary.50")

  const getTextFromPath = (path: string) => {
    const text = path.split(/[?#]/)[0] // removes query params and hash params
    const capitalize = text[0].toUpperCase() + text.substring(1) // capitalize text
    return decodeURI(capitalize) // decode for utf-8 characters and return ascii
  }

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split("/")
      linkPath.shift()

      const breadcrumbsdata = linkPath.map((path, i) => {
        return {
          href: "/" + linkPath.slice(0, i + 1).join("/"),
          text: getTextFromPath(path)
        }
      })

      setBreadcrumbs(breadcrumbsdata)
    }
  }, [router])

  if (!breadcrumbs) {
    return null
  }

  return (
    <Breadcrumb separator={<ChevronRightIcon mt="-3px" opacity=".35" />}>
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} href="/dashboard" display="flex" alignItems={"center"} fontSize="sm">
          <TbLayout style={{ marginRight: "5px" }} /> Dashboard
        </BreadcrumbLink>
      </BreadcrumbItem>
      {breadcrumbs
        .filter((breadcrumb) => breadcrumb && breadcrumb.href)
        .map((breadcrumb, index, breadcrumbs) => {
          const isLastBreadcrumb = breadcrumbs.length - 1 === index
          return (
            <BreadcrumbItem key={index}>
              <BreadcrumbLink
                fontSize="sm"
                as={Link}
                href={breadcrumb.href}
                color={isLastBreadcrumb && activeBreadcrumbColor}
                pointerEvents={isLastBreadcrumb ? "none" : "initial"}
                isCurrentPage={isLastBreadcrumb}
              >
                {breadcrumb.text}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
    </Breadcrumb>
  )
}
