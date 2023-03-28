/* eslint-disable @next/next/no-img-element */
import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";
import Pagination from "@/components/common/Pagination";
import { unixToFormat } from "@/utils/dates";
import { useRouter } from "next/router";
import { List, arrayMove } from "react-movable";
import { PencilAltIcon, ArrowsExpandIcon } from "@heroicons/react/outline";

const AdminCourseLessons = () => {
  const router = useRouter();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [sections, SetSections] = useState(undefined);

  const addSection = () => {
    console.log("Add section");
  };

  useEffect(() => {
    const fetchSectionsOfCourse = async () => {
      try {
        const { data } = await axios.get(
          `/api/courses/${router.query.courseId}/sections`
        );
        SetSections(data);
        console.log(data);
        setIsInitialLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    if (router.query.courseId) fetchSectionsOfCourse();
  }, [router.query.courseId]);

  return (
    <AdminLayout title="Lessons">
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 space-y-6 ">
                <div className="flex justify-between px-8 w-full items-center ">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Lessons for
                  </h3>

                  <div className="wrapper space-x-2">
                    <Link href={`/admin/courses`} passHref legacyBehavior>
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-buttontxt bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
                      >
                        Back to Courses
                      </button>
                    </Link>
                    <Link
                      href={`/admin/courses/${router?.query?.courseId}/lessons/add`}
                      passHref
                      legacyBehavior
                    >
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-buttontxt bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
                      >
                        New Lesson
                      </button>
                    </Link>
                    <Link
                      href={`/admin/courses/${router?.query?.courseId}/sections/add`}
                      passHref
                      legacyBehavior
                    >
                      <button
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-buttontxt bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
                      >
                        New Section
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-col px-4">
                  <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                      {isInitialLoading ? (
                        <div className="py-24">
                          <LoadingCircle color="#000000" />
                        </div>
                      ) : sections && sections.length > 0 ? (
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <List
                            values={sections}
                            onChange={({ oldIndex, newIndex }) => {
                              SetSections(
                                arrayMove(sections, oldIndex, newIndex)
                              );
                            }}
                            renderList={({ children, props, isDragged }) => (
                              <ul {...props}>{children}</ul>
                            )}
                            renderItem={({
                              value,
                              props,
                              isDragged,
                              isSelected,
                            }) => (
                              <li {...props}>
                                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 ">
                                  <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center justify-between w-full">
                                      <div className="leftsection">
                                        <div className="ml-4">
                                          <div className="text-sm font-medium text-gray-900"></div>
                                        </div>
                                        <div className="ml-4">
                                          <div className="flex  items-center text-base font-medium text-gray-900 capitalize">
                                            <ArrowsExpandIcon className="h-5 w-5 text-gray-400 cursor-pointer mr-2" />
                                            {value?.name}
                                          </div>
                                        </div>
                                      </div>
                                      <a
                                        href={`/admin/courses/${router?.query?.courseId}/sections/${value?._id}/edit`}
                                        className="ml-4"
                                      >
                                        <div className="text-sm font-medium text-gray-900">
                                          <PencilAltIcon className="h-5 w-5 text-gray-400 cursor-pointer" />
                                        </div>
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            )}
                          />
                        </div>
                      ) : (
                        <div className="py-24 text-center">
                          <p className="bold text-red-500">
                            There is no lessons 😢
                          </p>
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

export default AdminCourseLessons;
