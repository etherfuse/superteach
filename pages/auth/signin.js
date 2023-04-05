/* eslint-disable @next/next/no-img-element */
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";

import Image from "next/image";
import Link from "next/link";

const SignInPage = ({ providers, csrfToken, errorMessage }) => {
  return (
    <div className="min-h-full h-full w-full flex items-center justify-center py-12 px-4  lg:px-8">
      <div className=" w-full h-full space-y-8">
        <div className=" h-full min-h-full w-full min-w-full p-0 m-0 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center py-12 px-4  w-full lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full md:w-96 lg:w-96">
              <div className="flex flex-col items-center justify-center">
                <Link href="/">
                  <Image
                    className="mx-auto w-24"
                    src="/images/etherfuse_squarelogo.jpeg"
                    alt="patitorosa"
                    width={100}
                    height={100}
                  />
                </Link>
                <h2 className="mt-6 text-center text-3xl tracking-tight font-bold text-happy-yellow bg-black px-4 py-2">
                  Inicia Sesión
                </h2>
              </div>

              <div className="mt-8">
                <div className="mt-1 w-full space-y-4 bg-black">
                  {providers.google && (
                    <div>
                      <div
                        className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-black   text-happy-yellow  text-sm font-medium "
                        onClick={() => signIn(providers.google.id)}
                      >
                        <svg
                          className="w-5 h-5"
                          aria-hidden="true"
                          fill="currentColor"
                          viewBox="0 0 488 512"
                        >
                          <path
                            fillRule="evenodd"
                            d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <p className="mx-2 ">Iniciar sesión con Google</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6 relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      O continua con email{" "}
                    </span>
                  </div>
                </div>
                <div className="mt-6">
                  <form
                    method="post"
                    action="/api/auth/signin/email"
                    className="space-y-6"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          name="csrfToken"
                          type="hidden"
                          defaultValue={csrfToken}
                        />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                        />
                      </div>
                    </div>

                    {errorMessage && (
                      <div className="mt-3 text-sm text-red-600">
                        {errorMessage}
                      </div>
                    )}

                    <div>
                      <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-happy-yellow bg-black hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                      >
                        Iniciar Sesión
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  //getting providers and csfr token
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);
  const session = await getSession({ req: context.req });

  const { error } = context.query;
  let errorMessage = "";

  //if user is logged in, redirect to home
  if (session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (error) {
    const errors = {
      Signin: "Intenta utilizando otra cuenta de correo",
      OAuthSignin: "Intenta utilizando otra cuenta de correo",
      OAuthCallback: "Intenta utilizando otra cuenta de correo",
      OAuthCreateAccount: "Intenta utilizando otra cuenta de correo",
      EmailCreateAccount: "Intenta utilizando otra cuenta de correo",
      Callback: "Intenta utilizando otra cuenta de correo",
      OAuthAccountNotLinked:
        "Intenta utilizando otro método de inicio de sesión",
      EmailSignin: "Revisa tu correo para iniciar sesión",
      default: "Un error extraño y desconocido ha ocurrido",
    };

    errorMessage = errors[error] || errors.default;
  }

  return {
    props: { errorMessage, providers, csrfToken },
  };
}

export default SignInPage;
