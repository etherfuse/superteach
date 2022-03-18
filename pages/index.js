import MainLayout from "@/components/layouts/MainLayout";
import clientPromise from "@/lib/mongodb";

//SERVER EXAMPLE OF MONGODB CONNECTION
export async function getServerSideProps(context) {
  try {
    // client.db() will be the default database passed in the MONGODB_URI
    // You can change the database by calling the client.db() function and specifying a database like:
    // const db = client.db("myDatabase");
    // Then you can execute queries against your database like so:
    // db.find({}) or any of the MongoDB Node Driver commands
    await clientPromise;
    return {
      props: { isConnected: true },
    };
  } catch (e) {
    console.error(e);
    return {
      props: { isConnected: false },
    };
  }
}

export default function Home({ isConnected }) {
  console.log("isConnected", isConnected);
  return (
    <MainLayout>
      <div className="content flex justify-center items-center w-full my-16">
        <div className="wrapper max-w-7xl">
          <h1 className="text-2xl text-center font-bold">
            Molusco 🦑 <br /> Nextjs + Tailwind Starter!{" "}
          </h1>
          <br />
          <div className="connectioncontainer">
            <p className="font-bold">
              Connected to mongodb database: {isConnected ? "TRUE" : "FALSE"}{" "}
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
