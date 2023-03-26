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
        url = `/api/admin/courses/${router.query.slug}`;
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
