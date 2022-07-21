import AdminLayout from "@/components/layouts/AdminLayout";
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";

const AdminDashboardPage = () => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [stats, setStats] = useState(undefined);
  useEffect(() => {
    async function getStats() {
      setIsInitialLoading(true);
      try {
        const { data } = await axios.get(`/api/admin/stats/`);
        setStats(data);
        setFetchError(false);
      } catch (err) {
        setFetchError(true);
      }
      setIsInitialLoading(false);
    }

    getStats();
  }, []);
  return (
    <AdminLayout>
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Estadisticas Totales
                  </h3>
                  <div className="mt-12">
                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                      {isInitialLoading ? (
                        <div className="py-24">
                          <LoadingCircle color="#000000" />
                        </div>
                      ) : fetchError ? (
                        <div className="py-24 text-center">
                          <p className="bold text-red-500">
                            Ocurrió un error trayendo estadisticas 😢
                          </p>
                        </div>
                      ) : stats && stats.length > 0 ? (
                        stats.map((item) => (
                          <div
                            key={item.name}
                            className="px-4 py-5 bg-white shadow rounded-lg overflow-hidden sm:p-6"
                          >
                            <dt className="text-sm font-medium text-gray-500 truncate capitalize">
                              {item.nameEs}
                            </dt>
                            <dd className="mt-1 text-3xl font-semibold text-gray-900">
                              {item.stat}
                            </dd>
                          </div>
                        ))
                      ) : (
                        <div className="py-24 text-center">
                          <p className="bold text-red-500">
                            No hay estadisticas disponibles😢
                          </p>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
