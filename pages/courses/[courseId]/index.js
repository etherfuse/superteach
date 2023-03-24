/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";

export default function Course({ course }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-10">{course.title}</h1>
        <div className="bg-white p-8 rounded-md shadow-md">
          <div className="mb-6">
            <img
              className="w-full h-64 object-cover rounded-md"
              src={course.thumbnail}
              alt={course.title}
            />
          </div>
          <h2 className="text-2xl font-semibold mb-4">
            Welcome to the course!
          </h2>
          <p className="mb-6">{course.description}</p>
          <Link href={`/courses/${course.id}/lessons/1`}>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md">
              Start Course
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // Replace with logic to fetch course IDs from the database
  const courseIds = ["1", "2"];

  const paths = courseIds.map((courseId) => ({
    params: { courseId },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  // Replace with logic to fetch course data from the database
  const course = {
    id: params.courseId,
    title: `Course ${params.courseId}`,
    description: `Description of course ${params.courseId}`,
    thumbnail: "https://via.placeholder.com/300",
  };

  return {
    props: {
      course,
    },
    revalidate: 60,
  };
}
