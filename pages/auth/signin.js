/* eslint-disable @next/next/no-img-element */
import { getProviders, signIn, getSession } from "next-auth/react";

import Link from "next/link";

const SignInPage = ({ providers, callbackUrl }) => {
  //get callback url if is not undefined

  return (
    <div className="bg-st-dark-blue min-h-screen h-full w-full flex items-center justify-center py-12 px-4  lg:px-8">
      <div className=" w-full h-full space-y-8">
        <div className=" h-full min-h-full w-full min-w-full p-0 m-0 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center py-12 px-4  w-full lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full md:max-w-xl lg:w-96">
              <div className="flex flex-col items-center justify-center">
                <Link href="/">
                  <img
                    className="mx-auto h-12 w-auto md:h-20 "
                    src="/images/superteamlogo.png"
                    alt="superteam mexico logo"
                  />
                </Link>

                <p className="text-white text-center my-4 text-base md:text-xl lg:text-lg">
                  Inicia sesión con tu cuenta de Google para acceder al
                  contenido
                </p>
              </div>

              <div className="mt-8">
                <div className="mt-1 w-full space-y-4 ">
                  {providers.google && (
                    <div>
                      <div
                        className="cursor-pointer bg-st-dark-orange w-full inline-flex justify-center py-4 px-4  rounded-md shadow-sm  font-bold  text-black text-base md:text-xl lg:text-base  items-center "
                        onClick={() =>
                          signIn(providers.google.id, {
                            callbackUrl: callbackUrl,
                          })
                        }
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
  const session = await getSession({ req: context.req });
  let callbackUrl = "/";

  //if user is logged in, redirect to home unless it has a callback url in the query
  callbackUrl = context.query.callbackUrl || callbackUrl;

  if (session?.user) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  return {
    props: { providers, callbackUrl },
  };
}

export default SignInPage;
