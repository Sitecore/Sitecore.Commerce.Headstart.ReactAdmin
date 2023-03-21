import React, {useEffect, useState} from "react"
import {useRouter} from "hooks/useRouter"
import {Breadcrumb, BreadcrumbItem, BreadcrumbLink} from "@chakra-ui/react"
import Link from "next/link"
import {ChevronRightIcon} from "@chakra-ui/icons"

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
  const linkSecondaryColor = "gray.400"

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
    <Breadcrumb separator={<ChevronRightIcon color={linkSecondaryColor} />}>
      <BreadcrumbItem>
        <Link passHref href="/dashboard">
          <BreadcrumbLink as="a" color={linkSecondaryColor}>
            Home
          </BreadcrumbLink>
        </Link>
      </BreadcrumbItem>
      {breadcrumbs
        .filter((breadcrumb) => breadcrumb && breadcrumb.href)
        .map((breadcrumb, index, breadcrumbs) => {
          const isLastBreadcrumb = breadcrumbs.length - 1 === index
          return (
            <BreadcrumbItem key={index}>
              <Link passHref href={breadcrumb.href}>
                <BreadcrumbLink
                  as="a"
                  color={isLastBreadcrumb ? "initial" : linkSecondaryColor}
                  pointerEvents={isLastBreadcrumb ? "none" : "initial"}
                  isCurrentPage={isLastBreadcrumb}
                >
                  {breadcrumb.text}
                </BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
          )
        })}
    </Breadcrumb>
  )
}
