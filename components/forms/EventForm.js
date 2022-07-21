/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import LoadingCircle from "@/components/common/LoadingCircle";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import Input from "@/components/forms/fields/Input";
import TextArea from "@/components/forms/fields/TextArea";
import Select from "@/components/forms/fields/Select";
import Divider from "@/components/forms/fields/Divider";
import CheckBox from "@/components/forms/fields/CheckBox";
import CoverImage from "@/components/forms/fields/CoverImage";
import { State, City } from "country-state-city";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import timezones from "@/data/timezones.json";

const EventForm = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const countryCode = "MX";
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  //watchers
  const stateName = watch("placeState");

  //fetch states at the beginning of the page
  useEffect(() => {
    const fetchStates = async () => {
      const states = await State.getStatesOfCountry(countryCode);
      const parsedStates = states.map((state) => {
        return {
          label: state.name,
          isoCode: state.isoCode,
          value: state.name,
        };
      });
      setStates(parsedStates);
    };
    fetchStates();
  }, []);

  //if change is selected, fetch cities
  useEffect(() => {
    const fetchCities = async (stateCode) => {
      const cities = await City.getCitiesOfState(countryCode, stateCode);
      const parsedCities = cities.map((city) => {
        return {
          label: city.name,
          value: city.name,
        };
      });
      setCities(parsedCities);
    };
    //get stateCode using stateName
    const state = states.find((state) => state.value === stateName);
    if (state?.isoCode) {
      fetchCities(state.isoCode);
    }
  }, [stateName]);

  const onSubmit = async (data) => {
    setButtonLoading(true);
    try {
      const newData = { ...data, placeCountry: "MX" };
      const formData = new FormData();
      Object.keys(newData).forEach((key) => {
        if (key === "photo") {
          if (data[key][0]) formData.append(key, data[key][0]); //append image file to formData
        } else {
          formData.append(key, data[key]); //append regular keys to form data
        }
      });

      await axios.post("/api/admin/events/", formData, {
        headers: {
          accept: "application/json",
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
        },
      });

      toast.success("Evento creado con éxito, redirigiendo...");
      //Redirects to events list page after event is created
      setTimeout(() => {
        router.push(`/admin/events`);
      }, 2000);
    } catch (error) {
      console.log("error", error);
      toast.error("Ocurrió un error al crear el evento");
    }
    setButtonLoading(false);
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Divider
          label="Información del evento"
          className="mt-2 mb-2"
          hideLine={true}
        />

        <div className="inputwrapper my-3">
          <Input
            label="Nombre"
            name="name"
            type="text"
            register={{
              ...register("name", {
                required: {
                  value: true,
                  message: "El nombre del evento es requerido",
                },
                maxLength: {
                  value: 50,
                  message: "No puede contener más de 50 caracteres",
                },
              }),
            }}
            placeholder="Escribe el nombre de tu evento"
            errorMessage={errors.name?.message}
          />
        </div>
        <div className="inputwrapper my-3">
          <TextArea
            label="Descripción"
            name="description"
            register={{
              ...register("description", {
                required: {
                  value: true,
                  message: "Descripción del evento es requerida",
                },
                minLength: {
                  value: 100,
                  message: "Debe de tener minimo 100 caracteres",
                },
                maxLength: {
                  value: 2000,
                  message: "Debe de tener maximo 2000 caracteres",
                },
              }),
            }}
            errorMessage={errors.description?.message}
          />
        </div>
        <div className="datewrapper flex flex-col lg:flex-row lg:justify-start lg:space-x-8 lg:items-center  ">
          <div className="inputwrapper">
            <Input
              label="Hora de inicio"
              name="startTime"
              type="datetime-local"
              register={{
                ...register("startTime", {
                  required: {
                    value: true,
                    message: "Hora de Inicio del evento es requerida",
                  },
                }),
              }}
              errorMessage={errors.startTime?.message}
            />
          </div>
          <div className="inputwrapper my-3 lg:my-0">
            <Input
              label="Hora de finalización"
              name="endTime"
              type="datetime-local"
              register={{
                ...register("endTime", {
                  required: {
                    value: true,
                    message: "Hora de Inicio del evento es requerida",
                  },
                }),
              }}
              errorMessage={errors.endTime?.message}
            />
          </div>
          <div className="inputwrapper my-3 lg:my-0">
            <Select
              label="Zona Horaria"
              name="timeZone"
              options={timezones}
              register={{
                ...register("timeZone", {
                  required: {
                    value: true,
                    message: "Zona Horaria es requerido",
                  },
                }),
              }}
              errorMessage={errors.timeZone?.message}
            />
          </div>
        </div>

        <div className="inputwrapper my-3">
          <CoverImage
            label="Imágen del evento"
            name="photo"
            dimensions="Medida Recomendada: 1280x640px"
            register={{
              ...register("photo", {
                required: {
                  value: true,
                  message: "La imagen del evento es requerida",
                },
              }),
            }}
            errorMessage={errors.photo?.message}
          />
        </div>

        {/* PLACE  */}
        <Divider
          label="Detalles del lugar"
          className="mt-8 mb-2"
          hideLine={true}
        />

        <div className="inputwrapper my-3">
          <Input
            label="Nombre"
            name="placeName"
            type="text"
            register={{
              ...register("placeName", {
                required: {
                  value: true,
                  message: "El nombre del lugar es requerido",
                },
                maxLength: {
                  value: 35,
                  message: "No puede contener más de 35 caracteres",
                },
              }),
            }}
            placeholder="Escribe el nombre del lugar de tu evento"
            errorMessage={errors.placeName?.message}
          />
        </div>

        <div className="inputwrapper my-3">
          <Input
            label="Dirección"
            name="placeAddress"
            type="text"
            register={{
              ...register("placeAddress", {
                required: {
                  value: true,
                  message: "Dirección del lugar es requerida",
                },
                maxLength: {
                  value: 100,
                  message: "No puede contener más de 100 caracteres",
                },
              }),
            }}
            placeholder="Calle, Número y Colonia"
            errorMessage={errors.placeName?.message}
          />
        </div>

        <div className="inputwrapper my-3">
          <Select
            label="Estado"
            name="placeState"
            options={states}
            register={{
              ...register("placeState", {
                required: {
                  value: true,
                  message: "Estado es requerido",
                },
              }),
            }}
            errorMessage={errors.placeState?.message}
          />
        </div>

        <div className="inputwrapper my-3">
          <Select
            label="Ciudad"
            name="placeCity"
            options={cities}
            register={{
              ...register("placeCity", {
                required: {
                  value: true,
                  message: "Ciudad es requerida",
                },
              }),
            }}
            errorMessage={errors.placeCity?.message}
          />
        </div>
        <div className="inputwrapper my-3">
          <Input
            label="Url de Google Maps"
            name="locationUrl"
            type="text"
            register={{
              ...register("locationUrl"),
            }}
            placeholder="https://goo.gl/maps/nibjjZ3A18ESQzvA8"
            errorMessage={errors.locationUrl?.message}
          />
        </div>
        <div className="inputwrapper my-3">
          <CheckBox
            label="Tu evento es Público?"
            description="Elige si evento debe de mostrarse en la página de eventos"
            name="isPublic"
            register={{
              ...register("isPublic"),
            }}
          />
        </div>
        <button
          type="submit"
          className="my-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-happy-yellow hover:bg-happy-yellow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={buttonLoading}
        >
          {buttonLoading ? (
            <div className="inline-flex items-center justify-center">
              <LoadingCircle color="#ffffff" />
            </div>
          ) : (
            "Crear Evento"
          )}
        </button>
      </form>
    </>
  );
};

export default EventForm;
