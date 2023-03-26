import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import LoadingCircle from "@/components/common/LoadingCircle";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import NoAccessErrorPage from "@/components/errors/NoAccessErrorPage";
import CourseForm from "@/components/forms/CourseForm";

const AdminCoursesAddPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);

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
    <AdminLayout title="Agregar curso">
      <div className="bg-white px-6 py-6 flex flex-col">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Create Course</h1>
          <Link href="/admin/courses/" passHref>
            <button
              type="button"
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
            >
              Back
            </button>
          </Link>
        </div>
        <div className="mt-4">
          <CourseForm />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesAddPage;
