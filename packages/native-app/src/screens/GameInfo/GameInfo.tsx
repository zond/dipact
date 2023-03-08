import React from "react";

import { Stack } from "../../components/Stack";
import { useGameInfoView } from "../../../common/hooks";
import { useParams } from "../../hooks/useParams";
import Table from "../../components/Table/Table";
import { ScrollView } from "react-native";
import QueryContainer from "../../components/QueryContainer";
import { useCommonStyles } from "../../hooks/useCommonStyles";
import { TableRow } from "../../components/Table";

const GameInfo = () => {
  const commonStyles = useCommonStyles();
  const { gameId } = useParams<"GameInfo">();
  const { query } = useGameInfoView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(data) => {
        return (
          <ScrollView>
            <Stack padding={1} orientation="vertical">
              <Table title={"Game settings"} style={commonStyles.section}>
                <TableRow
                  label={"Variant"}
                  value={data.variant}
                  icon={"variant"}
                />
                <TableRow
                  label={"Phase deadline"}
                  value={data.phaseLength}
                  icon={"phaseDeadline"}
                />
                <TableRow
                  label={"Non-movement phase deadline"}
                  value={data.nonMovementPhaseLength}
                  icon={"nonMovementPhaseDeadline"}
                />
                <TableRow
                  label={"Game ends after"}
                  value={data.endYear}
                  icon={"gameEndYear"}
                />
              </Table>
              <Table title={"Management settings"} style={commonStyles}>
                <TableRow
                  label={"Game master"}
                  value={data.gameMaster?.username}
                  icon={"gameMaster"}
                />
                <TableRow
                  label={"Nation allocation"}
                  value={data.nationAllocation}
                  icon={"nationAllocation"}
                />
                <TableRow
                  label={"Visibility"}
                  value={data.visibility}
                  icon={"visibility"}
                />
              </Table>
              <Table title={"Player settings"} style={commonStyles.section}>
                <TableRow
                  label={"Player Identity"}
                  value={data.playerIdentity}
                  icon={"playerIdentity"}
                />
              </Table>
              <Table title={"Game log"} style={commonStyles.section}>
                <TableRow
                  label={"Created"}
                  value={data.createdAt}
                  icon={"date"}
                />
                <TableRow
                  label={"Started"}
                  value={data.startedAt}
                  icon={"date"}
                />
                <TableRow
                  label={"Finished"}
                  value={data.finishedAt}
                  icon={"date"}
                />
              </Table>
            </Stack>
          </ScrollView>
        );
      }}
    />
  );
};

export default GameInfo;
