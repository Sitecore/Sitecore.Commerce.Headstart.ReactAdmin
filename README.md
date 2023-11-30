# Sitecore Headstart React Admin

Welcome to the Sitecore Headstart React Admin, an open-source admin application for Sitecore OrderCloud built with React. Whether you're looking to explore how admin applications are constructed or kickstart your own custom solution, this project provides a valuable resource.

> **Important Note:** This application is intended for demonstration and learning purposes and is not production-ready.

## About Sitecore OrderCloud?

[OrderCloud](https://ordercloud.io/discover/platform-overview) is a versatile commerce and marketplace development platform, offering limitless customizations and API-first, headless eCommerce architecture

## Features

The Sitecore Headstart React Admin application is a powerful and flexible tool built on top of the Sitecore OrderCloud API and Javascript SDK. It utilizes:

- React
- Next.JS
- Typescript
- Chakra UI
- Various toolings for linting, formatting, and conventions

## Commerce Features

These are the currently implemented features:

- Admin products including products, product facets, prices, and catalogs (both as admin users and suppliers)
- Admin promotions
- Admin buyers including users and usergroups
- Admin suppliers including users, usergroups, and addresses
- Admin and assign security profiles (controls visibility of admin applciation)
- Fulfill orders - including managing orders and order returns

Check out our roadmap for upcoming features

## Requirements

An OrderCloud Marketplace (https://portal.ordercloud.io) with the following (minimum):

- An admin api client _without_ client secret defined
- An admin user with the [correct permissions](https://github.com/Sitecore/Sitecore.Commerce.Headstart.ReactAdmin/blob/development/src/config/app-permissions.config.ts#L71) (or FullAccess)

## How do I get started?

Using the Deploy Button below, you'll deploy on Vercel the Next.js project as well as connect it to your Sitecore Commerce OrderCloud Marketplace.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSitecore%2FSitecore.Commerce.Headstart.ReactAdmin&env=NEXT_PUBLIC_APP_NAME,NEXT_PUBLIC_OC_CLIENT_ID,NEXT_PUBLIC_OC_API_URL,NEXT_PUBLIC_OC_MARKETPLACE_ID,NEXT_PUBLIC_OC_MARKETPLACE_NAME,NEXT_PUBLIC_USE_REAL_DASHBOARD_DATA&project-name=sitecore-commerce-headstart-reactadmin&repository-name=Sitecore.Commerce.Headstart.ReactAdmin&demo-title=OrderCloud%20Admin%20App&demo-description=An%20ecommerce%20admin%20app%20built%20on%20Sitecore%20OrderCloud&demo-url=sitecore-commerce-headstart-react-admin.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FSitecore%2FSitecore.Commerce.Headstart.ReactAdmin%2Fmain%2Fpublic%2Fimages%2Fdemo-image.png)

## Working locally

1. Using this repository as a template, create a new repository.
2. Clone your new repository locally
3. Copy the `.env.local.example` file in the root directory to `.env.local` (ignored by default during your next Git commit):

```bash
# Copy the template .env.local.example to .env.local
cp .env.local.example .env.local
```

Then set each variable on `.env.local`:

| Variable                            | Description                                                                                                       |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_APP_NAME`              | Name of the application title used on page title                                                                  |
| `NEXT_PUBLIC_OC_CLIENT_ID`          | Admin Client ID                                                                                                   |
| `NEXT_PUBLIC_OC_API_URL`            | Base OrderCloud API URL (varies based on region/environment check portal)                                         |
| `NEXT_PUBLIC_OC_MARKETPLACE_ID`     | The ID for your OrderCloud Marketplace                                                                            |
| `NEXT_PUBLIC_OC_MARKETPLACE_NAME`   | The name for your OrderCloud Marketplace                                                                          |
| `NEXT_PUBLIC_THEME_COLOR_PRIMARY`   | The primary theme color hex code (optional)                                                                       |
| `NEXT_PUBLIC_THEME_COLOR_SECONDARY` | The secondary theme color hex code (optional)                                                                     |
| `NEXT_PUBLIC_THEME_COLOR_ACCENT`    | The accent theme color hex code (optional)                                                                        |
| `NEXT_PUBLIC_THEME_FONT_HEADING`    | The font used for heading text (optional) must be one of the [available google fonts](./src/utils//font.utils.ts) |
| `NEXT_PUBLIC_THEME_FONT_BODY`       | The font used for body text (optional) must be one of the [available google fonts](./src/utils//font.utils.ts)    |
| `NEXT_PUBLIC_THEME_LOGO_URL`        | The URL to your logo (optional)                                                                                   |

Your `.env.local` file should look something like this:

```bash
NEXT_PUBLIC_APP_NAME='Sitecore Commerce Admin App'
NEXT_PUBLIC_OC_CLIENT_ID='****0BAC-****-4711-B01F-1A**4F7*****'
NEXT_PUBLIC_OC_API_URL='https://sandboxapi.ordercloud.io'
NEXT_PUBLIC_OC_MARKETPLACE_ID='SitecoreCommerce'
NEXT_PUBLIC_OC_MARKETPLACE_NAME='Sitecore Commerce'
```

3. Run Next.js in development mode

```bash
npm install
npm run dev
```

Your app should be up and running on [http://localhost:3000](http://localhost:3000)!

### Seeding a new marketplace

There are scenarios where having your own marketplace becomes essential. Whether you're initiating a new project, creating data for a specific workflow, or safeguarding against unwanted data changes before a demo, we've simplified the process for you. Our application includes a convenient command-line feature for generating two types of marketplaces.

#### Minimal Marketplace

The first option is a minimal marketplace, featuring only the essential configurations such as API Clients, security profiles, and initial login details. We recommend choosing this option when you are starting a new project, providing a streamlined foundation to build upon.

To generate a minimal marketplace, run the following command:

```bash
npm run seed-minimal -- -u=YOUR_PORTAL_USERNAME -p=YOUR_PORTAL_PASSWORD -n=YOUR_MARKETPLACE_NAME
```

#### Playshop Marketplace

The second option crafts a B2C-style marketplace, pre-populated with products from the [PlayShop demo](https://github.com/Sitecore/Sitecore.Demo.Edge). Opt for this option to quickly explore the capabilities of the admin application without the need to manually set up extensive data. This option is particularly handy for demo purposes.

To generate a B2C-style marketplace with PlayShop demo data, run the following command:

```bash
npm run seed-playshop -- -u=YOUR_PORTAL_USERNAME -p=YOUR_PORTAL_PASSWORD -n=YOUR_MARKETPLACE_NAME
```

#### Configuration Details

After generating the marketplace, complete the setup by filling out your .env.local file with the relevant information from your newly created marketplace. You can then run the application locally by executing:

```bash
npm run dev
```

Log in as `initialadminuser` with the password `Testingsetup123!` to explore the functionalities of the admin application. When creating new admin users, ensure you assign them a security profile for proper access.

These options empower you to kickstart your projects or explore the application's capabilities effortlessly.

### Unit Tests

This project uses [Jest](https://jestjs.io/) for unit testing. To write a unit test:

1. Create a file under either test/components or tests/pages that ends in .test.tsx (so it gets picked up by test runner)
2. Write your unit test
3. Run unit tests by running the command `npm test`

### Deploy on Vercel

To deploy your local project to Vercel, push it to public GitHub/GitLab/Bitbucket repository then [import to Vercel](https://vercel.com/new?utm_source=github&utm_medium=readme&utm_campaign=next-example).

### Questions or New Ideas?

Check out the [Discussion board](https://github.com/Sitecore/Sitecore.Commerce.Headstart.ReactAdmin/discussions). You ask questions or suggest answers in our [Q&A](https://github.com/Sitecore/Sitecore.Commerce.Headstart.ReactAdmin/discussions/categories/q-a) board.

---

## Contributing Guide

Check out our [Contributing](./CONTRIBUTING.md) guide.

## Changelog

Changes from release-to-release are tracked in the [Changelog wiki page](https://github.com/Sitecore/Sitecore.Commerce.Headstart.ReactAdmin/wiki/Changelog).

## Roadmap

Larger roadmap items are outlined in the [project milestones](https://github.com/Sitecore/Sitecore.Commerce.Headstart.ReactAdmin/milestones)

## References

- [OrderCloud Javascript SDK](https://www.npmjs.com/package/ordercloud-javascript-sdk)
- [OrderCloud API Reference](https://ordercloud.io/api-reference)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [Chakra UI](https://chakra-ui.com)
- [TypeScript](https://www.typescriptlang.org)
