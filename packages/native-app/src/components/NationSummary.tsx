import React from "react";
// import NationAvatar from "./NationAvatar.new";
import { translateKeys as tk, NationStatusDisplay } from "@diplicity/common";
import { useTranslation } from "react-i18next";
import { useTheme } from "../hooks/useTheme";
import { StyleSheet, Text, View } from "react-native";

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

// const useStyles = makeStyles((theme) => ({
// }));

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
    },
    nationDetails: {
      display: "flex",
    },
    nationStatus: {
      display: "flex",
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
        <View>
          {/* <NationAvatar
            color={nation.color}
            nationAbbreviation={nation.abbreviation}
            nation={nation.name}
            link={nation.flagLink}
          /> */}
        </View>
        <View>
          <Text>{nationLabel}</Text>
          <Text>{t(supplyCenterCountLabel, { count: numSupplyCenters })}</Text>
          {nation.isUser && <Text>{supplyCentersToWinLabel}</Text>}
          {typeof numBuilds === "number" && (
            <Text>{t(buildCountLabel, { count: numBuilds })}</Text>
          )}
          {typeof numDisbands === "number" && (
            <Text>{t(disbandCountLabel, { count: numDisbands })}</Text>
          )}
        </View>
      </View>
      <View style={styles.nationStatus}>
        {/* {confirmedOrders && (
          <Tooltip title={t(tk.orders.confirmedIconTooltip) as string}>
            <OrdersConfirmedIcon />
          </Tooltip>
        )}
        {wantsDraw && (
          <Tooltip title={t(tk.orders.wantsDrawIconTooltip) as string}>
            <WantsDrawIcon />
          </Tooltip>
        )}
        {noOrdersGiven && (
          <Tooltip title={t(tk.orders.noOrdersGivenIconTooltip) as string}>
            <NoOrdersGivenIcon />
          </Tooltip>
        )} */}
      </View>
    </View>
  );
};

export default NationSummary;
