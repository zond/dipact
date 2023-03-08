import { TransformedVariant, Variant } from "../store";

class VariantAdapter extends Adapter<Variant> implements TransformedVariant {
  get createdBy() {
    return this.adaptee.CreatedBy;
  }
  get description() {
    return this.adaptee.Description;
  }
  get graph() {
    return this.adaptee.Graph;
  }
  get map() {
    return this.adaptee.Start.Map;
  }
  get name() {
    return this.adaptee.Name;
  }
  get nations() {
    return this.adaptee.Nations;
  }
  get nationAbbreviations() {
    return this.adaptee.nationAbbreviations;
  }
  get nationColors() {
    return this.adaptee.NationColors;
  }
  get orderTypes() {
    return this.adaptee.OrderTypes;
  }
  get phaseTypes() {
    return this.adaptee.PhaseTypes;
  }
  get provinceLongNames() {
    return this.adaptee.ProvinceLongNames;
  }
  get rules() {
    return this.adaptee.Rules;
  }
  get seasons() {
    return this.adaptee.Season;
  }
  get startSCs() {
    return this.adaptee.Start.SCs;
  }
  get startSeason() {
    return this.adaptee.Start.Season;
  }
  get startUnits() {
    return this.adaptee.Start.Units;
  }
  get startType() {
    return this.adaptee.Start.Type;
  }
  get startYear() {
    return this.adaptee.Start.Year;
  }
  get unitTypes() {
    return this.adaptee.UnitTypes;
  }
}

export const variantAdapter = (variant: Variant) => new VariantAdapter(variant);
