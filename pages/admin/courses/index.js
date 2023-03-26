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
        console.log("data", data);

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
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Created At
                                </th>

                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Enrolled
                                </th>

                                <th scope="col" className="relative px-6 py-3">
                                  <span className="sr-only">Show</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {courses.map((course) => (
                                <tr key={course._id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <div className="flex-shrink-0 h-12 w-20">
                                        <img
                                          className="h-12 w-20 rounded-md"
                                          src={
                                            course.cover ||
                                            `https://avatars.dicebear.com/api/micah/${user.email}.svg?background=%23ffffff`
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 capitalize truncate">
                                          {course.name
                                            ? course.name
                                            : "Name not assigned"}
                                        </div>
                                        <div className="text-sm text-gray-500"></div>
                                      </div>
                                    </div>
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {unixToFormat(
                                      course.createdAt,
                                      "PP -  hh:mm aaa"
                                    )}
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ???
                                  </td>

                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                      href={`/admin/courses/${course.slug}`}
                                      className="text-selectedtxt hover:text-selectedtxt"
                                    >
                                      Show
                                    </Link>
                                  </td>
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
