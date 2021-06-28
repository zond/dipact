import React, { useEffect, useState } from "react";
import {
  AppBar,
  Dialog,
  Divider,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Close, SkipNext, Warning } from "@material-ui/icons";

type NewsItemContent = {
  header: string;
  paragraphs: string[];
};

type NewsItem = {
  header: string;
  background?: string;
  content: NewsItemContent;
};

const newsItems: NewsItem[] = [
  {
    header: "Join the Nexus Cold War Tournament",
    background: "/static/img/coldwar.png",
    content: {
      header: "Nexus Cold War Tournament",
      paragraphs: [
        "Dear players, registrations for the third Nexus Cold War Tournament are open until February 20th.",
        "The tournament is starting on Feb 27th. At the moment more than 40 people have already registered for the competition, making this tournament the largest Cold War tournament ever.",
        "The Cold War map is a 1vs1 variant that allows the players to show their tactic skills via the simulation of a war between NATO and USSR on the global stage. You are in time to register and indicate Diplicity as your preferred platform: go to Nexus, sign up and fight for the third Cold War crown!",
        'To register, go to <a href="https://discord.gg/aMTuNJT5JB">https://discord.gg/aMTuNJT5JB</a>',
      ],
    },
  },
  {
    header: "Nexus Season 6 tournament",
    content: {
      header: "Nexus Season 6 full press tournament",
      paragraphs: [
        "Dear players, registrations for Nexus Season 6 full press tournament are active and they will be open till January 31st.",
        "The tournament will be held on multiple platforms, as many as there are players available to play in. Diplicity is one of the allowed platforms and I hope that many of us may want to test themselves in a competitive tournament!",
        "Feel free to join and subscribe: you are going to have a great time!",
        'To register, go to <a href="https://discord.gg/aMTuNJT5JB">https://discord.gg/aMTuNJT5JB</a>',
      ],
    },
  },
  {
    header: "New Diplicity app",
    content: {
      header: "Welcome to the new Diplicity!",
      paragraphs: [
        "We redesigned our app and started using the new version, which is still in Beta. This means there may be some (small) bugs that we haven't found on our own.",
        "If you encounter an issue, please let us know and we'll try to fix it ASAP",
        "Thanks!",
      ],
    },
  },
];

interface NewsDialogItem {
  content: NewsItemContent;
}

const NewsDialogItem: React.FC<NewsDialogItem> = ({
  content,
}): React.ReactElement => {
  return (
    <>
      <Typography variant="h6">{content.header}</Typography>
      {content.paragraphs.map((paragraph, index) => (
        <Typography variant="body2" key={index}>
          {paragraph}
        </Typography>
      ))}
    </>
  );
};

const NewsDialog = (): React.ReactElement => {
  //   const [open, setOpen] = useState(false);
  const [open, setOpen] = useState(true);
  const [activeItem, setActiveItem] = useState(0);
  const [updateInterval, setUpdateInterval] = useState(0);

  const ff = (e: React.MouseEvent<HTMLElement>): void => {
    if (e) e.stopPropagation();
    setActiveItem((activeItem + 1) % newsItems.length);
  };

  useEffect(() => {
    setUpdateInterval(setInterval(ff, 10000));
    return clearInterval(updateInterval);
  });

  const close = (): void => {
    // helpers.unback(this.close); TODO
    setOpen(false);
  };

  const activeNewsItem = newsItems[activeItem];

  // if (Globals.latestForumMail) {
  // 	setTimeout((_) => {
  // 		this.setForumMail(Globals.latestForumMail);
  // 	}, 50);
  // } else {
  // 	Globals.onNewForumMail = (fm) => {
  // 		this.setForumMail(fm);
  // 	};
  // }

  // setForumMail(fm) {
  // 	this.setState((state, props) => {
  // 		state = Object.assign({}, state);
  // 		state.newsItems.splice(1, 0, {
  // 			header: <span>Forum post: {fm.Properties.Subject}</span>,
  // 			content: (
  // 				<React.Fragment>
  // 					<Typography variant="h6" style={{}}>
  // 						Latest from the forum
  // 					</Typography>
  // 					<pre style={{ whiteSpace: "pre-wrap" }}>
  // 						{fm.Properties.Subject}
  // 						{"\n\n"}
  // 						{fm.Properties.Body}
  // 					</pre>
  // 					<Typography variant="body2">
  // 						<a
  // 							href="https://groups.google.com/g/diplicity-talk"
  // 							target="_blank"
  // 						>
  // 							Visit the forum
  // 						</a>
  // 					</Typography>
  // 				</React.Fragment>
  // 			),
  // 		});
  // 		return state;
  // 	});
  // }
  return (
    <>
      {open ? (
        <Dialog
          // onEntered={helpers.genOnback(this.close)} TODO
          open={open}
          fullScreen
          onClose={close}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setOpen(false)}
                aria-label="close"
              >
                <Close />
              </IconButton>
              <Typography variant="h6" style={{ paddingLeft: "16px" }}>
                News
              </Typography>
            </Toolbar>
          </AppBar>
          <div
            style={{
              padding: "0x",
              margin: "0px",
              maxWidth: "940px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <div
              style={{
                padding: "16px",
                marginTop: "56px",
              }}
            >
              {newsItems.map((item, idx) => {
                return (
                  <React.Fragment key={idx}>
                    <NewsDialogItem content={item.content} />
                    <Divider style={{ margin: "8 0 12 0" }} />
                  </React.Fragment>
                );
              })}
            </div>
            <div
              style={{
                backgroundImage: "url('../static/img/soldiers.svg'",
                height: "72px",
                top: "auto",
                bottom: "0px",
              }}
            ></div>
          </div>
        </Dialog>
      ) : (
        <div style={{ height: "52px" }}>
          <div
            style={{
              borderRadius: "3px",
              display: "flex",
              alignItems: "flex-start",
              padding: "6px 8px",
              margin: "8px 16px 0px 16px",
              backgroundColor: activeNewsItem.background
                ? ""
                : "rgb(255, 244, 229)",
              backgroundSize: "cover",
              backgroundImage: activeNewsItem.background
                ? `url(${activeNewsItem.background})`
                : undefined,
            }}
            onClick={() => setOpen(true)}
          >
            <div style={{ float: "left", marginRight: "8px" }}>
              <div
                style={{
                  color: "rgb(255, 152, 0)",
                }}
              >
                <Warning />
              </div>
              <IconButton onClick={ff} size="small" style={{ padding: "0px" }}>
                <SkipNext />
              </IconButton>
            </div>
            <div style={{ width: "calc(100% - 48px)" }}>
              <Typography
                variant="body1"
                style={{
                  color: "rgb(97, 26, 21)",
                  fontWeight: 500,
                }}
                noWrap
              >
                {activeNewsItem.header}
              </Typography>

              <Typography variant="body2" style={{ color: "rgb(97, 26, 21)" }}>
                For more information, touch here
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsDialog;
