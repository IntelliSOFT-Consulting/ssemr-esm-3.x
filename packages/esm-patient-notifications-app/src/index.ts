import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import NotificationsActionButton from "./notification-action-button/notification-action-button.extension";

const moduleName = "@ssemr/esm-patient-notifications-app";

const options = {
  featureName: "notifications",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);
// export const navbarButtons = getSyncLifecycle(NavbarActionButton, options);

// export const patientFlag = getSyncLifecycle(patientFlagsComponent, options);

export const notificationsLaunchButton = getSyncLifecycle(
  NotificationsActionButton,
  options
);

export const notificationWorkspace = getAsyncLifecycle(
  () => import("./components/notification.component"),
  options
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}
