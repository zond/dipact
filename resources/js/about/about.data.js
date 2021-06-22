import externalLinks from "../external_links/index.js";

const formatLink = (link, label) => {
  return `<a href=${link}>${label}</a>`;
};

const formattedLinks = {
  androidApp: formatLink(externalLinks.androidApp, 'android app'),
  browserApp: formatLink(externalLinks.webVersion, 'browser app'),
  diplicityGithub: formatLink(externalLinks.diplicityGithub, "Diplicity"),
  diplomacyWiki: formatLink(externalLinks.diplomacyWiki, "Diplomacy"),
  godip: formatLink(externalLinks.godipGithub, "godip"),
  allanBCalhamerWiki: formatLink(
    externalLinks.allanBCalhamerWiki,
    "Allan Calhamer"
  ),
  rest: formatLink(externalLinks.restWiki, "RESTful"),
  json: formatLink(externalLinks.jsonWiki, "JSON"),
  hostedDiplicity: formatLink(
    externalLinks.hostedDiplicity,
    externalLinks.hostedDiplicity
  ),
  riskWiki: formatLink(externalLinks.riskWiki, "Risk"),
  rules: formatLink(externalLinks.rules, "rules"),
  zeroSumGame: formatLink(externalLinks.zeroSumGameWiki, "zero sum game"),
};

export const header = "About";

export const summary = `
  Diplicity is an open source Diplomacy application using the judge powers
  of ${formattedLinks.godip}, an open source diplomacy judge written in Go. Diplicity
  is available as an ${formattedLinks.androidApp} or as a ${formattedLinks.browserApp}.
`;

export const faqs = [
  {
    header: "What is Diplomacy?",
    paragraphs: [
      `${formattedLinks.diplomacyWiki} is a game invented in the 50's by ${formattedLinks.allanBCalhamerWiki}.`,
      `It bears a visual resemblance to ${formattedLinks.riskWiki}, in that it describes a territorial conflict using a map with player controlled regions and military units. However, unlike Risk, there's no element of chance. Discounting the initial distribution of territories and units, all outcomes are deterministic.`,
      `The ${formattedLinks.rules} are designed to be simple, and make it almost impossible to make headway without combining forces with the other players, while at the same time enforcing a ${formattedLinks.zeroSumGame}.`,
      "This means that using diplomacy to convince the other players that the best way for them to win is to work with you, while at the same time making sure that you end up on top when the benefits of the alliance start to wane, is the most successful method of winning the game.",
    ],
  },
  {
    header: "How do I change my username/avatar?",
    paragraphs: [
      `To minimize abuse and simplify usage, Diplicity uses your Google account information to identify you and will display your Google account name and avatar when you interact with other players. To change your displayed name or avatar, change it in your Google account, and it will update (for new games you join) the next time you log in.`,
    ],
  },
  {
    header: "How do I start playing?",
    paragraphs: [
      `To play a game, you either create one yourself or join an existing game. There are two categories of games, private and public. The public ones are listed in the Open games list, while the private ones require the creator to share a link for others to find them.`,
    ],
  },
  {
    header: "How do player statistics work?",
    paragraphs: [
      `To raise the quality of games and to let people play with others of similiar persuasion, Diplicity tracks stats for each player, and allows game creators to limit the game to players with certain stats.`,
    ],
  },
  {
    header: "What is the Reliability statistic?",
    paragraphs: [
      `The most important statistic is the Reliability statistic. Since a Diplomacy game where some players stop playing quickly becomes unbalanced, boring, and pointless, it is important to keep interacting with the game even when there isn't a chance of winning anymore, or when the other players have proven to be assholes, or when you just don't feel like it anymore. Just providing some random orders and submitting them is enough to make a huge positive difference.`,
      `The reliability statistic is designed to reward active players by letting them join games with other active players. It works by calculating the number of active game phases divided by the number of inactive game phases, so that it represents the average number of phases between missing the deadline.`,
      `When creating and joining games, it's recommended to (if possible when taking your own reliability into account) create and join games with a minimum reliability requirement of at least 10. This is helped by the minimum reliability of created games defaulting to your own reliability, or 10 if it's higher than 10.`
    ],
  },
  {
    header: "Other resources",
    paragraphs: [
      `The Diplicity server is hosted at ${formattedLinks.hostedDiplicity}, where you can find a simple and free to use ${formattedLinks.rest} ${formattedLinks.json} API to interact with Diplomacy games.`,
    ],
  },
];
