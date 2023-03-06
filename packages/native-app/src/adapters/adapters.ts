import {
  diplicityService,
  getNation,
  Phase,
  Variant,
  updateMap,
} from "@diplicity/common";
import {
  GameSettingsTable,
  ManagementSettingsTable,
  PlayerSettingsTable,
  GameLogTable,
  VariantSettingsTable,
} from "../types";

abstract class Adapter<A> {
  constructor(protected readonly adaptee: A) {}
}

type NonUndefined<T> = T extends undefined ? never : T;

type Endpoint = {
  select: (...args: any) => (...args: any) => { data?: any | undefined };
};

type EndpointData<T extends Endpoint> = ReturnType<
  ReturnType<T["select"]>
>["data"];

type NonUndefinedEndpointData<T extends Endpoint> = NonUndefined<
  EndpointData<T>
>;

export class GameSettingsTableAdapter
  extends Adapter<
    NonUndefinedEndpointData<typeof diplicityService.endpoints.getGameV2>
  >
  implements GameSettingsTable
{
  get variant() {
    return {
      label: "Variant",
      value: this.adaptee.variant,
      icon: "variant",
    } as GameSettingsTable["variant"];
  }
  get phaseDeadline() {
    return {
      label: "Phase deadline",
      value: this.adaptee.phaseLength,
      icon: "phaseDeadline",
    } as GameSettingsTable["phaseDeadline"];
  }
  get nonMovementPhaseDeadline() {
    return {
      label: "Non-movement phase deadline",
      value: this.adaptee.nonMovementPhaseLength,
      icon: "nonMovementPhaseDeadline",
    } as GameSettingsTable["nonMovementPhaseDeadline"];
  }
  get gameEndYear() {
    return {
      label: "Game ends after",
      value: this.adaptee.endYear,
      icon: "gameEndYear",
    } as GameSettingsTable["gameEndYear"];
  }
}

export class VariantSettingsTableAdapter
  extends Adapter<
    NonUndefinedEndpointData<
      typeof diplicityService.endpoints.listVariantsV2
    >[0]
  >
  implements VariantSettingsTable
{
  get name() {
    return {
      label: "Name",
      value: this.adaptee.name,
      icon: "variant",
    } as VariantSettingsTable["name"];
  }
  get description() {
    return {
      label: "Description",
      value: this.adaptee.description,
      icon: "description",
    } as VariantSettingsTable["description"];
  }
  get numPlayers() {
    return {
      label: "Number of players",
      value: this.adaptee.nations.length,
      icon: "players",
    } as VariantSettingsTable["numPlayers"];
  }
  get rules() {
    return {
      label: "Rules",
      value: this.adaptee.rules,
      icon: "rules",
    } as VariantSettingsTable["rules"];
  }
  get startYear() {
    return {
      label: "Start year",
      value: this.adaptee.startYear,
      icon: "date",
    } as VariantSettingsTable["startYear"];
  }
}

export class ManagementSettingsTableAdapter
  extends Adapter<
    NonUndefinedEndpointData<typeof diplicityService.endpoints.getGameV2>
  >
  implements ManagementSettingsTable
{
  get gameMaster() {
    return {
      label: "Game master",
      value: this.adaptee.gameMaster.username,
      icon: "gameMaster",
    } as ManagementSettingsTable["gameMaster"];
  }
  get nationAllocation() {
    return {
      label: "Nation allocation",
      value: this.adaptee.nationAllocation,
      icon: "nationAllocation",
    } as ManagementSettingsTable["nationAllocation"];
  }
  get visibility() {
    return {
      label: "Visibility",
      value: this.adaptee.visibility,
      icon: "visibility",
    } as ManagementSettingsTable["visibility"];
  }
}

export class PlayerSettingsTableAdaper
  extends Adapter<
    NonUndefinedEndpointData<typeof diplicityService.endpoints.getGameV2>
  >
  implements PlayerSettingsTable
{
  get playerIdentity() {
    return {
      label: "Player Identity",
      value: this.adaptee.playerIdentity,
      icon: "playerIdentity",
    } as PlayerSettingsTable["playerIdentity"];
  }
}

export class GameLogTableAdapter
  extends Adapter<
    NonUndefinedEndpointData<typeof diplicityService.endpoints.getGameV2>
  >
  implements GameLogTable
{
  get created() {
    return {
      label: "Created",
      value: this.adaptee.createdAt,
      icon: "date",
    } as GameLogTable["created"];
  }
  get started() {
    return {
      label: "Started",
      value: this.adaptee.startedAt,
      icon: "date",
    } as GameLogTable["started"];
  }
  get finished() {
    return {
      label: "Finished",
      value: this.adaptee.finishedAt,
      icon: "date",
    } as GameLogTable["finished"];
  }
}

export class PhaseMapStateAdapter {
  constructor(
    protected readonly variant: Variant,
    protected readonly phase: Phase
  ) {}
  get provinces() {
    return this.phase.SCs.map(({ Province, Owner }) => ({
      id: Province,
      fill: getNation(Owner, this.variant).color,
      highlight: false,
    }));
  }
  get units() {
    return this.phase.Units.map(({ Province, Unit }) => ({
      province: Province,
      fill: getNation(Unit.Nation, this.variant).color,
      type: Unit.Type,
    }));
  }
  get orders() {
    return [];
  }
}

export class MapXmlAdapter {
  constructor(
    protected readonly variant: Variant,
    protected readonly phase: Phase,
    protected readonly mapXml: string,
    protected readonly armyXml: string,
    protected readonly fleetXml: string
  ) {}
  get xml() {
    return updateMap(
      this.mapXml,
      this.armyXml,
      this.fleetXml,
      new PhaseMapStateAdapter(this.variant, this.phase)
    );
  }
}
