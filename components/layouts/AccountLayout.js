import Link from "next/link";
import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import NoAccessErrorPage from "@/components/errors/NoAccessErrorPage";
import LoadingCircle from "@/components/common/LoadingCircle";
import { CogIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import classNames from "@/utils/classNames";

const AccountLayout = ({ title, children, ...props }) => {
  const router = useRouter();
  const { status } = useSession();

  const navigation = [
    {
      name: "Configuración",
      href: "/user/profile",
      icon: CogIcon,
      current: false,
    },
  ];

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingCircle color="#000000" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <NoAccessErrorPage />;
  }

  return <>
    <Head>
      <title>{title ? `Mi Cuenta | ${title}` : "Mi Cuenta"}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="min-h-full h-full">
      <div className="flex flex-col w-full bg-gray-100 " {...props}>
        <Header />
        <div className="w-full max-w-7xl  mx-auto  ">
          <div className="max-w-7xl w-full py-6 sm:px-6  ">
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
              <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
                <div className="layouttitle  w-full flex items-center justify-start pb-2">
                  <p className="font-bold">Mi Cuenta</p>
                </div>
                <nav className="space-y-1">
                  {navigation.map((item) => {
                    if (router.pathname.includes(item.href)) {
                      item.current = true;
                    }
                    return (
                      (<Link
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "bg-gray-50 text-selectedtxt hover:text-selectedtxt hover:bg-white"
                            : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                          "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                        )}
                        aria-current={item.current ? "page" : undefined}>

                        <item.icon
                          className={classNames(
                            item.current
                              ? "text-selectedtxt group-hover:text-selectedtxt"
                              : "text-gray-400 group-hover:text-gray-500",
                            "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                          )}
                          aria-hidden="true"
                        />
                        <span className="truncate">{item.name}</span>

                      </Link>)
                    );
                  })}
                </nav>
              </aside>

              <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
                {children}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </>;
};

export default AccountLayout;
