/* eslint-disable react/no-children-prop */
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import MainLayout from "@/components/layouts/MainLayout";

import Sidebar from "@/components/course/Sidebar";
import MarkDownContent from "@/components/course/MarkDownContent";

export default function Lesson({ course, enrollment, currentLesson }) {
  const router = useRouter();
  const { lessonId } = router.query;
  const { sections } = course;

  return (
    <MainLayout>
      <div className="ultrawrapper w-full flex items-center justify-start">
        <div className="bg-st-dark-blue w-full block min-h-screen h-full max-w-6xl">
          <Disclosure as="nav" className="bg-st-dark-blue p-4 md:hidden">
            {({ open }) => (
              <>
                <Disclosure.Button className="flex items-center justify-between w-full">
                  <div>
                    {open ? (
                      <XIcon
                        className="w-6 h-6 text-white"
                        aria-hidden="true"
                      />
                    ) : (
                      <MenuIcon className="w-6 h-6 text-white z-20" />
                    )}
                  </div>
                </Disclosure.Button>
                <Disclosure.Panel className="absolute pt-24 z-10 top-0 left-0 w-full mt-12 md:w-96 md:fixed md:left-0 md:top-0 md:pt-0">
                  {" "}
                  <Sidebar
                    sections={sections}
                    activeLesson={lessonId}
                    enrollment={enrollment}
                    mobile={true}
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
            <div className="markdown w-full max-w-7xl md:px-4 lg:px-8 ">
              {" "}
              <MarkDownContent
                title={currentLesson.name}
                content={currentLesson.markdown}
                currentLesson={currentLesson}
                courseCompleted={enrollment.courseCompleted}
              />
            </div>
          </main>
        </div>
      </div>
    </MainLayout>
  );
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
              $unwind: "$lessons",
            },
            {
              $sort: {
                "lessons.order": 1,
              },
            },
            {
              $group: {
                _id: "$_id",
                courseId: { $first: "$courseId" },
                title: { $first: "$title" },
                order: { $first: "$order" },
                lessons: { $push: "$lessons" },
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
  if (!course || course.length === 0) {
    return {
      notFound: true,
    };
  }

  const { _id: courseId } = course[0] || null;

  //order sections by order
  course[0].sections.sort((a, b) => a.order - b.order);

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

  //get next and previous lesson ids in currentLesson
  const currentSection = course[0].sections.find((section) =>
    section.lessons.some((lesson) => lesson._id.toString() === lessonId)
  );

  const currentLessonIndex = currentSection.lessons.findIndex(
    (lesson) => lesson._id.toString() === lessonId
  );

  let nextLesson = currentSection.lessons[currentLessonIndex + 1];

  if (!nextLesson) {
    //try with next section
    const currentSectionIndex = course[0].sections.findIndex(
      (section) => section._id.toString() === currentSection._id.toString()
    );

    const nextSection = course[0].sections[currentSectionIndex + 1];
    if (nextSection) {
      nextLesson = nextSection.lessons[0];
    }
  }

  //check if we are in the last lesson and section of the course
  //if yes, islastLesson = true
  const isLastLesson = !nextLesson;
  currentLesson.nextLesson = nextLesson?._id || null;
  currentLesson.isLastLesson = isLastLesson;

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
