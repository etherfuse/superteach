import AdminLayout from "@/components//layouts/adminlayout";
import Link from "next/link";

export async function getStaticProps() {
  const HOST = process.env.NEXTAUTH_URL || "http://localhost:3000";
  return {
    props: {
      HOST,
    },
  };
}

const AdminUsersAddPage = ({ HOST }) => {
  return (
    <AdminLayout title="Usuarios">
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 space-y-8 ">
                <div className="flex flex-row px-8 w-full justify-between items-center  ">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Add a user
                  </h3>
                  <Link href="/admin/users" passHref>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Back to Users List
                    </button>
                  </Link>
                </div>
                <div className="formcontainer w-full flex-col items-start justify-center px-8 ">
                  <div className="wrapper mx-auto">
                    <div className="inputfield lg:w-1/2 mb-4">
                      <p className="mb-2">
                        To add an user ask them to sign up on the website
                      </p>
                      <a
                        href={`${HOST}/auth/signin`}
                        className="underline text-blue-600"
                      >
                        {`${HOST}/auth/signin`}
                      </a>

                      <p className="mt-2">
                        Then come back to look for the user in the list if you
                        need to edit it
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsersAddPage;
