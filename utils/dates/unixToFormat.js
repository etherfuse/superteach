import format from "date-fns/format";
import { es } from "date-fns/locale";

const unixToFormat = (unix, pattern = "PPP") => {
  if (unix) {
    const date = new Date(unix * 1000);
    return format(date, pattern, { locale: es });
  } else {
    return "";
  }
};

export default unixToFormat;
