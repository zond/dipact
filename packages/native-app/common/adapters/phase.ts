import { SCState } from "@diplicity/common";
import {
  TransformedPhase,
  Phase,
  Unit,
  TransformedUnit,
  Dislodged,
  TransformedDislodgedUnit,
  TransformedSupplyCenterState,
  UnitState,
  TransformedUnitState,
  Dislodger,
  TransformedDislodgingProvinces,
} from "../store";
import { Adapter } from "./types";

class DislodgedAdapter
  extends Adapter<Dislodged>
  implements TransformedDislodgedUnit
{
  get province() {
    return this.adaptee.Province;
  }
  get unit() {
    return unitAdapter(this.adaptee.Dislodged);
  }
}

const dislodgedAdapter = (dislodged: Dislodged) =>
  new DislodgedAdapter(dislodged);

class DislodgingProvinceAdapter
  extends Adapter<Dislodger>
  implements TransformedDislodgingProvinces
{
  get province() {
    return this.adaptee.Province;
  }
  get dislodgingProvince() {
    return this.adaptee.Dislodger;
  }
}

const dislodgingProvinceAdapter = (dislodger: Dislodger) => {
  return new DislodgingProvinceAdapter(dislodger);
};

// class which adapts Unit to TransformedUnit
class UnitAdapter extends Adapter<Unit> implements TransformedUnit {
  get type() {
    return this.adaptee.Type;
  }
  get nation() {
    return this.adaptee.Nation;
  }
}

class UnitStateAdapter
  extends Adapter<UnitState>
  implements TransformedUnitState
{
  get province() {
    return this.adaptee.Province;
  }
  get unit() {
    return unitAdapter(this.adaptee.Unit);
  }
}

const unitStateAdapter = (unitState: UnitState) =>
  new UnitStateAdapter(unitState);

class SupplyCenterStateAdapter
  extends Adapter<SCState>
  implements TransformedSupplyCenterState
{
  get province() {
    return this.adaptee.Province;
  }
  get owner() {
    return this.adaptee.Owner;
  }
}

const supplyCenterStateAdapter = (supplyCenterState: SCState) => {
  return new SupplyCenterStateAdapter(supplyCenterState);
};

const unitAdapter = (unit: Unit) => new UnitAdapter(unit);

class PhaseAdapter extends Adapter<Phase> implements TransformedPhase {
  get id() {
    return this.adaptee.PhaseOrdinal;
  }
  get season() {
    return this.adaptee.Season;
  }
  get year() {
    return this.adaptee.Year;
  }
  get type() {
    return this.adaptee.Type;
  }
  get resolved() {
    return this.adaptee.Resolved;
  }
  get createdAt() {
    return this.adaptee.CreatedAt;
  }
  get resolvedAt() {
    return this.adaptee.ResolvedAt;
  }
  get deadlineAt() {
    return this.adaptee.DeadlineAt;
  }
  get units() {
    return this.adaptee.Units.map(unitStateAdapter);
  }
  get supplyCenters() {
    return this.adaptee.SCs.map(supplyCenterStateAdapter);
  }
  get dislodgedUnits() {
    return this.adaptee.Dislodgeds?.map(dislodgedAdapter) || [];
  }
  get dislodgingProvinces() {
    return this.adaptee.Dislodgers?.map(dislodgingProvinceAdapter) || [];
  }
}

export const phaseAdapter = (phase: Phase) => new PhaseAdapter(phase);
