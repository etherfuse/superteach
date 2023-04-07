import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeReact from "rehype-react";
import remarkBreaks from "remark-breaks";
import classNames from "classnames";
import DOMPurify from "isomorphic-dompurify";
import { createElement } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

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

const MarkDownContent = ({
  title = "",
  content = "",
  currentLesson = null,
  courseCompleted = false,
}) => {
  const sanitizedMarkdown = DOMPurify.sanitize(content, domPurifyConfig);
  const router = useRouter();
  const { data: session, status } = useSession();
  console.log("session", session);

  console.log("currentLesson", currentLesson);

  const completeLesson = async () => {
    console.log("completeLesson");
    //update completedlessons in the enrollment of the user
    try {
      await axios.put(`/api/enrollments`, {
        lessonId: currentLesson._id,
        courseId: currentLesson.courseId,
      });

      router.push(
        `/courses/${router?.query?.courseId}/lessons/${currentLesson.nextLesson}`
      );

      toast.success("Lección completada");
    } catch (error) {
      console.error(error);
      toast.error("Ocurrio un error completando la lección");
    }
  };

  const completeCourse = async () => {
    console.log("completeCourse");
    //update completedlessons in the enrollment of the user
    try {
      await axios.put(`/api/enrollments`, {
        lessonId: currentLesson._id,
        courseId: currentLesson.courseId,
        lastLesson: true,
      });

      router.push(`/congrats`);
    } catch (error) {
      console.error(error);
      toast.error("Ocurrio un error completando el curso");
    }
  };

  return (
    <div className="markdown">
      <h1 className="capitalize font-bold mb-4 text-2xl">{title}</h1>
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
        {currentLesson.nextLesson && (
          <button
            className="bg-st-blue-2 text-white py-2  rounded-md hover:bg-st-blue-3 underline font-bold "
            onClick={() => completeLesson()}
          >
            Ir a la siguiente lección
          </button>
        )}

        {currentLesson.isLastLesson && !courseCompleted && (
          <button
            className="bg-st-blue-2 text-white py-2  rounded-md hover:bg-st-blue-3 underline font-bold "
            onClick={() => completeCourse()}
          >
            Terminar curso
          </button>
        )}
      </div>
    </div>
  );
};

export default MarkDownContent;
