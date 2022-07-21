import Image from "next/image";

const VerifyRequestPage = () => {
  return (
    <div className="min-h-full w-full">
      <div className="flex-1 h-full flex justify-center items-center flex-col py-12 px-4 sm:px-6  lg:px-20 xl:px-24">
        <div className="message my-4 flex justify-center flex-col items-center">
          <p className="font-bold">Te Hemos Mandado un Email 🙌</p>
          <p>
            Da click en el link que te enviamos a tu email para iniciar sesión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRequestPage;
