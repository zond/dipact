import React from "react";
import { translateKeys as tk, NationStatusDisplay } from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet, Text, View } from "react-native";
import NationAvatar from "./NationAvatar";
import { Icon } from "@rneui/base";

export interface Nation {
  abbreviation: string;
  color: string;
  flagLink: string;
  name: string;
  isUser: boolean;
}

interface NationSummaryProps {
  nationStatus: NationStatusDisplay;
}

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    nationDetails: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    nationAvatar: {
      paddingRight: theme.spacing(2),
    },
    nationName: {
      fontWeight: "bold",
    },
    nationStatus: {
      display: "flex",
      flexDirection: "row",
    },
  });
};

const NationSummary = ({
  nationStatus,
}: NationSummaryProps): React.ReactElement => {
  const { t } = useTranslation();
  const {
    confirmedOrders,
    nation,
    numSupplyCenters,
    numSupplyCentersToWin,
    wantsDraw,
    noOrdersGiven,
    numBuilds,
    numDisbands,
  } = nationStatus;
  const styles = useStyles();

  const supplyCenterCountLabel =
    numSupplyCenters !== 1
      ? tk.orders.supplyCenterCount.plural
      : tk.orders.supplyCenterCount.singular;

  const buildCountLabel =
    numBuilds !== 1
      ? tk.orders.buildCount.plural
      : tk.orders.buildCount.singular;

  const disbandCountLabel =
    numDisbands !== 1
      ? tk.orders.disbandCount.plural
      : tk.orders.disbandCount.singular;

  const supplyCentersToWinLabel = `(${numSupplyCentersToWin} to win)`;

  const nationLabel = nation.isUser ? `${nation.name} (You)` : nation.name;

  return (
    <View style={styles.root}>
      <View style={styles.nationDetails}>
        <View style={styles.nationAvatar}>
          <NationAvatar
            color={nation.color}
            nationAbbreviation={nation.abbreviation}
            nation={nation.name}
            link={nation.flagLink}
          />
        </View>
        <View>
          <Text style={styles.nationName}>{nationLabel}</Text>

          <Text>{t(supplyCenterCountLabel, { count: numSupplyCenters })}</Text>
          {nation.isUser && <Text>{supplyCentersToWinLabel}</Text>}
          {typeof numBuilds === "number" && (
            <Text>{t(buildCountLabel, { count: numBuilds })}</Text>
          )}
          {typeof numDisbands === "number" && (
            <Text>{t(disbandCountLabel, { count: numDisbands })}</Text>
          )}
          <View style={styles.nationStatus}>
            {confirmedOrders && <Icon name="fact-check" size={16} />}
            {wantsDraw && <Icon name="emoji-flags" size={16} />}
            {noOrdersGiven && <Icon name="do-not-disturb" size={16} />}
          </View>
        </View>
      </View>
    </View>
  );
};

export default NationSummary;
