import Link from "next/link";
import Head from "next/head";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import NoAccessErrorPage from "@/components/errors/NoAccessErrorPage";
import LoadingCircle from "@/components/common/LoadingCircle";
import classNames from "@/utils/classNames";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChartBarIcon, UsersIcon } from "@heroicons/react/outline";
import toast, { Toaster } from "react-hot-toast";

const AdminLayout = ({ title, children, ...props }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const navigation = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: ChartBarIcon,
      current: false,
    },
    {
      name: "Usuarios",
      href: "/admin/users",
      icon: UsersIcon,
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
    console.log("unauthenticated");
    return <NoAccessErrorPage />;
  }

  if (session.user.roles && !session.user.roles.includes("admin")) {
    console.log("No admin");
    return <NoAccessErrorPage />;
  }

  return (
    <>
      <Head>
        <title>{title ? `Dashboard | ${title}` : "Dashboard"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-full h-full">
        {/* to show errors and success alerts  */}
        <Toaster position="bottom-center" />

        <div className="flex flex-col w-full bg-gray-100 " {...props}>
          <Header />
          <div className="w-full max-w-7xl  mx-auto  ">
            <div className="max-w-7xl w-full py-6 sm:px-6  ">
              <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
                <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-2">
                  <div className="layouttitle  w-full flex items-center justify-start pb-2">
                    <p className="font-bold">Administrador</p>
                  </div>
                  <nav className="space-y-1">
                    {navigation.map((item) => {
                      if (item.href === router.pathname) {
                        item.current = true;
                      }
                      return (
                        <Link key={item.name} href={item.href}>
                          <a
                            className={classNames(
                              item.current
                                ? "bg-gray-50 text-indigo-700 hover:text-indigo-700 hover:bg-white"
                                : "text-gray-900 hover:text-gray-900 hover:bg-gray-50",
                              "group rounded-md px-3 py-2 flex items-center text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            <item.icon
                              className={classNames(
                                item.current
                                  ? "text-indigo-500 group-hover:text-indigo-500"
                                  : "text-gray-400 group-hover:text-gray-500",
                                "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
                              )}
                              aria-hidden="true"
                            />
                            <span className="truncate">{item.name}</span>
                          </a>
                        </Link>
                      );
                    })}
                  </nav>
                </aside>

                <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-10">
                  {children}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
