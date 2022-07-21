//NEXT CONNECT API MIDDLEWARE OPTIONS CONFIGURATION
export const ncoptions = {
  onError: (err, req, res, next) => {
    console.log("Something broke nc middleware!", err);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res, next) => {
    res.status(404).end("Page is not found");
  },
};

export default ncoptions;
