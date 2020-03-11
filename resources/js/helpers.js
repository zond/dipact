import Globals from '%{ cb "./globals.js" }%';

export function createRequest(path) {
  let req_url = new URL(Globals.server_request.url);
  req_url.pathname = path;
  return new Request(req_url.toString(), {
    headers: Globals.server_request.headers,
    mode: Globals.server_request.mode
  });
}

export function minutesToDuration(m) {
  let reduce = null;
  reduce = m => {
    if (m < 60) {
      return "" + m + "m";
    } else if (m < 60 * 24) {
      let h = m / 60;
      let remainder = m - h * 60;
      let rval = "" + h + "h";
      if (remainder == 0) {
        return rval;
      }
      return rval + " " + reduce(remainder);
    } else {
      let d = m / (60 * 24);
      let remainder = m - d * 60 * 24;
      let rval = "" + d + "d";
      if (remainder == 0) {
        return rval;
      }
      return rval + " " + reduce(remainder);
    }
  };
  return reduce(m);
}
