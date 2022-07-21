/* eslint-disable @next/next/no-img-element */
import {
  getProviders,
  signIn,
  getCsrfToken,
  getSession,
} from "next-auth/react";

const SignInPage = ({ providers, csrfToken, errorMessage }) => {
  return (
    <div>
      <div className=" h-full min-h-full w-full flex justify-center items-center">
        <div className=" flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                Iniciar Sesión
              </h2>
            </div>

            <div className="mt-8">
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
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
      Signin: "Try using a different email address",
      OAuthSignin: "Try using a different email address",
      OAuthCallback: "Try using a different email address",
      OAuthCreateAccount: "Try using a different email address",
      EmailCreateAccount: "Try using a different email address",
      Callback: "Try using a different email address",
      OAuthAccountNotLinked:
        "Try using a different email address or sign in with a different provider",
      EmailSignin: "Check your email for a link to reset your password",
      default: "A unknown and misterious error happened",
    };

    errorMessage = errors[error] || errors.default;
  }

  return {
    props: { errorMessage, providers, csrfToken },
  };
}

export default SignInPage;
