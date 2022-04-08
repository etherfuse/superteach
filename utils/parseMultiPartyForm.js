//parses form data requests, it receives a request and a response
import multiparty from "multiparty";

const parsemultiPartyForm = async function (req) {
  //parses form data using multiparty
  const form = new multiparty.Form();
  form.parse(req, async (err, fields, files) => {
    try {
      //iterate tru fields and convert values from array to string
      for (const key in fields) {
        if (fields[key].length >= 1) {
          fields[key] = fields[key].join("");
        }
      }
      req.body = fields;
      req.files = files;
    } catch (error) {
      return error;
    }
  });
};

export default parsemultiPartyForm;
