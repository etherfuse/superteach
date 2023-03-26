/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import { unixToFormat } from "@/utils/dates";

const AdminCoursesPage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [courses, setCourses] = useState(undefined);

  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState({});

  const pageSize = 20;
  const sortBy = "createdAt";
  const orderBy = "desc";

  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    async function getCourses() {
      setIsInitialLoading(true);
      try {
        const { data } = await axios.get(
          `/api/admin/courses/?page=${page}&limit=${pageSize}&sort=${sortBy}&order=${orderBy}`
        );
        const { courses, count, totalPages } = data;

        setCourses(courses);
        setPaginationData({
          page,
          pageSize: courses.length,
          totalPages,
          totalCount: count,
        });
        setFetchError(false);
      } catch (err) {
        setFetchError(true);
      }
      setIsInitialLoading(false);
    }

    getCourses();
  }, [page]);

  return (
    <AdminLayout title="Cursos">
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 space-y-6 ">
                <div className="flex justify-between px-8 w-full items-center ">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Courses
                  </h3>

                  <Link href="/admin/courses/add" passHref legacyBehavior>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-buttontxt bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
                    >
                      Create Course
                    </button>
                  </Link>
                </div>
                <div className="flex flex-col px-4">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      {isInitialLoading ? (
                        <div className="py-24">
                          <LoadingCircle color="#000000" />
                        </div>
                      ) : fetchError ? (
                        <div className="py-24 text-center">
                          <p className="bold text-red-500">
                            An error ocurred trying to get courses 😢
                          </p>
                        </div>
                      ) : courses && courses.length > 0 ? (
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                {/* Aquí deberías agregar las columnas del encabezado para los campos relevantes de los cursos */}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {courses.map((course) => (
                                <tr key={course._id}>
                                  {/* Aquí deberías agregar las celdas de la tabla para los campos relevantes de los cursos */}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Pagination
                            paginationData={paginationData}
                            setPage={setPage}
                          />
                        </div>
                      ) : (
                        <div className="py-24 text-center">
                          <p className="bold text-red-500">No hay cursos 😢</p>
                        </div>
                      )}
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

export default AdminCoursesPage;
