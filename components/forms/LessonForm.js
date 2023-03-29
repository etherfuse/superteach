/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/forms/fields";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import LoadingCircle from "@/components/common/LoadingCircle";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const CourseForm = ({ type = "new" }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const getCourseData = async (slug) => {
      try {
        const { data } = await axios.get(`/api/admin/courses/${slug}`);

        setCourse(data);
        reset(data);
      } catch (error) {
        console.error(error);
        toast.error("Error getting the course data");
      }
    };

    if (type === "edit" && router?.query?.slug) {
      //print the data inside the fields
      getCourseData(router.query.slug);
    }
  }, [router]);

  const onSubmit = async (data) => {
    console.log("data", data);
    setLoading(true);
    try {
      const { courseId, sectionId, lessonId } = router.query;

      if (type === "new") {
        await axios.post(
          `/api/admin/courses/${courseId}/sections/${sectionId}/lessons`,
          data
        );
      } else if (type === "edit") {
        await axios.put(
          `/api/admin/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
          data
        );
      }

      toast.success(
        `${type === "new" ? "Lesson created" : "Lesson updated"} successfully`
      );

      router.push(`/admin/courses/${courseId}`);
    } catch (error) {
      console.error(error);
      toast.error("Error creating the course");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputcontainer">
        <Input
          label="Title"
          name="title"
          type="text"
          errorMessage={errors?.title?.message}
          register={{
            ...register("title", {
              minLength: {
                value: 3,
                message: "title must have at least 3 characters",
              },
              maxLength: {
                value: 18,
                message: "title must have less than 18 characters",
              },
              required: {
                value: true,
                message: "title is required",
              },
            }),
          }}
        />
      </div>

      <div className="markdowneditor">
        <input
          type="hidden"
          name="markdown"
          {...register("markdown", {
            required: {
              value: true,
              message: "markdown is required",
            },
          })}
        />
        <SimpleMDE
          onChange={(value) => {
            setValue("markdown", value, { shouldValidate: true });
          }}
        />
        {errors?.markdown?.message && (
          <p className="text-red-500 text-sm">{errors?.markdown?.message}</p>
        )}
      </div>

      <div className="flex justify-center items-center mt-8">
        <button
          type="submit"
          className="inline-flex text-buttontxt justify-center py-2 px-4 border border-transparent shadow-sm text-sm  font-medium rounded-md bg-buttonbg  focus:outline-none focus:ring-2 focus:ring-offset-2 "
          disabled={loading}
        >
          {loading ? (
            <LoadingCircle />
          ) : type === "new" ? (
            "Create Lesson"
          ) : (
            "Update Lesson"
          )}{" "}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
