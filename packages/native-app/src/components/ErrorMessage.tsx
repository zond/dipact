import { DiplicityError } from "diplicity-common-internal";
import { Icon } from "@rneui/base";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";

const useStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    root: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(1),
    },
    inner: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    message: {
      color: theme.palette.error.main,
    },
  });
};

interface ErrorMessageProps {
  error: DiplicityError;
}

interface ApiErrorWithStatus {
  status: number;
}
interface IMessageMap {
  [key: number]: string;
}

const messageMap: IMessageMap = {
  500: "Internal server error",
  401: "Unauthorized",
};

const ErrorMessage = (props: ErrorMessageProps): React.ReactElement => {
  const theme = useTheme();
  const error = props.error as ApiErrorWithStatus;
  const message = messageMap[error.status] || "";
  const styles = useStyles();
  return (
    <View style={styles.root}>
      <View style={styles.inner}>
        <Icon name="warning" color={theme.palette.error.main} />
        <Text style={styles.message}>
          {message} ({error.status})
        </Text>
      </View>
    </View>
  );
};

export default ErrorMessage;
