import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { XCircleIcon } from "@heroicons/react/outline";

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
          setErrorMessage("El enlace de verificación ha expirado");
          break;
        case "AccessDenied":
          setErrorMessage("No tienes permiso para acceder a esta página");
          break;
        case "Configuration":
          setErrorMessage("Hay un problema con la configuración de la cuenta");
          break;
        default:
          setErrorMessage("Ocurrio un error desconocido");
      }
    }
  }, [router]);

  return (
    <div className="min-h-full w-full">
      <div className="flex-1 h-full flex justify-center items-center flex-col py-12 px-4 sm:px-6  lg:px-20 xl:px-24">
        <div className="flex justify-center w-24 text-red-500">
          <XCircleIcon />
        </div>
        <div className="message my-4 flex justify-center flex-col items-center">
          <p className="font-bold">Ha ocurrido un error 😞</p>
          {errorMessage && <p>{errorMessage}</p>}
        </div>
        <button
          type="button"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-buttontxt bg-buttonbg hover:bg-buttonbg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-buttonbg"
        >
          <Link href="/auth/signin">
            <a>Iniciar Sesión</a>
          </Link>
        </button>
      </div>
    </div>
  );
};

export default AuthErrorPage;
