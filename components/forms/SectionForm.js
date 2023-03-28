/* eslint-disable react-hooks/exhaustive-deps */
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/forms/fields";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import LoadingCircle from "@/components/common/LoadingCircle";

const SectionForm = ({ type = "new" }) => {
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

  const onSubmit = async (data) => {
    setLoading(true);
    let url = "";
    if (type === "new") {
      url = `/api/admin/courses/${router.query.courseId}/sections`;
    } else if (type === "edit") {
      url = `/api/admin/courses/${router.query.courseId}/sections/${router.query.sectionId}`;
    } else {
      toast.error("Invalid type");
      return;
    }

    console.log("url =>", url);

    try {
      if (!url) return;
      //new
      await axios({
        method: type === "new" ? "post" : "put",
        url,
        data,
      });

      toast.success(
        `${type === "new" ? "Section created" : "Section updated"} successfully`
      );

      reset();
      router.push(`/admin/courses/${router.query.courseId}/lessons`);
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    }
    setLoading(false);
  };

  //if the type is edit, get the section data
  useEffect(() => {
    const getSectionData = async (sectionId) => {
      try {
        const { data } = await axios.get(
          `/api/admin/courses/${router.query.courseId}/sections/${sectionId}`
        );

        reset(data);
      } catch (error) {
        console.error(error);
        toast.error("Error getting the section data");
      }
    };

    if (type === "edit" && router?.query?.sectionId) {
      //print the data inside the fields
      getSectionData(router.query.sectionId);
    }
  }, [router]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="inputcontainer">
        <Input
          label="Section Name"
          name="name"
          type="text"
          placeholder="My new Section"
          errorMessage={errors?.name?.message}
          register={{
            ...register("name", {
              minLength: {
                value: 3,
                message: "Name must have at least 3 characters",
              },
              maxLength: {
                value: 18,
                message: "Name must have less than 18 characters",
              },
              required: {
                value: true,
                message: "Name is required",
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
            "Create Section"
          ) : (
            "Update Section"
          )}{" "}
        </button>
      </div>
    </form>
  );
};

export default SectionForm;
