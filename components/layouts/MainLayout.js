import Head from "next/head";
import Header from "@/components/common/Header";
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
      </div>
    </>
  );
};

export default Layout;
