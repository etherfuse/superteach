import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { getSession } from "next-auth/react";

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
      OLI aqui va todo y asi cuando ya este loggedin
      {/* <Disclosure as="nav" className="bg-gray-800 p-4 md:hidden">
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
      </main> */}
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

export async function getServerSideProps(context) {
  //check if user is logged in, if not redirect to login page
  //after login, redirect to the same page
  const session = await getSession(context);

  //get path url params
  const { params } = context;
  const { courseId, lessonId } = params;

  if (!session) {
    return {
      redirect: {
        destination: `/auth/signin/?callbackUrl=/courses/${courseId}/lessons/${lessonId}`,
        permanent: false,
      },
    };
  }

  console.log("todo ok con la session, oh shi");

  return {
    props: {},
  };
}
