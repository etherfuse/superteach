/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import {
  Input,
  TextArea,
  CoverImage,
  CheckBox,
} from "@/components/forms/fields";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import LoadingCircle from "@/components/common/LoadingCircle";
import classNames from "classnames";

const CourseForm = ({ type = "new" }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const getCourseData = async (courseId) => {
      try {
        const { data } = await axios.get(`/api/admin/courses/${courseId}`);

        setCourse(data);
        reset(data);
      } catch (error) {
        console.error(error);
        toast.error("Error getting the course data");
      }
    };

    if (type === "edit" && router?.query?.courseId) {
      //print the data inside the fields
      getCourseData(router.query.courseId);
    }
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData(); // this is for creating a formdata object
      Object.keys(data).forEach((key) => {
        //append images
        if (key === "cover") {
          if (data[key][0]) formData.append(key, data[key][0]); //append image file to formData
        } else {
          formData.append(key, data[key]); //append regular keys to form data
        }
      });
      let url;
      const headers = {
        accept: "application/json",
        "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
      };

      //check if edit or new
      if (type === "edit") {
        url = `/api/admin/courses/${router?.query?.courseId}`;
        await axios.put(url, formData, { headers });
      } else {
        url = "/api/admin/courses/";
        await axios.post(url, formData, { headers });
      }

      toast.success("Course saved successfully");

      setTimeout(() => {
        window.location.href = "/admin/courses/";
      }, 2000);
    } catch (error) {
      console.error("error =>", error);
      //toast in english
      toast.error("Error creating the course");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputcontainer">
        <Input
          label="Name"
          name="name"
          type="text"
          errorMessage={errors?.name?.message}
          register={{
            ...register("name", {
              minLength: {
                value: 3,
                message: "Name must have at least 3 characters",
              },
              maxLength: {
                value: 50,
                message: "Name must have less than 50 characters",
              },
              required: {
                value: true,
                message: "Name is required",
              },
            }),
          }}
        />

        <TextArea
          label="Description"
          name="description"
          type="text"
          errorMessage={errors?.description?.message}
          register={{
            ...register("description", {
              minLength: {
                value: 30,
                message: "Description must have at least 30 characters",
              },
              maxLength: {
                value: 380,
                message: "Description must have less than 380 characters",
              },
              required: {
                value: true,
                message: "Description is required",
              },
            }),
          }}
        />
      </div>

      <div className="my-6">
        <CoverImage
          label="Course Image"
          name="cover"
          dimensions="Recommended Size: 1920x1080"
          errorMessage={errors?.photo?.message}
          defaultValue={course?.cover}
          register={
            type === "new"
              ? {
                  ...register("cover", {
                    required: {
                      value: true,
                      message: "Course image is required",
                    },
                  }),
                }
              : {
                  ...register("cover"),
                }
          }
        />
      </div>

      <div
        className={classNames("inputwrapper my-6", {
          "my-14": type === "edit",
        })}
      >
        <CheckBox
          label="Your course is public ? "
          description="If you select this option, your course will be visible to everyone."
          name="isPublic"
          register={{
            ...register("isPublic"),
          }}
        />
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
            "Create Course"
          ) : (
            "Update Course"
          )}{" "}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;
