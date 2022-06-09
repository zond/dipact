import { useOrders, translateKeys as tk } from "@diplicity/common";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import NationOrders from "../components/NationOrders";
import PhaseSelector from "../components/PhaseSelector";
import Button from "../components/Button";
import { useTheme } from "../hooks/useTheme";
import { Dialog } from "@rneui/base";

interface OrdersProps {
  gameId: string;
}

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      flex: 1,
    },
    button: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      paddingRight: theme.spacing(1),
      paddingLeft: theme.spacing(1),
    },
    buttonGroup: {
      position: "absolute",
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      display: "flex",
      alignItems: "flex-end",
      flexDirection: "row",
      backgroundColor: "#00000000",
    },
    buttonContainer: {
      marginBottom: theme.spacing(1),
      borderRadius: 8,
    },
    nationOrdersContainer: {
      marginBottom: theme.spacing(10),
    },
    dialogOverlay: {
      padding: 0,
    },
    dialogInner: {
      backgroundColor: theme.palette.paper.main,
    },
    dialogButton: {
      backgroundColor: theme.palette.paper.main,
      padding: theme.spacing(2),
    },
    dialogButtonContainer: {
      marginLeft: 0,
    },
    dialogButtonTitle: {
      color: theme.palette.text.main,
    },
  });
};

const Orders = ({ gameId }: OrdersProps) => {
  const {
    isLoading,
    isFetching,
    isError,
    error,
    nationStatuses,
    noOrders,
    ordersConfirmed,
    phaseStateIsLoading,
    isCurrentPhase,
    toggleAcceptDraw,
    toggleConfirmOrders,
    userIsMember,
  } = useOrders(gameId);
  const styles = useStyles();
  const { t } = useTranslation();
  const theme = useTheme();

  const [moreOptionsOpen, setMoreOptionsOpen] = useState(false);

  return (
    <View style={styles.root}>
      {isLoading ? (
        <Loading size={"large"} />
      ) : isError && error ? (
        <ErrorMessage error={error} />
      ) : (
        <>
          <PhaseSelector gameId={gameId} />
          {isFetching ? (
            <Loading />
          ) : (
            <>
              <ScrollView>
                <View style={styles.nationOrdersContainer}>
                  {nationStatuses.map((nationStatus) => (
                    <NationOrders
                      nationStatus={nationStatus}
                      key={nationStatus.nation.name}
                    />
                  ))}
                </View>
              </ScrollView>
              {userIsMember && isCurrentPhase && (
                <View>
                  <View style={styles.buttonGroup}>
                    <Button
                      title={t(tk.orders.confirmOrdersButton.label)}
                      accessibilityLabel={t(
                        tk.orders.confirmOrdersButton.label
                      )}
                      iconProps={{
                        type: "material-ui",
                        name: ordersConfirmed
                          ? "check-box"
                          : "check-box-outline-blank",
                        size: 20,
                      }}
                      containerStyle={styles.buttonContainer}
                      buttonStyle={styles.button}
                      onPress={toggleConfirmOrders}
                      disabled={phaseStateIsLoading || noOrders}
                    />
                    <Button
                      iconProps={{
                        type: "material-ui",
                        name: "more-vert",
                        size: 20,
                      }}
                      containerStyle={styles.buttonContainer}
                      buttonStyle={styles.button}
                      onPress={() => setMoreOptionsOpen(true)}
                      accessibilityLabel={"more options"}
                    />
                  </View>
                  <Dialog
                    isVisible={moreOptionsOpen}
                    onBackdropPress={() => setMoreOptionsOpen(false)}
                    overlayStyle={styles.dialogOverlay}
                  >
                    {moreOptionsOpen && (
                      <View style={styles.dialogInner}>
                        <Button
                          title={t(tk.orders.toggleDiasButton.label)}
                          accessibilityLabel={t(
                            tk.orders.toggleDiasButton.label
                          )}
                          onPress={toggleAcceptDraw}
                          buttonStyle={styles.dialogButton}
                          containerStyle={styles.dialogButtonContainer}
                          titleStyle={styles.dialogButtonTitle}
                          disabled={phaseStateIsLoading}
                          iconProps={{
                            name: "emoji-flags",
                            type: "material-ui",
                            color: theme.palette.text.main,
                            size: 20,
                          }}
                        />
                      </View>
                    )}
                  </Dialog>
                </View>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

export default Orders;
