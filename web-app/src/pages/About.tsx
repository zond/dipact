/* eslint-disable jsx-a11y/anchor-has-content */
import React from "react";
import { Box, Container, Typography } from "@mui/material";
import GoBackNav from "../components/GoBackNav";
import makeStyles from "@mui/styles/makeStyles";
import { Trans, useTranslation } from "react-i18next";
import tk from "../translations/translateKeys";
import links from "../utils/links";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

const defaultAProps = {
  target: "_blank",
  rel: "noreferrer",
};

const About = (): React.ReactElement => {
  const { t } = useTranslation("common");
  const classes = useStyles();

  return (
    <GoBackNav title={t(tk.about.navBarTitle)}>
      <Container>
        <Typography variant={"h4"}>
          {t(tk.about.diplomacySection.title)}
        </Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey={tk.about.diplomacySection.paragraph1}
            transKeepBasicHtmlNodesFor={["a"]}
            components={{
              link1: <a {...defaultAProps} href={links.diplomacyWiki} />,
              link2: <a {...defaultAProps} href={links.allanBCalhamerWiki} />,
            }}
          />
        </Typography>
        <Typography>
          <a href={links.howToPlayNotion} {...defaultAProps}>
            {t(tk.about.diplomacySection.paragraph2)}
          </a>
        </Typography>
        <Typography>{t(tk.about.diplomacySection.paragraph3)}</Typography>
        <Typography>{t(tk.about.diplomacySection.paragraph4)}</Typography>
        <Typography>{t(tk.about.diplomacySection.paragraph5)}</Typography>
        <Typography>{t(tk.about.diplomacySection.paragraph6)}</Typography>
        <Typography variant={"h4"}>
          {t(tk.about.diplicitySection.title)}
        </Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey={tk.about.diplicitySection.paragraph1}
            transKeepBasicHtmlNodesFor={["a"]}
            components={{
              link1: <a {...defaultAProps} href={links.diplomacyWiki} />,
              link2: <a {...defaultAProps} href={links.allanBCalhamerWiki} />,
            }}
          />
        </Typography>
        <Typography>{t(tk.about.diplicitySection.paragraph2)}</Typography>
        <Typography variant={"h5"}>
          {t(tk.about.diplicitySection.subsection1.title)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection1.paragraph1)}
        </Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey={tk.about.diplicitySection.subsection1.paragraph2}
          />
        </Typography>
        <Typography>
          <Trans
            t={t}
            i18nKey={tk.about.diplicitySection.subsection1.paragraph2}
          />
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection1.paragraph4)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection1.paragraph5)}
        </Typography>
        <Typography variant={"h5"}>
          {t(tk.about.diplicitySection.subsection2.title)}
        </Typography>
        <Typography variant={"body2"} paragraph component={"span"}>
          <Trans
            t={t}
            i18nKey={tk.about.diplicitySection.subsection2.paragraph1}
          />
        </Typography>
        <Typography variant={"h5"}>
          {t(tk.about.diplicitySection.subsection3.title)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection3.paragraph1)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection3.paragraph2)}
        </Typography>
        <Typography variant={"h5"}>
          {t(tk.about.diplicitySection.subsection4.title)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection4.paragraph1)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection4.paragraph2)}
        </Typography>
        <Typography variant={"h5"}>
          {t(tk.about.diplicitySection.subsection5.title)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection5.paragraph1)}
        </Typography>
        <Typography>
          {t(tk.about.diplicitySection.subsection5.paragraph2)}
        </Typography>
        <Typography variant={"h5"} style={{ marginBottom: "8px" }}>
          Diplicity Development
        </Typography>
        <Typography variant={"body2"}>
          This app actually consists of multiple open source projects:
        </Typography>
        <Typography variant={"body2"}>
          <a
            href="https://github.com/zond/dipact"
            target="_blank"
            rel="noreferrer"
          >
            Dipact
          </a>
          , this user interface app that uses
        </Typography>
        <Typography variant={"body2"}>
          <a
            href="https://github.com/zond/diplicity"
            target="_blank"
            rel="noreferrer"
          >
            Diplicity
          </a>
          , a Diplomacy game service that uses
        </Typography>
        <Typography variant={"body2"} paragraph>
          <a
            href="https://github.com/zond/godip"
            target="_blank"
            rel="noreferrer"
          >
            Godip
          </a>
          , a Diplomacy judge service.
        </Typography>
        <Typography variant={"body2"} paragraph>
          A free instance of the Diplicity server is hosted at{" "}
          <a
            href="https://diplicity-engine.appspot.com/"
            target="_blank"
            rel="noreferrer"
          >
            https://diplicity-engine.appspot.com
          </a>
          , where you can find a simple and free RESTful JSON API to interact
          with Diplomacy games.
        </Typography>
        <Typography variant={"body2"} paragraph>
          We are currently focusing our efforts on{" "}
          <a
            href="https://github.com/zond/dipact"
            target="_blank"
            rel="noreferrer"
          >
            Dipact
          </a>
          , and are always happy with people who want to help (by developing,
          translating, designing, creating variants or otherwise). The project
          is run on a 'we make it because we like to make it' basis. If you want
          to contribute, we welcome you on our{" "}
          <a
            href="https://discord.com/channels/565625522407604254/697344626859704340"
            target="_blank"
            rel="noreferrer"
          >
            Discord server
          </a>
          .
        </Typography>
        <Typography variant={"body2"}>
          You can find the old version of the Android app ("Droidippy") at{" "}
          <a
            href="https://github.com/zond/android-diplicity/releases"
            target="_blank"
            rel="noreferrer"
          >
            https://github.com/zond/android-diplicity/releases
          </a>
          .
        </Typography>
      </Container>
    </GoBackNav>
  );
};

export default About;
