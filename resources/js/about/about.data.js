import externalLinks from "../external_links/index.js";

const formatLink = (link, label) => {
  return `<a href=${link}>${label}</a>`;
};

const links = {
    diplomacyWiki: formatLink(links.diplomacyWiki, "Diplomacy")
}

const data = [
  {
    variant: "h1",
    text: "About",
  },
  {
    variant: "h2",
    text: "Diplomacy",
  },
  {
    variant: "body1",
    text: `${links.diplomacyWiki} is a game invented in the 50's by ${links.allanBCalhamerWiki}.`,
  },
  {
    variant: "body1",
    text: `
            It bears a visual resemblance to ${
              (addLink(links.riskWiki), "Risk")
            }, in that it
            describes a territorial conflict using a map with player controlled regions and
            military units. However, unlike Risk, there's no element of chance. Discounting the
            initial distribution of territories and units, all outcomes are deterministic.
        `,
  },
  {
    variant: "body1",
    text: `
            The ${
              (addLink(links.diplomacyRules), "rules")
            } are designed to be simple, and make
            it almost impossible to make headway without combining forces with the other players,
            while at the same time enforcing a ${addLink(
              links.zeroSumGameWiki,
              "zero sum game"
            )}.
        `,
  },
  {
    variant: "body1",
    text: `
            This means that using diplomacy to convince the other players that the best way for them
            to win is to work with you, while at the same time making sure that you end up on top when
            the benefits of the alliance start to wane, is the most successful method of winning the game.
        `,
  },
  {
    variant: "h2",
    text: "Diplicity",
  },
  {
    variant: "body1",
    text: `
            ${addLink(
              links.diplicityGithub,
              "Diplicity"
            )} is technically an open source project providing
            a Diplomacy service using the judge powers of ${addLink(
              links.godipGithub,
              "godip"
            )}, another
            open source project.
        `,
  },
  {
    variant: "body1",
    text: `To provide maximum utility, a free server is hosted at ${addLink(
      links.hostedDiplicity,
      links.hostedDiplicity
    )},
            where you can find a simple and free to use ${addLink(
              links.restWiki,
              "RESTful"
            )} ${addLink(
      links.jsonWiki,
      "JSON"
    )} API to interact with Diplomacy games.
        `,
  },
];
