/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import clientPromise from "@/lib/mongodb";

import { getProviders, signIn } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";

const HomePage = ({ courses }) => {
  const { data: session } = useSession();
  console.log("courses", courses);

  return (
    <div className="tempcontainer bg-st-dark-blue text-white min-h-screen  flex justify-center items-center flex-col ">
      <h1 className="hidden">SuperTeam Mexico | SuperTeach</h1>
      <Image
        src="/images/superteamlogo.png"
        alt="SuperTeam Logo"
        width={600}
        height={600}
      />

      <div className="flex flex-col items-center justify-center px-2 -mt-4">
        <h2 className="text-2xl font-bold text-center">
          Aprende Solana con SuperTeach 🙌!
        </h2>
        <>
          <div className="content flex flex-col justify-center items-center w-full max-w-full my-8 text-base ">
            <p className="text-2xl  max-w-4xl text-center font-bold">
              Ya disponible el primer curso de SuperTeach en Español 😎
            </p>
          </div>
          <div className="courseslist container">
            {courses && courses.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 px-6">
                {courses.map((course) => (
                  //full course card, full with image
                  <div
                    className="bg-black  rounded-lg shadow-md overflow-hidden"
                    key={course._id}
                  >
                    <div className="relative">
                      <img
                        className="w-full h-48 object-cover"
                        src={course.cover}
                        alt={course.name}
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-400">
                        {course.description}
                      </p>
                    </div>
                    <div className="p-4 flex justify-center items-center bg-st-dark-orange text-xl font-bold text-st-dark-blue">
                      Iniciar Curso
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const client = await clientPromise;
  const db = client.db();
  let publicCourses = null;

  const courses = await db
    .collection("courses")
    .aggregate([
      {
        $match: {
          isPublic: true,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ])
    .toArray();

  if (!courses) {
    publicCourses = null;
  }

  //serialize data
  publicCourses = JSON.parse(JSON.stringify(courses));
  return {
    props: {
      courses: publicCourses,
    },
    revalidate: 5,
  };
}

export default HomePage;
