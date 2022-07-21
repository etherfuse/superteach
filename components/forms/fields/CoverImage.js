import { useState } from "react";
import Image from "next/image";
const CoverImage = ({
  label,
  name,
  dimensions,
  errorMessage = "",
  register,
}) => {
  const [imageSrc, setimageSrc] = useState("");

  const handleImagePreview = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setimageSrc(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-auto">
      <label
        htmlFor={name}
        className="text-sm font-medium text-gray-700 sm:mt-px sm:pt-2 "
      >
        {label}
      </label>
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <span className="h-24 w-24 rounded-md overflow-hidden bg-gray-100">
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  width={1280}
                  height={600}
                  alt="thumb"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
            <div className="flex text-sm justify-center text-gray-600">
              <label
                htmlFor={name}
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                {imageSrc ? (
                  <span>Cambiar Imágen</span>
                ) : (
                  <span>Sube un archivo</span>
                )}
                <input
                  id={name}
                  name={name}
                  type="file"
                  className="sr-only"
                  {...register}
                  onChange={(e) => {
                    handleImagePreview(e);
                  }}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
            <p className="text-xs text-gray-500">{dimensions}</p>
          </div>
        </div>
        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
      </div>
    </div>
  );
};

export default CoverImage;
