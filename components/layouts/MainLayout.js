import Head from "next/head";
import Header from "@/components/common/Header";
import Seo from "@/components/common/Seo";
import { Toaster } from "react-hot-toast";

const Layout = ({ title, description, children, ...rest }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Seo subtitle={title} description={description} />
      <div className="flex flex-col w-full bg-st-dark-blue" {...rest}>
        <Toaster position="bottom-center" />
        <Header fixed={true} />
        <div className="my-0 pt-20">{children}</div>
      </div>
    </>
  );
};

export default Layout;
