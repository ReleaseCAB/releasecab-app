import Head from "next/head";

import Footer from "./Footer";
export const Layout = ({ children, title, showfooter = "true" }) => {
  const pageTitle = title ? `${title} | Release CAB` : "Release CAB";
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {children}
      {showfooter === "true" && <Footer />}
    </>
  );
};
