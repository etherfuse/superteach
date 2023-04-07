/* eslint-disable react/no-children-prop */
import { useRouter } from "next/router";
import { useState, createElement } from "react";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import MainLayout from "@/components/layouts/MainLayout";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkBreaks from "remark-breaks";
import DOMPurify from "isomorphic-dompurify";
import classNames from "classnames";
import { LockClosedIcon, BookOpenIcon } from "@heroicons/react/outline";

const domPurifyConfig = {
  ADD_TAGS: ["iframe"],
  ADD_ATTR: [
    "src",
    "width",
    "height",
    "frameborder",
    "allow",
    "allowfullscreen",
    "title",
  ],
};

export default function Lesson({ course, enrollment, currentLesson }) {
  const router = useRouter();
  const { lessonId } = router.query;
  const { sections } = course;

  console.log("currentLesson", currentLesson);
  console.log("enrollment", enrollment);
  const sanitizedMarkdown = DOMPurify.sanitize(
    currentLesson.markdown,
    domPurifyConfig
  );
  console.log("sanitizedMarkdown", sanitizedMarkdown);

  return (
    <MainLayout>
      <div className="ultrawrapper w-full flex items-center justify-start">
        <div className="bg-st-dark-blue w-full block min-h-screen h-full max-w-6xl">
          <Disclosure as="nav" className="bg-st-dark-blue p-4 md:hidden">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full">
                  <MenuIcon className="w-6 h-6 text-white" />
                  {open && <XIcon className="w-6 h-6 text-white" />}
                </Disclosure.Button>
                <Disclosure.Panel className="absolute z-10 top-0 left-0 w-full mt-12 md:w-96 md:fixed md:left-0 md:top-0 md:pt-0">
                  {" "}
                  <Sidebar
                    sections={sections}
                    activeLesson={lessonId}
                    enrollment={enrollment}
                  />
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
          <aside className="hidden lg:flex bg-st-dark-blue text-white h-screen w-96 fixed overflow-y-scroll  ">
            <Sidebar
              sections={sections}
              activeLesson={lessonId}
              enrollment={enrollment}
            />
          </aside>
          <main className="w-full flex-1 md:flex-1 bg-st-dark-blue p-4 md:pl-0 md:pr-8 h-screen overflow-y-auto text-white  lg:ml-96">
            {" "}
            {/* //content here */}
            <div className="markdown w-full max-w-7xl px-4 ">
              {" "}
              <div className="markdown">
                <h1 className="capitalize font-bold mb-4 text-2xl">
                  {currentLesson.title}
                </h1>
                <ReactMarkdown
                  className={classNames(
                    "prose-sm",
                    "text-white",
                    "text-base",
                    "max-w-none",
                    "mx-auto"
                  )}
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  rehypePlugins={[
                    [rehypeRaw],
                    [rehypeReact, { createElement: createElement }],
                  ]}
                >
                  {sanitizedMarkdown}
                </ReactMarkdown>
                <div className="flex justify-between mt-8">
                  <div>
                    {currentLesson.previousLesson && (
                      <button
                        className="flex items-center text-sm font-bold text-white hover:text-st-blue-2"
                        onClick={() =>
                          router.push(
                            `/courses/${course.slug}/lessons/${currentLesson.previousLesson}`
                          )
                        }
                      >
                        <BookOpenIcon className="w-5 h-5 mr-2" />
                        Previous Lesson
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );

  function Sidebar({ sections, activeLesson, enrollment }) {
    return (
      <div className="bg-st-dark-blue text-white p-4  h-full w-full block">
        {sections.map((section) => (
          <div key={section._id}>
            <h3 className="font-bold mb-2 uppercase text-sm">{section.name}</h3>
            <ul>
              {section.lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className={classNames(
                    "flex items-center py-2 px-4 rounded-md cursor-pointer hover:bg-st-dark-blue-2",
                    activeLesson === lesson._id && "font-bold capitalize",
                    !enrollment.completedLessons.includes(lesson._id) &&
                      activeLesson !== lesson._id &&
                      "opacity-50 hover:opacity-50 cursor-not-allowed"
                  )}
                  onClick={() =>
                    router.push(`/courses/${course.slug}/lessons/${lesson._id}`)
                  }
                >
                  {
                    //if lesson is locked, show lock icon
                    !enrollment.completedLessons.includes(lesson._id) &&
                      activeLesson !== lesson._id && (
                        <LockClosedIcon className="w-4 h-4 mr-2 text-gray-400" />
                      )
                  }

                  {
                    //if lesson is locked, show lock icon
                    activeLesson === lesson._id && (
                      <BookOpenIcon className="w-4 h-4 mr-2 text-gray-400" />
                    )
                  }

                  <p className="truncate">{lesson.title}</p>
                </li>
              ))}
            </ul>
            <hr className="my-4" />
          </div>
        ))}
      </div>
    );
  }
}

export async function getServerSideProps(context) {
  //check if user is logged in, if not redirect to login page
  //after login, redirect to the same page
  const { params } = context;
  const session = await getSession(context);
  const { courseId: courseSlug, lessonId } = params; //courseid is slug
  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin/?callbackUrl=/courses/${courseSlug}/lessons/${lessonId}`,
        permanent: false,
      },
    };
  }

  const { id: userId } = session.user;

  //IF IT HAS SESSION, GET COURSE DATA AND CHECK IF USER IS ENROLLED
  const client = await clientPromise;
  const db = client.db();

  const course = await db
    .collection("courses")
    .aggregate([
      {
        $match: { slug: courseSlug, isPublic: true },
      },
      {
        $lookup: {
          from: "sections",
          let: { course_id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$courseId", "$$course_id"],
                },
              },
            },
            {
              $lookup: {
                from: "lessons",
                localField: "_id",
                foreignField: "sectionId",
                as: "lessons",
              },
            },
            {
              $addFields: {
                lessons: {
                  $map: {
                    input: "$lessons",
                    as: "lesson",
                    in: {
                      $mergeObjects: [
                        "$$lesson",
                        {
                          content: {
                            $cond: {
                              if: {
                                $eq: ["$$lesson._id", lessonId],
                              },
                              then: "$$lesson.markdown",
                              else: "$$REMOVE",
                            },
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
          as: "sections",
        },
      },
      {
        $addFields: {
          sections: {
            $filter: {
              input: "$sections",
              as: "section",
              cond: { $ne: ["$$section._id", null] },
            },
          },
        },
      },
    ])
    .toArray();

  //if course does not exist, return not found 404
  if (!course) {
    return {
      notFound: true,
    };
  }

  const { _id: courseId } = course[0] || null;

  try {
    //check if current lesson exists
    const lessonExists = course[0].sections.some((section) =>
      section.lessons.some((lesson) => lesson._id.toString() === lessonId)
    );

    //404 if lesson does not exist
    if (!lessonExists) {
      return {
        notFound: true,
      };
    }
  } catch (error) {
    //404
    return {
      notFound: true,
    };
  }

  //check if is enrolled in the course
  let enrollment = await db.collection("enrollments").findOne({
    courseId,
    userId: ObjectId(userId),
  });

  //if not enrolled, enroll user in the course
  if (!enrollment) {
    const enrollmentData = {
      courseId,
      userId: ObjectId(userId),
      completedLessons: [],
    };

    await db.collection("enrollments").insertOne(enrollmentData);
    enrollment = enrollmentData;
  }

  //get currentLessonData using lessonId from database
  const currentLesson = await db.collection("lessons").findOne({
    _id: ObjectId(lessonId),
  });

  //GET lesson data or redirect to first lesson
  const serializedCourse = JSON.parse(JSON.stringify(course[0]));

  return {
    props: {
      course: serializedCourse,
      enrollment: JSON.parse(JSON.stringify(enrollment)),
      currentLesson: JSON.parse(JSON.stringify(currentLesson)),
    },
  };
}
