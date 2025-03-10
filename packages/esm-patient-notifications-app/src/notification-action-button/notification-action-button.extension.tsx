import React from "react";
import { useTranslation } from "react-i18next";
import { ActionMenuButton } from "@openmrs/esm-framework";
import { Notification } from "@carbon/react/icons";
import { useLaunchWorkspaceRequiringVisit } from "@openmrs/esm-patient-common-lib";

const AiModelActionButton: React.FC = () => {
  const { t } = useTranslation();
  const launchNotificationWorkSpace =
    useLaunchWorkspaceRequiringVisit("notifications");

  return (
    <ActionMenuButton
      getIcon={() => <Notification />}
      label={t("notifiations", "Notifications")}
      iconDescription={t("notifications", "Notifications")}
      handler={launchNotificationWorkSpace}
      type={"button"}
    />
  );
};

export default AiModelActionButton;
