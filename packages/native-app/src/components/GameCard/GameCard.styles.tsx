import React from "react";
import { StyleProp, ViewStyle, TextStyle } from "react-native";
import { GameDisplay } from "@diplicity/common";

import { useTheme } from "../../hooks/useTheme";

// TODO move to GameDisplay
type OrdersStatus = "Confirmed" | "NotConfirmed";

type StyleProps = {
    ordersStatus?: OrdersStatus
}

export const useStyles = ({ ordersStatus }: StyleProps): { [key: string]: StyleProp<ViewStyle> | StyleProp<TextStyle> } => {
    const theme = useTheme();
    return {
        root: {
            padding: theme.spacing(1),
            backgroundColor: theme.palette.paper.main
        },
        nameRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        name: {
            fontSize: 16,
        },
        nameContainer: {
            width: "80%",
        },
        chipButton: {
            paddingHorizontal: theme.spacing(.25),
            paddingVertical: theme.spacing(.2),
            backgroundColor: ordersStatus === "Confirmed" ? theme.palette.confirmed.main : theme.palette.notConfirmed.main
        },
        chipTitle: {
            color: ordersStatus === "Confirmed" ? theme.palette.confirmed.contrastText : theme.palette.notConfirmed.contrastText
        },
        columns: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        deadline: {
            color: theme.palette.text.main,
            fontWeight: "bold",
            marginLeft: theme.spacing(1),
        },
        moreButton: {
            backgroundColor: "transparent",
            color: theme.palette.text.light,
            padding: 0,
        },
        summaryRow: {
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: theme.spacing(1),
            paddingBottom: theme.spacing(1),
        },
        icons: {
            display: "flex",
            flexDirection: "row",
        },
        secondaryText: {
            color: theme.palette.text.light,
            fontSize: 14,
        },
        chatLanguageContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        playersRulesRow: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        playersRow: {
            display: "flex",
            flexDirection: "row",
        },
        playerAvatar: {
            marginRight: -8
        },
        rulesRow: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
    };
};