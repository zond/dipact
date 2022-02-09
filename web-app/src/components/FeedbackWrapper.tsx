import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import useFeedbackWrapper from "../hooks/useFeedbackWrapper";

interface FeedbackWrapperProps {
  children: React.ReactNode;
}

const FeedbackWrapper = ({
  children,
}: FeedbackWrapperProps): React.ReactElement => {
  const { t } = useTranslation();
  const { feedback, handleClose } = useFeedbackWrapper();

  return (
    <>
      {children}
      {feedback.map(({ id, message, severity }) => (
        <Snackbar
          key={id}
          open={true}
          onClose={() => handleClose(id)}
          message={message}
          // Note, default TransitionComponent causes tests to fail. Not sure why.
          TransitionComponent={({ children }) => children}
        >
          <Alert severity={severity}>{t(message)}</Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default FeedbackWrapper;
