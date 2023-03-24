import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

import { useFeedbackWrapper } from "../../common";

interface FeedbackWrapperProps {
  children: React.ReactNode;
}
const position = "bottom";

const FeedbackWrapper = ({
  children,
}: FeedbackWrapperProps): React.ReactElement => {
  const { t } = useTranslation();
  const { feedback, handleClose } = useFeedbackWrapper();

  useEffect(() => {
    feedback.forEach((fb) => {
      Toast.show({
        type: fb.severity,
        text1: t(fb.message),
        position,
        onHide: () => handleClose(fb.id),
      });
    });
  }, [feedback, handleClose, t]);

  return (
    <>
      {children}
      <Toast />
    </>
  );
};

export default FeedbackWrapper;
