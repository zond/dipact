import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";

import { useStyles } from "./GameCard.styles";
import Skeleton from "../Skeleton";
import { useTheme } from "../../hooks/useTheme";

const GameCardSkeleton = () => {
    const theme = useTheme();
    const styles = useStyles({ ordersStatus: undefined });
    return (
        <View style={styles.root}>
            <View style={styles.nameRow}>
                <Skeleton height={24} width={180} />
                <Skeleton circle height={24} width={24} />
            </View>
            <View style={styles.summaryRow}>
                <Skeleton height={20} width={90} />
                <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Skeleton circle height={24} width={120} />
                    <View style={{ paddingLeft: theme.spacing(1) }}>
                        <Skeleton height={20} width={20} />
                    </View>
                </View>
            </View>
            <View style={styles.playersRulesRow}>
                <Skeleton height={24} width={180} />
                <Skeleton height={16} width={90} />
            </View>
        </View>
    )
}

export default GameCardSkeleton