import { LockClosedIcon, BookOpenIcon } from "@heroicons/react/outline";
import classNames from "classnames";
import { useRouter } from "next/router";

const Sidebar = ({ sections, activeLesson, enrollment }) => {
  const router = useRouter();
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

                {
                  //if lesson is locked show paragraph if not show link
                  !enrollment.completedLessons.includes(lesson._id) &&
                  activeLesson !== lesson._id ? (
                    <p className="truncate">{lesson.title}</p>
                  ) : (
                    <a
                      href={`/courses/${router.query.courseId}/lessons/${lesson._id}`}
                      className="truncate text-white hover:underline hover:cursor-pointer"
                    >
                      {lesson.title}
                    </a>
                  )
                }
              </li>
            ))}
          </ul>
          <hr className="my-4" />
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
