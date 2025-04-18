import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { getPatientUuidFromStore } from "@openmrs/esm-patient-common-lib";
import usePatientNotifications from "../hooks/usePatientNotifications";
import NotificationActionButton from "../notification-action-button/notification-action-button.extension";
import { ActionableNotification } from "@carbon/react";
import { launchWorkspace } from "@openmrs/esm-framework";

const NotificationToastWrapper: React.FC = () => {
  const { t } = useTranslation();
  const patientUuid = getPatientUuidFromStore();
  const { notifications } = usePatientNotifications(patientUuid);
  const [showToast, setShowToast] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  const launchNotificationWorkSpace = useCallback(() => {
    launchWorkspace("notifications");
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      setShowToast(true);
    }
  }, [notifications]);

  return (
    <>
      {showToast && (
        <div
          style={{
            position: "absolute",
            zIndex: 9999,
            marginTop: "2px",
            left: buttonRef.current?.offsetLeft ?? 0,
            top: buttonRef.current?.offsetTop ?? 0,
            transform: "translate(-100%, -60%)",
          }}
        >
          <ActionableNotification
            kind="error"
            lowContrast={false}
            title={t("notificationsAlert", "Patient Notifications:")}
            subtitle={t(
              "notificationsSubtitle",
              "This patient has notifications that need your attention."
            )}
            actionButtonLabel={t("viewNotifications", "View Notifications")}
            onActionButtonClick={() => {
              setShowToast(false);
              launchNotificationWorkSpace();
            }}
            onClose={() => setShowToast(false)}
            timeout={0}
          />
        </div>
      )}

      <div ref={buttonRef}>
        <NotificationActionButton />
      </div>
    </>
  );
};

export default NotificationToastWrapper;
