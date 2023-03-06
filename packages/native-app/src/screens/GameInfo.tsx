import React from "react";

import {
  GameLogTableAdapter,
  GameSettingsTableAdapter,
  ManagementSettingsTableAdapter,
  PlayerSettingsTableAdaper,
} from "../adapters/adapters";
import { Stack } from "../components/Stack";
import { useGameInfoView } from "../hooks/useGameInfoView";
import { useParams } from "../hooks/useParams";
import { Text } from "../components/Text";
import Table from "../components/Table";
import { ScrollView } from "react-native";
import QueryContainer from "../components/QueryContainer";
import { useCommonStyles } from "../hooks/useCommonStyles";

const GameInfo = () => {
  const commonStyles = useCommonStyles();
  const { gameId } = useParams<"GameInfo">();
  const { query } = useGameInfoView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(data) => {
        const gameSettings = new GameSettingsTableAdapter(data);
        const managementSettings = new ManagementSettingsTableAdapter(data);
        const playerSettings = new PlayerSettingsTableAdaper(data);
        const gameLog = new GameLogTableAdapter(data);
        return (
          <ScrollView>
            <Stack padding={1} orientation="vertical">
              <Table
                title={"Game settings"}
                rows={[
                  { ...gameSettings.variant },
                  { ...gameSettings.phaseDeadline },
                  { ...gameSettings.nonMovementPhaseDeadline },
                  { ...gameSettings.gameEndYear },
                ]}
                tableStyle={commonStyles.section}
              />
              <Table
                title={"Management settings"}
                rows={[
                  { ...managementSettings.gameMaster },
                  { ...managementSettings.nationAllocation },
                  { ...managementSettings.visibility },
                ]}
                tableStyle={commonStyles.section}
              />
              <Table
                title={"Player settings"}
                rows={[{ ...playerSettings.playerIdentity }]}
              />
              <Table
                title={"Game log"}
                rows={[
                  { ...gameLog.created },
                  { ...gameLog.started },
                  { ...gameLog.finished },
                ]}
              />
            </Stack>
          </ScrollView>
        );
      }}
    />
  );
};

export default GameInfo;
