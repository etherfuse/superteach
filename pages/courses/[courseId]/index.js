import LoadingCircle from "@/components/common/LoadingCircle";
import clientPromise from "@/lib/mongodb";

const CourseHomePage = ({ course }) => {
  console.log("course", course);
  return (
    <div className="min-h-screen bg-st-dark-blue flex items-center justify-center">
      <LoadingCircle color="#fff" />
    </div>
  );
};

export default CourseHomePage;

export async function getServerSideProps(context) {
  const client = await clientPromise;
  const db = client.db();

  const redirect404 = {
    redirect: {
      destination: "/404",
      permanent: false,
    },
  };

  //if course exists redirect to first lesson
  //if not redirect to 404 page

  //get course id from url
  const { courseId: courseSlug } = context.params;

  //get courseId using slug
  const course = await db
    .collection("courses")
    .findOne({ slug: courseSlug, isPublic: true });

  if (!course) return redirect404; //if course does not exist, redirect to 404

  //get first section
  const { _id: courseId } = course;
  const firstSection = await db
    .collection("sections")
    .find({ courseId })
    .sort({ order: 1 })
    .limit(1)
    .toArray();

  const { _id: sectionId } = firstSection[0] || null;
  if (!sectionId) return redirect404; //if course does not have sections, redirect to 404

  //get first lesson
  const firstLesson = await db
    .collection("lessons")
    .find({ sectionId })
    .sort({ order: 1 })
    .limit(1)
    .toArray();

  const { _id: lessonId } = firstLesson[0] || null;
  if (!lessonId) return redirect404; //if course does not have lessons, redirect to 404

  //redirect to first lesson
  return {
    redirect: {
      destination: `/courses/${courseSlug}/lessons/${lessonId}`,
      permanent: false,
    },
  };
}
