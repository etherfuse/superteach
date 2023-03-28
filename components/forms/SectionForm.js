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
    console.log("data", data);
    setLoading(true);
    setLoading(false);
  };

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
