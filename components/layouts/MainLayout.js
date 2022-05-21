import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Seo from "@/components/common/Seo";

const Layout = ({ title, description, children, ...rest }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Seo subtitle={title} description={description} />
      <div className="flex flex-col w-full" {...rest}>
        <Header />
        <div className="my-0">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
