const translateKeys = {
  createGame: {
    title: "create-game.title",
    nameInput: {
      label: "create-game.name-input.label",
    },
    privateCheckbox: {
      label: "create-game.game-master-checkbox.label",
    },
    gameMasterCheckbox: {
      label: "create-game.private-checkbox.label",
      helpText: {
        default: "create-game.private-checkbox.help-text.default",
        disabled: "create-game.private-checkbox.help-text.disabled",
      },
    },
    randomizeGameNameButton: {
      title: "create-game.randomize-name-button.title",
    },
    maxRatingInput: {
      errorMessage: {
        lessThanUserRating:
          "create-game.max-rating-input.error-message.less-than-user-rating",
        moreThanUserRating:
          "create-game.max-rating-input.error-message.more-than-user-rating",
      },
    },
    variantSelect: {
      label: "create-game.variant-select.label",
      optionLabel: "create-game.variant-select.option-label",
    },
    submitButton: {
      label: "create-game.submit-button.label",
    },
    nationAllocationSection: {
      label: "create-game.nation-allocation-section.label",
    },
    phaseLengthMultiplierInput: {
      label: "create-game.phase-length-multiplier-input.label",
    },
    phaseLengthUnitSelect: {
      label: "create-game.phase-length-unit-select.label",
    },
  },
  nationAllocationOptions: {
    random: "nation-allocation-options.random",
    preference: "nation-allocation-options.preference",
  },
  nationPreferences: {
    title: "nation-preferences.title",
    prompt: "nation-preferences.prompt",
    joinButton: {
      label: "nation-preferences.join-button.label",
    },
    closeButton: {
      label: "nation-preferences.close-button.label",
    },
  },
  durations: {
    minute: {
      singular: "durations.minute.singular",
      plural: "durations.minute.plural",
    },
    hour: {
      singular: "durations.hour.singular",
      plural: "durations.hour.plural",
    },
    day: {
      singular: "durations.day.singular",
      plural: "durations.day.plural",
    },
  },
  login: {
    description: "login.description",
    stayLoggedInCheckBox: {
      label: "login.stay-logged-in-checkbox.label",
    },
    loginButton: {
      label: "login.login-button.label",
    },
  },
  gameList: {
    noGamesMessage: "game-list.no-games-message",
    allGamesTab: {
      label: "game-list.all-games-tab.label",
    },
    myGamesTab: {
      label: "game-list.my-games-tab.label",
    },
    masteredGamesCheckbox: {
      label: "game-list.mastered-games-checkbox.label",
    },
    gameStatusLabels: {
      started: "game-list.game-status-labels.started",
      staging: "game-list.game-status-labels.staging",
      finished: "game-list.game-status-labels.finished"
    },
  },
  settings: {
    title: "settings.title",
    notificationsSection: {
      label: "settings.notifications-section.label",
    },
    pushNotificationsSwitch: {
      label: "settings.push-notifications-switch.label",
    },
    emailNotificationsSwitch: {
      label: "settings.email-notifications-switch.label",
    },
    phaseDeadlineReminder: {
      inputLabel: "settings.phase-deadline-reminder.input-label",
      helpText: "settings.phase-deadline-reminder.help-text",
      notificationsPrompt:
        "settings.phase-deadline-reminder.notifications-prompt",
    },
    colorNonSCsSwitch: {
      label: "settings.color-non-scs-switch.label",
      helpText: "settings.color-non-scs-switch.help-text",
    },
    mapColorsSection: {
      label: "settings.map-colors-section.label",
    },
    variantSelect: {
      label: "settings.variant-select.label",
    },
    resetSettingsButton: {
      label: "settings.reset-settings-button.label",
    },
    errorNotifications: {
      noToken: "settings.error-notifications.no-token",
      noPermission: "settings.error-notifications.no-permission",
      noPermissionPrompt: "settings.error-notifications.no-permission-prompt",
      infoLink: "settings.error-notifications.info-link",
      messagingNotStarted: "settings.error-notifications.messaging-not-started",
      firebaseNotSupported:
        "settings.error-notifications.firebase-not-supported",
    },
  },
};

export default translateKeys;
