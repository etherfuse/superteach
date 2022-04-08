import Image from "next/image";

const VerifyRequestPage = () => {
  return (
    <div className="min-h-full w-full">
      <div className="flex-1 h-full flex justify-center items-center flex-col py-12 px-4 sm:px-6  lg:px-20 xl:px-24">
        <div className="message my-4 flex justify-center flex-col items-center">
          <p className="font-bold">We sent an email to you 🙌</p>
          <p>
            Click in the link that we sent you to your email address in order to
            log in
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyRequestPage;
