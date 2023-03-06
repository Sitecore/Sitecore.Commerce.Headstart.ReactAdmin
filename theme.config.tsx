import {DocsThemeConfig} from "nextra-theme-docs"
import React from "react"

const config: DocsThemeConfig = {
  project: {
    link: "https://github.com/SitecoreNA/sitecore-commerce/tree/development/src"
  },
  docsRepositoryBase: "https://github.com/SitecoreNA/sitecore-commerce/tree/development/src", // base URL for the docs repository - this will only work for team with access to the private repo.
  navigation: {
    next: true,
    prev: true
  },
  darkMode: true,
  footer: {
    text: `MIT ${new Date().getFullYear()} ©Sitecore.`
  },
  editLink: {
    text: `Edit this page on GitHub`
  },
  logo: (
    <>
      <span>Sitecore Commerce Seller App</span>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Sitecore Commerce Seller App: Documentation" />
      <meta name="og:title" content="Sitecore Commerce Seller App: Documentation" />
    </>
  ),
  i18n: []
}

export default config
