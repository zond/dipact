/* eslint-disable no-restricted-globals */
import { diplicityService } from "./service";
import {
  ApiResponse,
  Channel,
  Message,
  // FCMToken,
  // Messaging,
  Variant,
} from "./types";

export const overrideReg = /[^\w]/g;
const colorReg = /^#([0-9a-fA-F]{3,3}|[0-9a-fA-F]{6,6}|[0-9a-fA-F]{8,8})$/;

type ParsedUserConfigColor = {
  type: string;
  variantCode?: string;
  nationCode?: string;
  value: string;
};

export const parseUserConfigColor = (
  userConfigColor: string
): ParsedUserConfigColor => {
  const parts = userConfigColor.split("/");
  if (parts.length === 1 && colorReg.exec(parts[0])) {
    return {
      type: "position",
      value: parts[0],
    };
  } else if (parts.length === 2 && colorReg.exec(parts[1])) {
    return {
      type: "nation",
      nationCode: parts[0],
      value: parts[1],
    };
  } else {
    return {
      type: "variant",
      variantCode: parts[0],
      nationCode: parts[1],
      value: parts[2],
    };
  }
};

const createNationAbbreviation = (
  nation: string,
  otherNations: string[]
): string => {
  // TODO we could improve this by taking multi-word names and abbreviating
  // them by first letter of each word East Frankish Kingdom -> EFK
  // TODO abbreviations shouldn't include whitespace, see utils.tests.ts for example
  let abbreviation = "";
  for (let idx = 0; idx < nation.length; idx++) {
    const matchingNations = otherNations.filter((otherNation) => {
      return otherNation.indexOf(nation.slice(0, idx + 1)) === 0;
    }).length;
    if (matchingNations === 1) {
      abbreviation = nation.slice(0, idx + 1);
      break;
    }
  }
  return abbreviation;
};

// Order the variants so that Classical is first and the rest are alphabetical.
export const sortVariantResponse = (
  variants: ApiResponse<Variant>[]
): ApiResponse<Variant>[] => {
  const variantsForSort = [...variants];
  return variantsForSort.sort((variantA, variantB) => {
    if (variantA.Name === "Classical") return -1;
    if (variantB.Name === "Classical") return 1;
    return variantA.Name > variantB.Name ? 1 : -1;
  });
};

// TODO test
// Order the by latest message created date.
export const sortListChannels = (channels: Channel[]): Channel[] => {
  return [...channels].sort((channelA, channelB) => {
    if (channelA.LatestMessage) {
      const d1 = Date.parse(channelA.LatestMessage.CreatedAt);
      const d2 = Date.parse(channelB.LatestMessage.CreatedAt);
      return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
    }
    return 0;
  });
};

export const sortMessages = (messages: Message[]): Message[] => {
  return [...messages].sort((messageA, messageB) => {
    if (messageA.CreatedAt) {
      const d1 = Date.parse(messageA.CreatedAt);
      const d2 = Date.parse(messageB.CreatedAt);
      return d1 > d2 ? 1 : d2 > d1 ? -1 : 0;
    }
    return 0;
  });
};

export const addNationAbbreviationsToVariant = (variant: Variant): Variant => {
  const nationAbbreviations: { [key: string]: string } = {};
  variant.Nations.forEach((nation) => {
    nationAbbreviations[nation] = createNationAbbreviation(
      nation,
      variant.Nations
    );
  });
  return { ...variant, nationAbbreviations };
};

// Note, RTK Query doesn't make it easy to mock this so we create this object to be easily mocked
export const getQueryMatchers = () => ({
  matchCreateGameFulfilled:
    diplicityService.endpoints.createGame.matchFulfilled,
  matchCreateGameRejected: diplicityService.endpoints.createGame.matchRejected,
  matchJoinGameFulfilled: diplicityService.endpoints.joinGame.matchFulfilled,
  matchJoinGameRejected: diplicityService.endpoints.joinGame.matchRejected,
  matchRescheduleGameFulfilled:
    diplicityService.endpoints.rescheduleGame.matchFulfilled,
  matchRescheduleGameRejected:
    diplicityService.endpoints.rescheduleGame.matchRejected,
  matchInviteFulfilled: diplicityService.endpoints.invite.matchFulfilled,
  matchInviteRejected: diplicityService.endpoints.invite.matchRejected,
  matchUnInviteFulfilled: diplicityService.endpoints.unInvite.matchFulfilled,
  matchUnInviteRejected: diplicityService.endpoints.unInvite.matchRejected,
  matchRenameGameFulfilled:
    diplicityService.endpoints.renameGame.matchFulfilled,
  matchRenameGameRejected: diplicityService.endpoints.renameGame.matchRejected,
  matchDeleteGameFulfilled:
    diplicityService.endpoints.deleteGame.matchFulfilled,
  matchDeleteGameRejected: diplicityService.endpoints.deleteGame.matchRejected,
  matchCreateOrderFulfilled:
    diplicityService.endpoints.createOrder.matchFulfilled,
  matchCreateOrderRejected:
    diplicityService.endpoints.createOrder.matchRejected,
});

// const hrefURL = new URL(location.href);
// const messageConfigTemplate =
// 	'You received a new message on Diplicity:\n\n"{{message.Body}}"\n\n\nTo view the game, visit\n\n' +
// 	hrefURL.protocol +
// 	"//" +
// 	hrefURL.host +
// 	"/Game/{{game.ID.Encode}}\n\n\n\n\nTo turn off email notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";
// const phaseConfigTemplate =
// 	"{{game.Desc}} has changed state.\n\n\nTo view the game, visit\n " +
// 	hrefURL.protocol +
// 	"//" +
// 	hrefURL.host +
// 	"/Game/{{game.ID.Encode}}.\n\n\n\n\nTo turn off emails notifications from Diplicity, visit:\n\n{{unsubscribeURL}}";

// const createNewToken = (
// 	enablePushNotifications: boolean,
// 	messaging: Messaging
// ): FCMToken => {
// 	const { token, tokenApp, globalToken } = messaging;
// 	const newToken: FCMToken = {
// 		Value: token || "",
// 		Disabled: !enablePushNotifications,
// 		Note:
// 			globalToken?.Note || "Created via dipact configuration on " + new Date(),
// 		App: tokenApp,
// 		MessageConfig: {
// 			BodyTemplate: "",
// 			TitleTemplate: "",
// 			ClickActionTemplate: "",
// 			DontSendNotification: true,
// 			DontSendData: false,
// 		},
// 		PhaseConfig: {
// 			BodyTemplate: "",
// 			TitleTemplate: "",
// 			ClickActionTemplate: "",
// 			DontSendNotification: true,
// 			DontSendData: false,
// 		},
// 		ReplaceToken: "",
// 	};
// 	return newToken;
// };

// // TODO test
// // Takes existing userConfig and settings form submit values and produces
// // an updated userConfig object to sent to service
// export const getUpdatedUserConfig = (
// 	userConfig: UserConfig,
// 	formSubmitValues: SettingsFormSubmitValues,
// 	messaging: Messaging,
// 	colorOverrides: ColorOverrides
// ): UserConfig => {
// 	const { MailConfig } = userConfig;
// 	const {
// 		colorFormValues,
// 		enableEmailNotifications,
// 		enablePushNotifications,
// 		phaseDeadline,
// 	} = formSubmitValues;
// 	const newToken = createNewToken(enablePushNotifications, messaging);
// 	const existingTokens = userConfig.FCMTokens || [];
// 	const Colors = colorOverrides.positions;
// 	Object.keys(colorFormValues).forEach((variant) => {
// 		Object.entries(colorFormValues[variant]).forEach(([nation, color]) => {
// 			Colors.push(
// 				variant.replace(overrideReg, "") +
// 					"/" +
// 					nation.replace(overrideReg, "") +
// 					"/" +
// 					color
// 			);
// 		});
// 	});
// 	const updatedUserConfig: UserConfig = {
// 		...userConfig,
// 		PhaseDeadlineWarningMinutesAhead: phaseDeadline,
// 		Colors,
// 		MailConfig: {
// 			...MailConfig,
// 			Enabled: enableEmailNotifications,
// 			MessageConfig: {
// 				...MailConfig?.MessageConfig,
// 				TextBodyTemplate: messageConfigTemplate,
// 			},
// 			PhaseConfig: {
// 				...MailConfig?.PhaseConfig,
// 				TextBodyTemplate: phaseConfigTemplate,
// 			},
// 		},
// 		FCMTokens: [...existingTokens, newToken],
// 	};
// 	return updatedUserConfig;
// };
