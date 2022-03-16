import Head from "next/head";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import Seo from "@/components/common/seo";

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
