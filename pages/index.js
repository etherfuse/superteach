import Image from "next/image";

import { getProviders, signIn } from "next-auth/react";
import { useSession, signOut } from "next-auth/react";

const HomePage = ({ providers }) => {
  const { data: session } = useSession();
  return (
    <div className="tempcontainer bg-st-dark-blue text-white min-h-screen  flex justify-center items-center flex-col ">
      <h1 className="hidden">SuperTeam Mexico | SuperTeach</h1>
      <Image
        src="/images/superteamlogo.png"
        alt="SuperTeam Logo"
        width={600}
        height={600}
      />

      <div className="flex flex-col items-center justify-center px-2">
        <h2 className="text-2xl font-bold text-center">
          SuperTeach viene en camino 🙌!
        </h2>

        {!session ? (
          <>
            <div className="content flex flex-col justify-center items-center w-full max-w-full my-8 text-base ">
              <p className="text-xl  max-w-4xl text-center font-bold">
                Superteach ofrece contenido educativo gratuito sobre{" "}
                <a
                  className="underline"
                  href="https://solana.com/"
                  target="_blank"
                >
                  Solana
                </a>
              </p>
              <p className="text-base  max-w-4xl text-center my-6 md:text-xl lg:my-2">
                Inicia sesion abajo para recibir notificaciones cuando estemos
                listos.
              </p>
              <p className="text-base  max-w-4xl text-center my-1 md:text-xl lg:my-0">
                Comenzamos en Abril 10, 2023{" "}
              </p>
            </div>
            <div className="googlesignincontainer">
              {providers.google && (
                <div>
                  <div
                    className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-st-light-blue text-happy-yellow  text-sm font-medium "
                    onClick={() =>
                      signIn(providers.google.id, { callbackUrl: "/" })
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
          </>
        ) : (
          <>
            <div className="content flex flex-col justify-center items-center w-full max-w-full my-8 text-base ">
              <p className="text-2xl  max-w-4xl text-center font-bold">
                Hey {session?.user?.name}!
              </p>
              <p className="text-base  max-w-4xl text-center my-6 md:text-xl lg:my-2">
                Gracias por registrarte en superteach! <br /> Te avisamos cuando
                estemos listos.
              </p>
              <p className="text-base  max-w-4xl text-center my-6 md:text-xl lg:my-2 font-bold">
                Puedes entrar a nuestro discord en el siguiente link:
              </p>
              <a
                className="text-bold underline"
                href={process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK}
                target="_blank"
              >
                {process.env.NEXT_PUBLIC_DISCORD_INVITE_LINK}
              </a>
            </div>
            <div className="googlesignincontainer">
              <div
                className="cursor-pointer w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-st-light-blue text-happy-yellow  text-sm font-medium "
                onClick={() => signOut()}
              >
                Cerrar Sesion
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  //getting providers and csfr token
  const providers = await getProviders();

  const { error } = context.query;
  let errorMessage = "";

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
    props: { errorMessage, providers },
  };
}

export default HomePage;
