import {
  defineConfigSchema,
  getSyncLifecycle,
  registerBreadcrumbs,
} from "@openmrs/esm-framework";
import { configSchema } from "./config-schema";
import { dashboardMeta } from "./dashboard.meta";
import {
  createDashboardLink,
  registerWorkspace,
} from "@openmrs/esm-patient-common-lib";
import carePanelComponent from "./patient-summary-widget/care-panel.component";
import patientHistoryComponent from "./patient-history-widget/patient-history-panel.component";
import carePanelPatientSummaryComponent from "./patient-summary/patient-summary.component";
import deleteRegimenConfirmationDialogComponent from "./regimen-editor/delete-regimen-modal.component";
import regimenFormComponent from "./regimen-editor/regimen-form.component";
import PatientDataComponent from "./more-patient-data-widget/more-patient-data-panel.component";
import LinkageToCommunityHealthWorkerComponent from "./linkage-to-chw-widget/linkage-to-chw-panel.component";
import WeightGraphComponent from "./weight-graph-widget/weight-panel.component";

const moduleName = "@ssemr/esm-patient-panel-app";

const options = {
  featureName: "patient-care-panels",
  moduleName,
};

export const importTranslation = require.context(
  "../translations",
  false,
  /.json$/,
  "lazy"
);

export function startupApp() {
  registerBreadcrumbs([]);
  defineConfigSchema(moduleName, configSchema);
}

export const carePanelPatientSummary = getSyncLifecycle(
  carePanelPatientSummaryComponent,
  options
);

export const deleteRegimenConfirmationDialog = getSyncLifecycle(
  deleteRegimenConfirmationDialogComponent,
  options
);

export const patientProgramSummary = getSyncLifecycle(
  carePanelComponent,
  options
);

export const patientHistory = getSyncLifecycle(
  patientHistoryComponent,
  options
);

export const patientData = getSyncLifecycle(PatientDataComponent, options);

export const linkageToCHW = getSyncLifecycle(
  LinkageToCommunityHealthWorkerComponent,
  options
);

export const weightGraph = getSyncLifecycle(WeightGraphComponent, options);

registerWorkspace({
  name: "patient-regimen-workspace",
  title: "Regimen Form",
  load: getSyncLifecycle(regimenFormComponent, options),
  canMaximize: true,
  canHide: true,
  width: "wider",
  type: "clinical-form",
});

// t('carePanel', 'Care panel')
export const carePanelSummaryDashboardLink = getSyncLifecycle(
  createDashboardLink({ ...dashboardMeta, moduleName }),
  options
);
