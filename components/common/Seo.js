import { NextSeo } from "next-seo";

//EDIT ME PLEASE
const data = {
  siteName: "SuperteamMX | Superteach",
  title: "SuperteamMX | Superteach",
  description:
    "Superteach parte de Superteam México ofrece cursos con un enfoque en Solana. Aprende a programar, desarrollar aplicaciones descentralizadas, interactuar con NFTs y mucho más. ¡Únete a nuestra comunidad y domina el ecosistema de Solana hoy!",
  url: "https://learn.superteam.mx",
  imageUrl: "/og.jpeg",
  twitter: "@superteammexico",
};

const Seo = ({
  subtitle,
  description = data.description,
  url = data.url,
  imageUrl = data.imageUrl,
}) => {
  const title = subtitle ? `${data.title} | ${subtitle}` : `${data.title}`;
  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        url: url,
        locale: "es",
        title: title,
        description: description,
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: title,
          },
        ],
        site_name: data.siteName,
      }}
      twitter={{
        handle: data.twitter,
        site: data.twitter,
        cardType: "summary_large_image",
      }}
    />
  );
};

export default Seo;
