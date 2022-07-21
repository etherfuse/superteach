import AdminLayout from "@/components/layouts/AdminLayout";
import Link from "next/link";
import LoadingCircle from "@/components/common/LoadingCircle";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Select } from "@/components/forms/fields";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const roleOptions = [
  {
    value: "user",
    label: "Usuario",
  },
  {
    value: "user,admin",
    label: "Administrador",
  },
];

const AdminUsersAddPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkEmail = async (email) => {
    if (!email) return;
    try {
      const { data } = await axios.post(`/api/admin/users/checkemail`, {
        email,
      });
      const { available } = data;
      if (!available) {
        setError("email", {
          type: "manual",
          message: "El email ya está en uso",
        });
      } else {
        clearErrors("email");
      }
      return available;
    } catch (error) {
      console.log(error);
      toast.error("Error al verificar el email");
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const available = await checkEmail(data.email);
      if (available) {
        //send user data to api to create user
        await axios.post(`/api/admin/users`, data);
        toast.success("Usuario creado correctamente");
        setTimeout(() => {
          router.push("/admin/users");
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al crear el usuario");
    }
    setIsLoading(false);
  };

  return (
    <AdminLayout title="Usuarios">
      <div className="w-full flex justify-center">
        <div className="relative bg-white w-full ">
          <div>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="bg-white py-6 space-y-8 ">
                <div className="flex flex-row px-8 w-full justify-between items-center  ">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Nuevo Usuario
                  </h3>
                  <Link href="/admin/users" passHref>
                    <button
                      type="button"
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Regresar a Usuarios
                    </button>
                  </Link>
                </div>
                <div className="formcontainer w-full flex-col items-start justify-center px-8 ">
                  <div className="wrapper mx-auto">
                    <div className="inputfield lg:w-1/2 mb-4">
                      <p className="mb-2">
                        Los usuarios agregados tienen que acceder con
                        passwordless email.
                      </p>

                      <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="fields max-w-md">
                          <div className="my-4 field">
                            <Input
                              label="Nombre"
                              name="name"
                              type="text"
                              register={{
                                ...register("name", {
                                  required: {
                                    value: true,
                                    message: "Nombre es requerido",
                                  },
                                }),
                              }}
                              errorMessage={errors.name?.message}
                            />
                          </div>
                          <div className="my-4 field">
                            <Input
                              label="Email"
                              name="email"
                              type="email"
                              onBlur={(e) => {
                                checkEmail(e.target.value);
                              }}
                              register={{
                                ...register("email", {
                                  required: {
                                    value: true,
                                    message: "Email es requerido",
                                  },
                                  pattern: {
                                    value:
                                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Email inválido",
                                  },
                                }),
                              }}
                              errorMessage={errors.email?.message}
                            />
                          </div>
                          <div className="my-4 field">
                            <Select
                              label="Rol"
                              name="roles"
                              options={roleOptions}
                              register={{
                                ...register("roles", {
                                  required: {
                                    value: true,
                                    message: "El rol es requerido",
                                  },
                                }),
                              }}
                              errorMessage={errors.roles?.message}
                            />
                          </div>
                          <div className="mt-4">
                            <button
                              type="submit"
                              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-happy-yellow-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                              disabled={isLoading}
                            >
                              <div className="loadingcontainer flex justify-center items-center w-full">
                                {isLoading ? (
                                  <LoadingCircle color="#ffffff" />
                                ) : (
                                  "Registrar"
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
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

export default AdminUsersAddPage;
