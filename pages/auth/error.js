import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const AuthErrorPage = () => {
  //get url params from url
  const router = useRouter();
  //set state for error message
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const { error } = router.query;
    if (error) {
      switch (error) {
        case "Verification":
          setErrorMessage("The link you clicked is invalid or expired");
          break;
        case "AccessDenied":
          setErrorMessage("You dont have permission to access this page.");
          break;
        case "Configuration":
          setErrorMessage("There's a problem with the server");
          break;
        default:
          setErrorMessage("Something weird and misterious happened.");
      }
    }
  }, [router]);

  return (
    <div className="min-h-full w-full">
      <div className="flex-1 h-full flex justify-center items-center flex-col py-12 px-4 sm:px-6  lg:px-20 xl:px-24">
        <div className="flex justify-center w-full max-w-sm lg:w-96">
          <Image
            src={"/images/auth/error.png"}
            width={130}
            height={130}
            alt="error image"
          />
        </div>
        <div className="message my-4 flex justify-center flex-col items-center">
          <p className="font-bold">An error ocurred 😞</p>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Link href="/auth/signin">
            <a>Sign In</a>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default AuthErrorPage;
