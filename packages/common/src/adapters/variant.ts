import { TransformedVariant, Variant } from "../store";
import { Adapter } from "./adapter";

class VariantAdapter extends Adapter<Variant, TransformedVariant> {
  adapt() {
    return {
      id: this.adaptee.Name,
      createdBy: this.adaptee.CreatedBy,
      description: this.adaptee.Description,
      graph: this.adaptee.Graph,
      map: this.adaptee.Start.Map,
      name: this.adaptee.Name,
      nations: this.adaptee.Nations,
      nationAbbreviations: this.adaptee.nationAbbreviations,
      nationColors: this.adaptee.NationColors,
      orderTypes: this.adaptee.OrderTypes,
      phaseTypes: this.adaptee.PhaseTypes,
      provinceLongNames: this.adaptee.ProvinceLongNames,
      rules: this.adaptee.Rules,
      seasons: this.adaptee.Season,
      startSCs: this.adaptee.Start.SCs,
      startSeason: this.adaptee.Start.Season,
      startUnits: this.adaptee.Start.Units,
      startType: this.adaptee.Start.Type,
      startYear: this.adaptee.Start.Year,
      unitTypes: this.adaptee.UnitTypes,
    };
  }
}

export const variantAdapter = (variant: Variant) =>
  new VariantAdapter(variant).adapt();
