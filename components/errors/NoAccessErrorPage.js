//this is shown when a user has no access to a page
/* This example requires Tailwind CSS v2.0+ */
import { signIn } from "next-auth/react";

const NoAccessErrorPage = () => {
  return (
    <>
      <div className="bg-white min-h-full px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
        <div className="max-w-max mx-auto">
          <main className="sm:flex">
            <div className="">
              <div className=" flex space-x-4 justify-center items-center">
                <p className="font-medium text-gray-900 tracking-tight sm:text-xl">
                  No has iniciado sesión
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => signIn()}
                >
                  Iniciar Sesión
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default NoAccessErrorPage;
