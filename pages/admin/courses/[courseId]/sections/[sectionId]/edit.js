import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import LoadingCircle from "@/components/common/LoadingCircle";
import { useSession } from "next-auth/react";
import NoAccessErrorPage from "@/components/errors/NoAccessErrorPage";
import SectionForm from "@/components/forms/SectionForm";
import { useRouter } from "next/router";

const AdminSectionsEditPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingCircle color="#000000" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    console.info("unauthenticated");
    return <NoAccessErrorPage />;
  }

  if (session.user.roles && !session.user.roles.includes("admin")) {
    console.info("No admin");
    return <NoAccessErrorPage />;
  }

  return (
    <AdminLayout title="Create course">
      <div className="bg-white px-6 py-6 flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit Section </h1>

          <button
            type="button"
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
            onClick={() => router.back()}
          >
            Back to Sections
          </button>
        </div>
        <div className="mt-4">
          <SectionForm type="edit" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSectionsEditPage;
