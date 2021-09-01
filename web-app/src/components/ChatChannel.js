/* eslint-disable no-restricted-globals */
import React from "react";
import * as helpers from "../helpers";
import Globals from "../Globals";
import { Button, ButtonGroup } from "@material-ui/core";
import gtag from "ga-gtag";

import { ExpandIcon } from "../icons";
import NationAvatarGroup from "./NationAvatarGroup";
import { withRouter } from "react-router-dom";
import NationAvatar from "./NationAvatar";
import ChatMessageInput from "./ChatMessageInput";
import ChatMessagesList from "./ChatMessagesList";

class ChatChannel extends React.Component {
  constructor(props) {
    super(props);
    this.newAfter = Number.MAX_SAFE_INTEGER;
    this.renderBatchSize = 50;
    if (
      this.props.channel.Properties.NMessagesSince &&
      this.props.channel.Properties.NMessagesSince.Since
    ) {
      this.newAfter = Date.parse(
        this.props.channel.Properties.NMessagesSince.Since
      );
    }
    this.state = { messages: [], numToRender: this.renderBatchSize };
    this.member = (this.props.game.Properties.Members || []).find((e) => {
      return e.User.Email === Globals.user.Email;
    });
    this.variant = Globals.variants.find((v) => {
      return v.Properties.Name === this.props.game.Properties.Variant;
    });
    this.abortController = new AbortController();
    this.sendMessage = this.sendMessage.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.phaseResolvedAfter = this.phaseResolvedAfter.bind(this);
    this.messageHandler = this.messageHandler.bind(this);
    this.updateHistoryAndSubscription =
      this.updateHistoryAndSubscription.bind(this);
    this.scrollDown = this.scrollDown.bind(this);
    this.pollNewMessages = this.pollNewMessages.bind(this);
    this.maybeRenderMore = this.maybeRenderMore.bind(this);
    this.messageSlice = this.messageSlice.bind(this);
  }
  messageSlice() {
    return this.state.messages.slice(-this.state.numToRender);
  }
  maybeRenderMore() {
    const scroller = document.getElementById("messages");
    if (
      scroller &&
      scroller.scrollTop < 2 * scroller.clientHeight &&
      this.state.numToRender < this.state.messages.length
    ) {
      this.setState({
        numToRender: this.state.numToRender + this.renderBatchSize,
      });
    }
  }
  messageHandler(payload) {
    if (payload.data.message.GameID !== this.props.game.Properties.ID) {
      return false;
    }
    if (
      payload.data.message.ChannelMembers.join(",") !==
      this.props.channel.Properties.Members.join(",")
    ) {
      return false;
    }
    this.loadMessages(true);
    return true;
  }
  updateHistoryAndSubscription(
    isActive = this.props.isActive && this.props.channel
  ) {
    if (isActive) {
      if (Globals.messaging.subscribe("message", this.messageHandler)) {
        console.log("ChatChannel subscribing to `message` notifications.");
      }
      gtag("set", {
        page_title: "ChatChannel",
        page_location: location.href,
      });
      gtag("event", "page_view");
    } else {
      if (Globals.messaging.unsubscribe("message", this.messageHandler)) {
        console.log("ChatChannel unsubscribing from `message` notifications.");
      }
    }
  }
  componentDidMount() {
    this.loadMessages().then(this.updateHistoryAndSubscription);
    helpers.onback(this.props.close);
    let scroller = document.getElementById("messages");
    if (scroller) {
      scroller.addEventListener("scroll", this.maybeRenderMore);
    }
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateHistoryAndSubscription();
    if (!prevProps.isActive && this.props.isActive) {
      this.loadMessages(true);
    }
  }
  componentWillUnmount() {
    this.abortController.abort();
    helpers.unback(this.props.close);
    this.updateHistoryAndSubscription(false);
    let scroller = document.getElementById("messages");
    if (scroller) {
      scroller.removeEventListener("scroll", this.maybeRenderMore);
    }
  }
  sendMessage(message) {
    this.setState(
      {
        messages: this.state.messages.concat([
          {
            Properties: {
              Sender: this.member.Nation,
              Body: message,
              ID: Math.random(),
              CreatedAt: "" + new Date(),
            },
            undelivered: true,
          },
        ]),
      },
      (_) => {
        this.scrollDown();
        helpers
          .safeFetch(
            helpers.createRequest(this.props.createMessageLink.URL, {
              method: this.props.createMessageLink.Method,
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                Body: message,
                ChannelMembers: this.props.channel.Properties.Members,
              }),
            })
          )
          .then((resp) =>
            resp.json().then((js) => {
              gtag("event", "send_chat_message");
              if (
                !this.props.channel.Links.find((l) => {
                  return l.Rel === "messages";
                })
              ) {
                this.props.channel.Links.push({
                  Rel: "messages",
                  URL:
                    "/Game/" +
                    this.props.game.Properties.ID +
                    "/Channel/" +
                    js.Properties.ChannelMembers.join(",") +
                    "/Messages",
                  Method: "GET",
                });
              }
              if (Globals.messaging.tokenEnabled) {
                this.loadMessages(true);
              }
            })
          );
      }
    );
  }
  phaseResolvedAfter(phase, message) {
    if (phase.Properties.Resolved) {
      return (
        new Date(Date.parse(phase.Properties.ResolvedAt)).getTime() >
        new Date(Date.parse(message.Properties.CreatedAt)).getTime()
      );
    }
    return true;
  }
  pollNewMessages() {
    const messagesLink = this.props.channel.Links.find((l) => {
      return l.Rel === "messages";
    });
    if (!messagesLink) {
      return;
    }
    let url = messagesLink.URL + "?wait=true";
    const newestPhase = this.props.phases[this.props.phases.length - 1];
    if (this.state.messages && this.state.messages.length > 0) {
      const newestMessage = this.state.messages[this.state.messages.length - 1];
      url += "&since=" + newestMessage.Properties.CreatedAt;
    }
    console.log("Initiating hanging request for new messages.");
    helpers
      .safeFetch(helpers.createRequest(url), {
        signal: this.abortController.signal,
      })
      .then((resp) => resp.json())
      .then((js) => {
        console.log("Got new message!");
        js.Properties.reverse();
        js.Properties.forEach((message) => {
          message.phase = newestPhase;
        });
        const newMessages = this.state.messages
          .filter((msg) => {
            return !msg.undelivered;
          })
          .concat(js.Properties);
        this.setState(
          {
            messages: newMessages,
          },
          (_) => {
            this.scrollDown();
            this.pollNewMessages();
          }
        );
      });
  }
  loadMessages(silent = false) {
    this.abortController.abort();
    this.abortController = new AbortController();
    const messagesLink = this.props.channel.Links.find((l) => {
      return l.Rel === "messages";
    });
    if (messagesLink) {
      if (!silent) {
        helpers.incProgress();
      }
      return helpers
        .safeFetch(helpers.createRequest(messagesLink.URL), {
          signal: this.abortController.signal,
        })
        .then((resp) => resp.json())
        .then((js) => {
          if (this.props.loaded) {
            this.props.loaded();
          }
          if (!silent) {
            helpers.decProgress();
          }
          js.Properties.reverse();
          let currentPhaseIdx = 0;
          js.Properties.forEach((message) => {
            while (
              currentPhaseIdx + 1 < this.props.phases.length &&
              !this.phaseResolvedAfter(
                this.props.phases[currentPhaseIdx],
                message
              )
            ) {
              currentPhaseIdx++;
            }
            message.phase = this.props.phases[currentPhaseIdx];
          });
          this.setState({ messages: js.Properties }, this.scrollDown);
          if (!Globals.messaging.tokenEnabled) {
            this.pollNewMessages();
          }
          return Promise.resolve({});
        });
    } else {
      return Promise.resolve({});
    }
  }
  scrollDown() {
    const messagesEl = document.getElementById("messages");
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }
  render() {
    const avatars = this.props.channel.Properties.Members.map((nation) => {
      return (
        <NationAvatar
          key={nation}
          nation={nation}
          variant={this.variant.Name}
        />
      );
    });
    if (this.props.channel) {
      return (
        <React.Fragment>
          <ButtonGroup orientation="vertical" style={{ width: "100%" }}>
            <Button
              onClick={this.props.close}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTopLeftRadius: "0px",
                borderTopRightRadius: "0px",
                marginTop: "-1px",
              }}
            >
              <span style={{ display: "flex" }}>
                <NationAvatarGroup avatars={avatars} />
              </span>

              {this.props.channel.Properties.Members.length > 6 ? (
                <span
                  style={{
                    width: "calc(100% - 96px)",
                    textAlign: "left",
                    textTransform: "initial",
                    lineHeight: "1.2",
                  }}
                >
                  {this.props.channel.Properties.Members.length ===
                  this.variant.Properties.Nations.length
                    ? "Everyone"
                    : this.props.channel.Properties.Members.filter((n) => {
                        return !this.member || n !== this.member.Nation;
                      }).map((n, i) => {
                        if (i === 0) {
                          return n;
                        } else {
                          return ", " + n;
                        }
                      })}
                </span>
              ) : (
                <span
                  style={{
                    width: "calc(100% - 96px)",
                    textAlign: "left",
                    textTransform: "initial",
                    lineHeight: "1.6",
                  }}
                >
                  {this.props.channel.Properties.Members.length ===
                  this.variant.Properties.Nations.length
                    ? "Everyone"
                    : this.props.channel.Properties.Members.filter((n) => {
                        return !this.member || n !== this.member.Nation;
                      }).map((n, i) => {
                        if (i === 0) {
                          return n;
                        } else {
                          return ", " + n;
                        }
                      })}
                </span>
              )}

              <ExpandIcon />
            </Button>
          </ButtonGroup>
          <div
            id="messages"
            style={{
              overflowY: "scroll",
              height: "calc(100% - 56px)",
              maxWidth: "962px",
              margin: "auto",
              width: "100%",
              overflowX: "hidden",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <ChatMessagesList
                messages={this.messageSlice()}
                userNation={this.member.Nation}
                newAfter={this.newAfter}
                variant={this.variant}
                gameState={this.props.gameState}
              />
            </div>
            <div>
              {this.props.createMessageLink &&
                !(this.props.channel.Properties.Members || []).find((m) => {
                  return m === helpers.DiplicitySender;
                }) && <ChatMessageInput onSendMessage={this.sendMessage} />}
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      return "";
    }
  }
}

export default withRouter(ChatChannel);
