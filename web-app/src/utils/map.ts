import { Order, Phase, SCState, Unit, UnitState } from "../store/types";

type MapPhase = Omit<Phase, "Units"> & {
  SupplyCenters: { [key: string]: string };
  Units: UnitState[] | { [key: string]: Unit };
};

// TODO test
export const filterOk = (
  filter: string,
  province: string,
  orders: Order[],
  currentNation: string
) => {
  // TODO docstring
  const parts = filter.split(":");
  if (parts[0] === "MAX") {
    if (
      orders.find((order) => {
        return order.Parts[0] === province;
      })
    ) {
      return true;
    }
    return !(
      orders.filter((o) => {
        return o.Parts[1] === parts[1] && o.Nation === currentNation;
      }).length > Number.parseInt(parts[2])
    );
  }
  return true;
};

export enum CommandType {
  Clear = "Clear",
  SC = "SC",
  Unit = "Unit",
}

export enum PieceType {
  Army = "Army",
  Fleet = "Fleet",
}

type ParsedCommand = {
  owner: string;
  pieceType: PieceType;
  province: string;
  provinceAndVariant: string;
  type: CommandType;
};

// TODO test
export const parseCommand = (parts: string[]): ParsedCommand => {
  // TODO docstring
  const provinceAndVariant = parts[1];
  const owner = parts[3];
  const type = parts[2] as CommandType;
  const pieceType = parts[4] as PieceType;
  const province = provinceAndVariant.split("/")[0];
  return {
    owner,
    pieceType,
    province,
    provinceAndVariant,
    type,
  };
};

// TODO test
export const createSC = (province: string, owner: string): SCState => {
  return { Province: province, Owner: owner };
};

// TODO test
export const handleLaboratorySCCommand = (
  phase: MapPhase,
  parsedCommand: ParsedCommand
): MapPhase => {
  /* Handler for SC command in laboratory mode. */
  const { owner, province } = parsedCommand;
  const newPhase = { ...phase };
  if (phase.SCs) {
    const SCs = phase.SCs.filter((sc) => sc.Province !== province);
    if (owner !== "Neutral") {
      const newSC = createSC(province, owner);
      SCs.push(newSC);
    }
    newPhase.SCs = SCs;
  } else {
    const supplyCenters = { ...phase.SupplyCenters };
    delete supplyCenters[province];
    if (owner !== "Neutral") {
      supplyCenters[province] = owner;
    }
    newPhase.SupplyCenters = supplyCenters;
  }
  return newPhase;
};

// TODO test
export const handleLaboratoryUnitCommand = (
  phase: MapPhase,
  parsedCommand: ParsedCommand
): MapPhase => {
  /* Handler for Units command in laboratory mode. */
  const { province, provinceAndVariant, pieceType, owner } = parsedCommand;
  const phaseUnits = phase.Units;
  const newPhase = { ...phase };
  if (phaseUnits instanceof Array) {
    const phaseUnits = phase.Units as UnitState[];
    const units = phaseUnits.filter(
      (u) =>
        u.Province !== provinceAndVariant &&
        u.Province.split("/")[0] !== province
    );
    if (owner !== "None") {
      const prov = pieceType === PieceType.Army ? province : provinceAndVariant;
      units.push({
        Province: prov,
        Unit: { Type: pieceType, Nation: owner },
      });
      newPhase.Units = units;
    }
  } else {
    const units = { ...phaseUnits };
    delete units[provinceAndVariant];
    delete units[province];
    if (owner !== "None") {
      const prov = pieceType === PieceType.Army ? province : provinceAndVariant;
      units[prov] = {
        Type: pieceType,
        Nation: owner,
      };
    }
    newPhase.Units = units;
  }
  return newPhase;
};

// TODO test
export const handleLaboratoryClearCommand = (
  orders: Order[],
  parts: string[],
  labPlayAs: string
): Order[] => {
  const { province } = parseCommand(parts);
  return [
    ...orders.filter((order) => {
      return order.Parts[0].split("/")[0] !== province;
    }),
  ];
};

// TODO test
export const handleLaboratoryOtherCommand = (
  orders: Order[],
  parts: string[],
  labPlayAs: string
): Order[] => {
  const newOrders = [
    ...orders.filter((order) => {
      return order.Parts[0] !== parts[0];
    }),
  ];
  newOrders.push({
    Parts: parts,
    Nation: labPlayAs,
    PhaseOrdinal: 1, // TODO
    GameID: "1", // TODO
  });
  return newOrders;
};

// TODO test
export const getLaboratoryPhaseCommandHandler = (
  type: CommandType.SC | CommandType.Unit
) => {
  const laboratoryCommandMap = {
    [CommandType.SC]: handleLaboratorySCCommand,
    [CommandType.Unit]: handleLaboratoryUnitCommand,
  };
  return laboratoryCommandMap[type];
};

// TODO test
export const handleLaboratoryPhaseCommand = (
  phase: MapPhase,
  parts: string[]
): MapPhase => {
  const parsedCommand = parseCommand(parts);
  const handler = getLaboratoryPhaseCommandHandler(
    parsedCommand.type as CommandType.SC | CommandType.Unit
  );
  return handler(phase, parsedCommand);
};

// TODO test
export const getLaboratoryOrderCommandHandler = (
  type: CommandType.Clear | string
) => {
  return type === CommandType.Clear
    ? handleLaboratoryClearCommand
    : handleLaboratoryOtherCommand;
};

// TODO test
export const handleLaboratoryOrderCommand = (
  orders: Order[],
  parts: string[],
  labPlayAs: string,
): Order[] => {
  const parsedCommand = parseCommand(parts);
  const handler = getLaboratoryOrderCommandHandler(parsedCommand.type);
  return handler(orders, parts, labPlayAs);
};
