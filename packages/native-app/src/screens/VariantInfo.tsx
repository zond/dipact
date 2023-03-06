import React from "react";
import { ScrollView } from "react-native";

import { VariantSettingsTableAdapter } from "../adapters/adapters";
import QueryContainer from "../components/QueryContainer";
import { Stack } from "../components/Stack";
import Table from "../components/Table";
import { useParams } from "../hooks/useParams";
import { useVariantInfoView } from "../hooks/useVariantInfoView";
import { assertDefined, findDefined } from "../utils/general";
import { useCommonStyles } from "../hooks/useCommonStyles";

const VariantInfo = () => {
  const commonStyles = useCommonStyles();
  const { gameId } = useParams<"VariantInfo">();
  const { query } = useVariantInfoView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = findDefined(
          data.variants,
          (v) => v.name === data.game.variant
        );
        const variantSettings = new VariantSettingsTableAdapter(variant);
        return (
          <ScrollView>
            <Stack padding={1} orientation="vertical" align="flex-start">
              <Table
                title={"Variant settings"}
                rows={[
                  { ...variantSettings.name },
                  { ...variantSettings.description, orientation: "vertical" },
                  { ...variantSettings.numPlayers },
                  { ...variantSettings.rules, orientation: "vertical" },
                  { ...variantSettings.startYear },
                ]}
                tableStyle={commonStyles.section}
              />
            </Stack>
          </ScrollView>
        );
      }}
    />
  );
};

export default VariantInfo;
