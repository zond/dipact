import { CreateGameFormValues, NewGame } from "../store";
import { Adapter } from "./adapter";

class CreateGameAdapter extends Adapter<CreateGameFormValues, NewGame> {
  private get lastYear() {
    return this.adaptee.endAfterYears ? this.adaptee.endAfterYearsValue : 0;
  }
  private get nonMovementPhaseLength() {
    return this.adaptee.customAdjustmentPhaseLength
      ? this.adaptee.adjustmentPhaseLengthMultiplier *
          this.adaptee.adjustmentPhaseLengthUnit
      : 0;
  }

  adapt() {
    return {
      Anonymous: this.adaptee.anonymousEnabled,
      ChatLanguageISO639_1: this.adaptee.chatLanguage,
      Desc: this.adaptee.name,
      DisableConferenceChat: !this.adaptee.conferenceChatEnabled,
      DisableGroupChat: !this.adaptee.groupChatEnabled,
      DisablePrivateChat: !this.adaptee.individualChatEnabled,
      FirstMember: { NationPreferences: "" },
      GameMasterEnabled: this.adaptee.gameMaster,
      LastYear: this.lastYear,
      MaxHated: 0,
      MaxHater: 0,
      MaxRating: this.adaptee.maxRatingEnabled ? this.adaptee.maxRating : 0,
      MinQuickness: this.adaptee.minQuickness,
      MinRating: this.adaptee.minRating,
      MinReliability: this.adaptee.minReliability,
      NationAllocation: this.adaptee.nationAllocation === "random" ? 0 : 1,
      NonMovementPhaseLengthMinutes: this.nonMovementPhaseLength,
      PhaseLengthMinutes:
        this.adaptee.phaseLengthMultiplier * this.adaptee.phaseLengthUnit,
      Private: this.adaptee.privateGame,
      RequireGameMasterInvitation: this.adaptee.requireGameMasterInvitation,
      SkipMuster: true,
      Variant: this.adaptee.variant,
    };
  }
}

export const createGameAdapter = (values: CreateGameFormValues) =>
  new CreateGameAdapter(values).adapt();
