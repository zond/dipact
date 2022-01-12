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


  nationPreferences: {
    title: "nation-preferences.title",
    dialog: "nation-preferences.dialog",
    joinButton: {
      label: "nation-preferences.joinButton.label"
    },
    cancelButton: {
      label: "nation-preferences.cancelButton.label"
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
  nationAllocationOptions: {
    random: "nation-allocation-options.random",
    preference: "nation-allocation-options.preference",
  }
};

export default translateKeys;
