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
      label: "create-game.game-master-checkbox.label",
      helpText: {
        default: "create-game.game-master-checkbox.help-text.default",
        disabled: "create-game.game-master-checkbox.help-text.disabled",
      },
    },
    privateCheckbox: {
      label: "create-game.private-checkbox.label",
    },
    variantSelect: {
      label: "create-game.variant-select.label",
      optionLabel: "create-game.variant-select.option-label",
    },
    variantDescription: {
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
    chatSection: {
      label: "create-game.chat-section.label",
    },
    allowChatsSwitch: {
      label: "create-game.allow-chats-switch.label",
    },
    conferenceChatCheckbox: {
      label: "create-game.conference-chat-checkbox.label",
    },
    groupChatCheckbox: {
      label: "create-game.group-chat-checkbox.label",
    },
    individualChatCheckbox: {
      label: "create-game.individual-chat-checkbox.label",
    },
    anonymousChatCheckbox: {
      label: "create-game.anonymous-chat-checkbox.label",
      explanation: "create-game.anonymous-chat-checkbox.explanation",
    },
    chatLanguageSelect: {
      label: "create-game.chat-language-select.label",
      defaultOption: "create-game.chat-language-select.default-option",
    },
    requirementsSection: {
      label: "create-game.requirements-section.label",
    },
    reliabilityEnabledCheckbox: {
      label: "create-game.reliability-enabled-checkbox.label",
      helpText: "create-game.reliability-enabled-checkbox.help-text",
    },
    minReliabilityInput: {
      label: "create-game.min-reliability-input.label",
    },
    quicknessEnabledCheckbox: {
      label: "create-game.quickness-enabled-checkbox.label",
      helpText: "create-game.quickness-enabled-checkbox.help-text",
    },
    minQuicknessInput: {
      label: "create-game.min-quickness-input.label",
    },
    minRatingEnabledCheckbox: {
      label: "create-game.min-rating-enabled-checkbox.label",
      helpText: "create-game.min-rating-enabled-checkbox.help-text",
    },
    minRatingInput: {
      label: "create-game.min-rating-input.label",
      helpText: "create-game.min-rating-input.help-text",
      errorMessage: {
        moreThanUserRating:
          "create-game.min-rating-input.error-message.more-than-user-rating",
      },
    },
    maxRatingEnabledCheckbox: {
      label: "create-game.max-rating-enabled-checkbox.label",
      helpText: "create-game.max-rating-enabled-checkbox.help-text",
    },
    maxRatingInput: {
      label: "create-game.max-rating-input.label",
      helpText: "create-game.max-rating-input.help-text",
      errorMessage: {
        lessThanUserRating:
          "create-game.max-rating-input.error-message.less-than-user-rating",
      },
    },

    submitButton: {
      label: "create-game.submit-button.label",
    },
  },
  chatMenu: {
    title: "chat-menu.title",
    noChannelsMessage: "chat-menu.no-channels-message",
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
  orders: {
    confirmedIconTooltip: "orders.confirmed-icon-tooltip",
    noOrdersGivenIconTooltip: "orders.no-orders-given-icon-tooltip",
    wantsDrawIconTooltip: "orders.wants-draw-icon-tooltip",
    supplyCenterCount: {
      singular: "orders.supply-center-count.singular",
      plural: "orders.supply-center-count.plural;",
    },
    buildCount: {
      singular: "orders.build-count.singular",
      plural: "orders.build-count.plural",
    },
    disbandCount: {
      singular: "orders.disband-count.singular",
      plural: "orders.disband-count.plural",
    },
    toggleDiasButton: {
      label: "orders.toggle-dias-button.label",
    },
    confirmOrdersButton: {
      label: "orders.confirm-orders-button.label",
      noOrders: "orders.confirm-orders-button.no-orders",
      prompt: "orders.confirm-orders-button.prompt",
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
