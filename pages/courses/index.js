/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

export default function Courses({ courses }) {
  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">Courses</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-8">
          {courses.map((course) => (
            <Link key={course.id} href={`/courses/${course.id}`}>
              <div className="bg-gray-800 text-white shadow-md rounded-md overflow-hidden">
                <div className="relative">
                  <img
                    className="w-full h-56 object-cover"
                    src={course.thumbnail}
                    alt={course.title}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-transparent">
                    <h2 className="text-xl font-semibold">{course.title}</h2>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-300">{course.description}</p>
                </div>
                <div className="bg-gray-700 p-4 flex justify-between items-center">
                  <span>{course.enrolled} enrolled</span>
                  <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md">
                    Start Course
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const courses = await fetchCourses();

  return {
    props: {
      courses,
    },
    revalidate: 60,
  };
}

// Replace this function with your logic to fetch courses from the database
async function fetchCourses() {
  // Fetch the courses from the database
  // ...

  return [
    {
      id: "1",
      title: "Course 1",
      description: "Description of course 1",
      thumbnail: "https://via.placeholder.com/300",
      enrolled: 123,
    },
    {
      id: "2",
      title: "Course 2",
      description: "Description of course 2",
      thumbnail: "https://via.placeholder.com/300",
      enrolled: 234,
    },
    // ...
  ];
}
