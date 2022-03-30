export const getUserEmpty = {
  Name: "diplicity",
  Properties: {
    User: null,
  },
  Desc: [
    [
      "Usage",
      "Use the `Accept` header or `accept` query parameter to choose `text/html` or `application/json` as output.",
      "Use the `login` link to log in to the system.",
      "CORS requests are allowed.",
    ],
    [
      "Authentication",
      "The `login` link redirects to the Google OAuth2 login flow, and then back the `redirect-to` query param used when loading the `login` link.",
      "In the final redirect, the query parameter `token` will be your OAuth2 token.",
      "Use this token as the URL parameter `token`, or use it inside an `Authorization: Bearer ...` header to authenticate requests.",
    ],
    [
      "Source code",
      "The source code for this service can be found at https://github.com/zond/diplicity.",
      "Patches are welcome!",
    ],
    [
      "Creating games",
      "Most fields when creating games are self explanatory, but some of them require a bit of extra help.",
      "FirstMember.GameAlias is the alias that will be saved for the user that created the game. This is the same GameAlias as when updating a game membership.",
      "FirstMember.NationPreferences is the nations the game creator wants to play, in order of preference. This is the same NationPreferences as when updating a game membership.",
      "NoMerge should be set to true if the game should _not_ be merged with another open public game with the same settings.",
      "Private should be set to true if the game should _not_ show up in any game lists other than 'My ...'.",
    ],
  ],
  Type: "Diplicity",
  Links: [
    {
      Rel: "self",
      URL: "https://diplicity-engine.appspot.com/",
      Method: "GET",
    },
    {
      Rel: "variants",
      URL: "https://diplicity-engine.appspot.com/Variants",
      Method: "GET",
    },
    {
      Rel: "ratings-histogram",
      URL: "https://diplicity-engine.appspot.com/Users/Ratings/Histogram",
      Method: "GET",
    },
    {
      Rel: "global-stats",
      URL: "https://diplicity-engine.appspot.com/GlobalStats",
      Method: "GET",
    },
    {
      Rel: "rss",
      URL: "https://diplicity-engine.appspot.com/Rss",
      Method: "GET",
    },
    {
      Rel: "test-allocation",
      URL: "https://diplicity-engine.appspot.com/Allocation",
      Method: "POST",
      JSONSchema: {
        type: "object",
        properties: {
          Members: {
            type: "array",
            items: {
              type: "object",
              properties: {
                Prefs: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                  title: "Prefs",
                },
              },
            },
            title: "Members",
          },
          Variant: {
            type: "string",
            title: "Variant",
          },
        },
      },
    },
    {
      Rel: "latest-forum-mail",
      URL: "https://diplicity-engine.appspot.com/ForumMail",
      Method: "GET",
    },
    {
      Rel: "login",
      URL: "https://diplicity-engine.appspot.com/Auth/Login?redirect-to=https%3A%2F%2Fdiplicity-engine.appspot.com%2F",
      Method: "GET",
    },
  ],
};
