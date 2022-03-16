import MainLayout from "@/components/layouts/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl">
          <h1 className="text-2xl text-center font-bold">
            Molusco 🦑 <br /> Demo Page{" "}
          </h1>
        </div>
      </div>
    </MainLayout>
  );
}
