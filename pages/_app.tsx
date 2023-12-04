import { ConfigProvider } from "antd";
import "antd/dist/reset.css";
import type { AppProps } from "next/app";
import Layout from "./layout";
import "./styles/global.css";

function MyApp({ Component, pageProps, router }: AppProps) {
  if (router.pathname.startsWith('/auth/')) {
    return (
      <ConfigProvider
      theme={{
        token: {
          // Seed Token
          // colorPrimary: "#31C1F3",
          borderRadius: 2,

          // Alias Token
          // colorBgContainer: "#f6ffed",
        },
      }}
    > 
        <Component {...pageProps} />
    </ConfigProvider>
    )
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          // colorPrimary: "#31C1F3",
          borderRadius: 2,

          // Alias Token
          // colorBgContainer: "#f6ffed",
        },
      }}
    > 
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  );
}

export default MyApp;
