import { Provider, useAppBridge } from "@shopify/app-bridge-react";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import ApolloClient from "apollo-boost";
import App from "next/app";
import { ApolloProvider } from "react-apollo";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import "../styles/tailwind.css";

function MyProvider(props) {
  const app = useAppBridge();
  const authenticatedFetch = useAuthenticatedFetch(app);

  const client = new ApolloClient({
    fetch: authenticatedFetch,
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  return (
    <ApolloProvider client={client}>
      <Component {...props} />
    </ApolloProvider>
  );
}

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;

    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
