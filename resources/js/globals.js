const globals = {
  server_request: new Request("https://diplicity-engine.appspot.com/", {
    headers: {
      "X-Diplicity-API-Level": "8",
      Accept: "application/json"
    },
    mode: "cors"
  }),
  self_url: null,
  token: null
};

export default globals;
