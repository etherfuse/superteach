import Image from "next/image";

const HomePage = () => {
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
        <div className="content flex flex-col justify-center items-center w-full max-w-full my-8 text-base ">
          <p className="text-xl  max-w-4xl text-center font-bold">
            Superteach ofrece contenido educativo gratuito sobre{" "}
            <a className="underline" href="https://solana.com/" target="_blank">
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
      </div>
    </div>
  );
};

export default HomePage;
