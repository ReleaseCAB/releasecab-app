import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { persistor, store } from "../redux/store";

import "../styles/releasecab.scss";

const colors = {
  brand: {
    gray_bg: "#E6F4F7",
    gray_text: "gray",
    black_text: "black",
    white_text: "#FFFFFF",
    button_enabled: "#0077B3",
    button_disabled: "gray",
    link_blue: "teal",
    secondary_blue: "#0088CC",
    warning: "red",
  },
};

const textTheme = {
  xs: {
    fontSize: "10px",
    fontWeight: "normal",
    lineHeight: "1.2",
  },
  sm: {
    fontSize: "12px",
    fontWeight: "normal",
    lineHeight: "1.4",
  },
  md: {
    fontSize: "16px",
    fontWeight: "normal",
    lineHeight: "1.4",
  },
  lg: {
    fontSize: "18px",
    fontWeight: "normal",
    lineHeight: "1.4",
  },
  xl: {
    fontSize: "26px",
    fontWeight: "normal",
    lineHeight: "1.4",
  },
  xxl: {
    fontSize: "32px",
    fontWeight: "normal",
    lineHeight: "1.4",
  },
};

const theme = extendTheme({ colors, textStyles: textTheme });

function ReleaseCab({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </PersistGate>
    </Provider>
  );
}

export default ReleaseCab;
