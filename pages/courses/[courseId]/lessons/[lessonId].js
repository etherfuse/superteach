import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";

export default function Lesson({ course, lessons }) {
  const router = useRouter();
  const { lessonId } = router.query;
  const [activeLesson, setActiveLesson] = useState(lessonId);

  const selectLesson = (lessonId) => {
    setActiveLesson(lessonId);
    router.push(`/courses/${course.id}/lessons/${lessonId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Disclosure as="nav" className="bg-gray-800 p-4 md:hidden">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between w-full">
              <MenuIcon className="w-6 h-6 text-white" />
              {open && <XIcon className="w-6 h-6 text-white" />}
            </Disclosure.Button>
            <Disclosure.Panel className="absolute z-10 top-0 left-0 w-full mt-12">
              <Sidebar
                lessons={lessons}
                activeLesson={activeLesson}
                selectLesson={selectLesson}
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <aside className="hidden md:block w-1/4 bg-gray-800 text-white h-screen overflow-y-auto">
        <Sidebar
          lessons={lessons}
          activeLesson={activeLesson}
          selectLesson={selectLesson}
        />
      </aside>
      <main className="w-full md:w-3/4 bg-white p-4 md:pl-0 md:pr-8 h-screen overflow-y-auto">
        Course {course.id}, Content {activeLesson} here...
      </main>
    </div>
  );

  function Sidebar({ lessons, activeLesson, selectLesson }) {
    return (
      <div className="bg-gray-800 text-white p-4 overflow-y-auto">
        {lessons.map((lessonGroup) => (
          <div key={lessonGroup.groupTitle}>
            <h3 className="font-semibold mb-2">{lessonGroup.groupTitle}</h3>
            <ul>
              {lessonGroup.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  className={`mb-2 px-4 py-2 rounded-md cursor-pointer ${
                    activeLesson === lesson.id ? "bg-gray-700" : ""
                  }`}
                  onClick={() => selectLesson(lesson.id)}
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
export async function getStaticPaths() {
  // Replace with logic to fetch course and lesson IDs from the database
  const paths = [
    { params: { courseId: "1", lessonId: "1" } },
    { params: { courseId: "1", lessonId: "2" } },
    { params: { courseId: "1", lessonId: "3" } },
    { params: { courseId: "1", lessonId: "4" } },
    { params: { courseId: "2", lessonId: "1" } },
    { params: { courseId: "2", lessonId: "2" } },
    // ...
  ];

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  // Replace with logic to fetch course and lessons data from the database
  const course = {
    id: params.courseId,
    title: `Course ${params.courseId}`,
  };

  const lessons = [
    {
      groupTitle: "Group 1",
      lessons: [
        {
          id: "1",
          title: "Lesson 1",
          content: "Content of lesson 1",
        },
        {
          id: "2",
          title: "Lesson 2",
          content: "Content of lesson 2",
        },
        {
          id: "3",
          title: "Lesson 3",
          content: "Content of lesson 3",
        },
        {
          id: "4",
          title: "Lesson 4",
          content: "Content of lesson 4",
        },
        {
          id: "5",
          title: "Lesson 5",
          content: "Content of lesson 5",
        },
        {
          id: "6",
          title: "Lesson 6",
          content: "Content of lesson 6",
        },
      ],
    },
    {
      groupTitle: "Group 2",
      lessons: [
        {
          id: "7",
          title: "Lesson 7",
          content: "Content of lesson 3",
        },
        {
          id: "8",
          title: "Lesson 8",
          content: "Content of lesson 4",
        },
      ],
    },
    {
      groupTitle: "Group 3",
      lessons: [
        {
          id: "9",
          title: "Lesson 9",
          content: "Content of lesson 9",
        },
        {
          id: "10",
          title: "Lesson 10",
          content: "Content of lesson 10",
        },
        {
          id: "11",
          title: "Lesson 11",
          content: "Content of lesson 11",
        },
        {
          id: "12",
          title: "Lesson 12",
          content: "Content of lesson 12",
        },
        {
          id: "13",
          title: "Lesson 13",
          content: "Content of lesson 13",
        },
        {
          id: "14",
          title: "Lesson 14",
          content: "Content of lesson 14",
        },
      ],
    },
  ];

  return {
    props: {
      course,
      lessons,
    },
    revalidate: 60,
  };
}
