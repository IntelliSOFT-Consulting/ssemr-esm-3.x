import {
  defineConfigSchema,
  getAsyncLifecycle,
  getSyncLifecycle,
} from "@openmrs/esm-framework";
import { moduleName } from "./constants";
import { configSchema } from "./config-schema";
import { homeDashboardMeta } from "./dashboard.meta";
import { createDashboardLink as createHomeDashboardLink } from "./DashboardLink";

const options = {
  featureName: "esm-reports-app",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy",
);

export function startupApp() {
  defineConfigSchema(moduleName, configSchema);
}

export const rootReportsHome = getAsyncLifecycle(
  () => import("./root.component"),
  options,
);

export const homeReportsLink = getSyncLifecycle(
  createHomeDashboardLink(homeDashboardMeta),
  options,
);
