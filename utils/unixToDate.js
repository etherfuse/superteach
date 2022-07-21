//Takes a unix time stamp and returns a string in the format of "DD/MM/YYYY" with local time
const unixToDate = (unixtimestamp, withHour = true) => {
  let d = new Date(unixtimestamp * 1000), // Convert the passed timestamp to milliseconds
    yyyy = d.getFullYear(),
    mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
    dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
    hh = d.getHours(),
    h = hh,
    min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
    ampm = "AM",
    time;

  if (hh > 12) {
    h = hh - 12;
    ampm = "PM";
  } else if (hh === 12) {
    h = 12;
    ampm = "PM";
  } else if (hh == 0) {
    h = 12;
  }

  // ie: 2013-02-18, 8:35 AM
  if (withHour) {
    time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;
  } else {
    time = dd + "/" + mm + "/" + yyyy;
  }

  return time;
};

export default unixToDate;
