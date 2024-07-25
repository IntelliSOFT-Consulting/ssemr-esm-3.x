export const spaRoot = window['getOpenmrsSpaBase']();
export const basePath = '/patient/:patientUuid/chart';
export const dashboardPath = `${basePath}/:view/*`;
export const spaBasePath = `${window.spaBase}${basePath}`;
export const moduleName = '@ssemr/esm-patient-chart-app';
export const patientChartWorkspaceSlot = 'patient-chart-workspace-slot';
export const patientChartWorkspaceHeaderSlot = 'patient-chart-workspace-header-slot';
export const omrsDateFormat = 'YYYY-MM-DDTHH:mm:ss.SSSZZ';
