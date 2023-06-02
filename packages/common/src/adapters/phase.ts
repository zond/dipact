import {
  TransformedPhase,
  Phase,
  Unit,
  TransformedUnit,
  Dislodged,
  SCState,
  TransformedDislodgedUnit,
  TransformedSupplyCenterState,
  UnitState,
  TransformedUnitState,
  Dislodger,
  TransformedDislodgingProvinces,
} from "../store";
import { Adapter } from "./adapter";

class DislodgedAdapter extends Adapter<Dislodged, TransformedDislodgedUnit> {
  adapt() {
    return {
      province: this.adaptee.Province,
      unit: unitAdapter(this.adaptee.Dislodged),
    };
  }
}

const dislodgedAdapter = (dislodged: Dislodged) =>
  new DislodgedAdapter(dislodged).adapt();

class DislodgingProvinceAdapter extends Adapter<
  Dislodger,
  TransformedDislodgingProvinces
> {
  adapt() {
    return {
      province: this.adaptee.Province,
      dislodgingProvince: this.adaptee.Dislodger,
    };
  }
}

const dislodgingProvinceAdapter = (dislodger: Dislodger) => {
  return new DislodgingProvinceAdapter(dislodger).adapt();
};

class UnitAdapter extends Adapter<Unit, TransformedUnit> {
  adapt() {
    return {
      type: this.adaptee.Type,
      nation: this.adaptee.Nation,
    };
  }
}

const unitAdapter = (unit: Unit) => new UnitAdapter(unit).adapt();

class UnitStateAdapter extends Adapter<UnitState, TransformedUnitState> {
  adapt() {
    return {
      province: this.adaptee.Province,
      unit: unitAdapter(this.adaptee.Unit),
    };
  }
}

const unitStateAdapter = (unitState: UnitState) =>
  new UnitStateAdapter(unitState).adapt();

class SupplyCenterStateAdapter extends Adapter<
  SCState,
  TransformedSupplyCenterState
> {
  adapt() {
    return {
      province: this.adaptee.Province,
      owner: this.adaptee.Owner,
    };
  }
}

const supplyCenterStateAdapter = (supplyCenterState: SCState) => {
  return new SupplyCenterStateAdapter(supplyCenterState).adapt();
};

class PhaseAdapter extends Adapter<Phase, TransformedPhase> {
  adapt(): TransformedPhase {
    return {
      id: this.adaptee.PhaseOrdinal,
      season: this.adaptee.Season,
      year: this.adaptee.Year,
      type: this.adaptee.Type,
      resolved: this.adaptee.Resolved,
      createdAt: this.adaptee.CreatedAt,
      resolvedAt: this.adaptee.ResolvedAt,
      deadlineAt: this.adaptee.DeadlineAt,
      units: this.adaptee.Units.map(unitStateAdapter),
      supplyCenters: this.adaptee.SCs.map(supplyCenterStateAdapter),
      dislodgedUnits: this.adaptee.Dislodgeds?.map(dislodgedAdapter) || [],
      dislodgingProvinces:
        this.adaptee.Dislodgers?.map(dislodgingProvinceAdapter) || [],
    };
  }
}

export const phaseAdapter = (phase: Phase) => new PhaseAdapter(phase);
