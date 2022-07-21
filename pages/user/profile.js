/* eslint-disable @next/next/no-img-element */
import AccountLayout from "@/components/layouts/AccountLayout";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const ProfilePage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [userImageSrc, setUserImageSrc] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  //get access token from session
  useEffect(() => {
    async function getAccessToken() {
      if (session && session.user) {
        //get user data from db
        setIsInitialLoading(true);
        const { data } = await axios.get(`/api/users/${session.user.id}`);

        //set image src if exists
        data.image ? setUserImageSrc(data.image) : setUserImageSrc("");

        setValue("name", data.name);
        setValue("email", data.email);
        setIsInitialLoading(false);
      }
    }

    getAccessToken();
  }, [session, setValue]);

  const handleUserImagePreview = async (e) => {
    //set user profile photo preview
    const reader = new FileReader();
    reader.onload = function (onLoadEvent) {
      setUserImageSrc(onLoadEvent.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = async (data) => {
    // update profile info here
    setIsLoading(true);

    try {
      //parse info to formdata to send to server
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        //append images
        if (key === "userImage") {
          if (data[key][0]) formData.append(key, data[key][0]); //append image file to formData
        } else {
          formData.append(key, data[key]); //append regular keys to form data
        }
      });

      //save change of fields in database
      await axios.put(`/api/users/${session.user.id}`, formData, {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      });

      //Refresh page
      router.reload(window.location.pathname);

      toast.success("Profile updated successfully");
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong updating your profile");
    }

    setIsLoading(false);
  };

  return (
    <AccountLayout>
      <Toaster position="bottom-center" />
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Información Personal
                  </h3>
                </div>

                {isInitialLoading ? (
                  <LoadingCircle color="#000000" />
                ) : (
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        {...register("name", {
                          required: {
                            value: true,
                            message: "Name is required",
                          },
                        })}
                      />
                      {errors.name && (
                        <div className="mt-3 text-sm text-red-600">
                          {errors.name.message}
                        </div>
                      )}

                      <div className="my-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          name="email"
                          id="email"
                          disabled
                          autoComplete="email"
                          className="text-gray-500 cursor-not-allowed mt-1 bg-gray-100 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          {...register("email")}
                        />
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="mt-1 sm:mt-0 sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                          Foto de Perfil
                        </label>
                        <div className="flex items-center">
                          <span className="h-24 w-24 rounded-full overflow-hidden bg-gray-100">
                            <img
                              src={
                                userImageSrc
                                  ? userImageSrc
                                  : `https://avatars.dicebear.com/api/micah/${session.user.email}.svg?background=%23ffffff`
                              }
                              alt="thumb"
                              className="h-full w-full object-cover"
                            />
                          </span>
                          <label
                            htmlFor="userImage"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>
                              <div
                                type="button"
                                className="pointer-cursor ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                {userImageSrc ? "Cambiar" : "Subir"}
                              </div>
                            </span>
                            <input
                              id="userImage"
                              name="userImage"
                              type="file"
                              className="sr-only"
                              {...register("userImage")}
                              onChange={(e) => {
                                handleUserImagePreview(e);
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {!isInitialLoading && (
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isLoading ? <LoadingCircle /> : "Actualizar"}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </AccountLayout>
  );
};

export default ProfilePage;
