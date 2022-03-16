import Head from "next/head";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const Layout = ({ children, ...rest }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col w-full" {...rest}>
        <Header />
        <div className="my-0">{children}</div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
