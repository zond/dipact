import React from "react";
import { ScrollView } from "react-native";

import QueryContainer from "../../components/QueryContainer";
import { Stack } from "../../components/Stack";
import Table from "../../components/Table/Table";
import { useParams } from "../../hooks/useParams";
import { useVariantInfoView } from "../../../common/hooks";
import { useCommonStyles } from "../../hooks/useCommonStyles";
import { TableRow } from "../../components/Table";
import { assertDefined, findVariantByGame } from "../../../common";

const VariantInfo = () => {
  const commonStyles = useCommonStyles();
  const { gameId } = useParams<"VariantInfo">();
  const { query } = useVariantInfoView(gameId);

  return (
    <QueryContainer
      query={query}
      render={(d) => {
        const data = assertDefined(d);
        const variant = findVariantByGame(data.game, data.variants);
        return (
          <ScrollView>
            <Stack padding={1} orientation="vertical" align="flex-start">
              <Table title={"Variant settings"} style={commonStyles.section}>
                <TableRow
                  label={"Name"}
                  value={variant.name}
                  icon={"variant"}
                />
                <TableRow
                  label={"Description"}
                  value={variant.description}
                  icon={"description"}
                />
                <TableRow
                  label={"Number of players"}
                  value={variant.nations.length}
                  icon={"players"}
                />
                <TableRow
                  label={"Rules"}
                  value={variant.rules}
                  icon={"rules"}
                />
                <TableRow
                  label={"Start year"}
                  value={variant.startYear}
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

export default VariantInfo;
