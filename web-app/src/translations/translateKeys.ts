const translateKeys = {
  createGame: {
    title: "create-game.title",
    nameInput: {
      label: "create-game.name-input.label",
    },
    randomizeGameNameButton: {
      title: "create-game.randomize-name-button.title",
    },
    gameMasterCheckbox: {
      label: "create-game.private-checkbox.label",
      helpText: {
        default: "create-game.private-checkbox.help-text.default",
        disabled: "create-game.private-checkbox.help-text.disabled",
      },
    },
    privateCheckbox: {
      label: "create-game.game-master-checkbox.label",
    },
    variantSelect: {
      label: "create-game.variant-select.label",
      optionLabel: "create-game.variant-select.option-label",
    },
    variantDescription : {
      startYearLabel: "create-game.variant-description.start-year-label",
      authorLabel: "create-game.variant-description.author-label",
      rulesLabel: "create-game.variant-description.rules-label",
    },
    nationAllocationSection: {
      label: "create-game.nation-allocation-section.label",
    },
    gameLengthSection: { 
      label: "create-game.game-length-section.label",
    },
    phaseLengthMultiplierInput: {
      label: "create-game.phase-length-multiplier-input.label",
    },
    phaseLengthUnitSelect: {
      label: "create-game.phase-length-unit-select.label",
    },
    customAdjustmentPhaseLengthCheckbox: {
      label: "create-game.custom-adjustment-phase-length-checkbox.label",
    },
    adjustmentPhaseLengthMultiplierInput: {
      label: "create-game.adjustment-phase-length-multiplier-input.label",
    },
    skipGetReadyPhaseCheckbox: {
      label: "create-game.skip-get-ready-phase-checkbox.label",
      helpText: "create-game.skip-get-ready-phase-checkbox.help-text",
    },
    endAfterYearsCheckbox: {
      label: "create-game.end-after-years-checkbox.label",
    },
    endAfterYearsInput: {
      label: "create-game.end-after-years-input.label",
    },




    maxRatingInput: {
      errorMessage: {
        lessThanUserRating:
          "create-game.max-rating-input.error-message.less-than-user-rating",
        moreThanUserRating:
          "create-game.max-rating-input.error-message.more-than-user-rating",
      },
    },

    submitButton: {
      label: "create-game.submit-button.label",
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
