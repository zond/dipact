import { GameSettingsTableAdapter } from "../adapters";

type AdapteeType = typeof GameSettingsTableAdapter.prototype["adaptee"];
type Adapter = typeof GameSettingsTableAdapter.prototype;

describe("GameSettingsTableAdapter", () => {
  let adaptee: typeof GameSettingsTableAdapter.prototype["adaptee"];
  let underTest: Adapter;

  beforeEach(() => {
    adaptee = {
      variant: "standard",
      phaseLength: "1h",
      nonMovementPhaseLength: "1h",
      endYear: 2100,
    } as AdapteeType;
    underTest = new GameSettingsTableAdapter(adaptee);
  });

  describe("variant", () => {
    it("should have label 'Variant'", () => {
      expect(underTest.variant.label).toBe("Variant");
    });

    it("should have value equal to adaptee.variant", () => {
      expect(underTest.variant.value).toBe(adaptee.variant);
    });

    it("should have icon 'variant'", () => {
      expect(underTest.variant.icon).toBe("variant");
    });
  });

  describe("phaseDeadline", () => {
    it("should have label 'Phase deadline'", () => {
      expect(underTest.phaseDeadline.label).toBe("Phase deadline");
    });

    it("should have value equal to adaptee.phaseLength", () => {
      expect(underTest.phaseDeadline.value).toBe(adaptee.phaseLength);
    });

    it("should have icon 'phaseDeadline'", () => {
      expect(underTest.phaseDeadline.icon).toBe("phaseDeadline");
    });
  });

  describe("nonMovementPhaseDeadline", () => {
    it("should have label 'Non-movement phase deadline'", () => {
      expect(underTest.nonMovementPhaseDeadline.label).toBe(
        "Non-movement phase deadline"
      );
    });

    it("should have value equal to adaptee.nonMovementPhaseLength", () => {
      expect(underTest.nonMovementPhaseDeadline.value).toBe(
        adaptee.nonMovementPhaseLength
      );
    });

    it("should have icon 'nonMovementPhaseDeadline'", () => {
      expect(underTest.nonMovementPhaseDeadline.icon).toBe(
        "nonMovementPhaseDeadline"
      );
    });
  });

  describe("gameEndYear", () => {
    it("should have label 'Game ends after'", () => {
      expect(underTest.gameEndYear?.label).toBe("Game ends after");
    });

    it("should have value equal to adaptee.endYear", () => {
      expect(underTest.gameEndYear?.value).toBe(adaptee.endYear);
    });

    it("should have icon 'gameEndYear'", () => {
      expect(underTest.gameEndYear?.icon).toBe("gameEndYear");
    });
  });
});
