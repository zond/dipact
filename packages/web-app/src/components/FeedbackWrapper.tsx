import React from "react";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import { useFeedbackWrapper } from "@diplicity/common";

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
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert severity={severity}>{t(message)}</Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default FeedbackWrapper;
