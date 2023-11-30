/* eslint-disable react/jsx-props-no-spreading */

import "react-querybuilder/dist/query-builder.css"
import "./react-querybuilder-validation.css"
import type {AppProps} from "next/app"
import {Chakra} from "components/Chakra"
import {DefaultSeo} from "next-seo"
import Head from "next/head"
import Layout from "components/layout/Layout"
import {ProtectedApp} from "components/auth/ProtectedApp"
import {SetConfiguration} from "../services/ordercloud.service"
import {axiosService} from "services/axios.service"
import defaultSEOConfig from "../../next-seo.config"
import dynamic from "next/dynamic"
import "overlayscrollbars/overlayscrollbars.css"
import {ModalProvider} from "hooks/useAwaitableModals"

axiosService.initializeInterceptors()
SetConfiguration()

//This fixes a the hydration error on first page load of base URL
const DynamicAuthProvider = dynamic(() => import("context/auth-context").then((mod) => mod.AuthProvider), {
  ssr: false
})

const MyApp = ({Component, pageProps, ...appProps}: AppProps) => {
  return (
    <Chakra>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
      </Head>
      <DefaultSeo {...defaultSEOConfig} />
      <DynamicAuthProvider>
        <ProtectedApp>
          <Layout {...pageProps}>
            <ModalProvider>
              <Component {...pageProps} />
            </ModalProvider>
          </Layout>
        </ProtectedApp>
      </DynamicAuthProvider>
    </Chakra>
  )
}

export default MyApp
