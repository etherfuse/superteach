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
  const sanitizedMarkdown = DOMPurify.sanitize(
    currentLesson.markdown,
    domPurifyConfig
  );
  console.log("sanitizedMarkdown", sanitizedMarkdown);

  return (
    <MainLayout>
      <div className="min-h-screen bg-st-dark-blue flex w-full border-red-600 border fixed">
        <Disclosure as="nav" className="bg-st-dark-blue p-4 md:hidden">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex items-center justify-between w-full">
                <MenuIcon className="w-6 h-6 text-white" />
                {open && <XIcon className="w-6 h-6 text-white" />}
              </Disclosure.Button>
              <Disclosure.Panel className="absolute z-10 top-0 left-0 w-full mt-12">
                <Sidebar sections={sections} activeLesson={lessonId} />
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <aside className="hidden md:flex bg-st-dark-blue text-white h-screen overflow-y-auto w-96 ">
          <Sidebar sections={sections} activeLesson={lessonId} />
        </aside>
        <main className="w-full md:w-3/4 bg-st-dark-blue p-4 md:pl-0 md:pr-8 h-screen overflow-y-auto text-white border-white border">
          {/* //content here */}
          <div className="markdown px-4">
            <div className="markdown">
              <h1 className="capitalize font-bold mb-4">
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
            </div>
          </div>
        </main>
      </div>
    </MainLayout>
  );

  function Sidebar({ sections, activeLesson }) {
    console.log("sections", sections);
    return (
      <div className="bg-st-dark-blue text-white p-4 overflow-y-auto border-white border h-min-screen h-full w-full">
        {sections.map((section) => (
          <div key={section._id}>
            <h3 className="font-bold mb-2 uppercase text-sm  ">
              {section.name}
            </h3>
            <ul>
              {section.lessons.map((lesson) => (
                <li
                  key={lesson._id}
                  className={`mb-2 px-4 rounded-md cursor-pointer capitalize underline ${
                    activeLesson === lesson._id ? "bg-gray-700" : ""
                  }`}
                  onClick={() =>
                    router.push(`/courses/${course.slug}/lessons/${lesson._id}`)
                  }
                >
                  {lesson.title}
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
