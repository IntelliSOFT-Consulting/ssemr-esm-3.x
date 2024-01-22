import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  cd4ViralLoadConcepts: {
    _type: Type.Array,
    _default: ['809dd0f5-ce54-441c-b835-a2a8b06a6140', '01c3ce55-b7eb-45f5-93d5-bace353e3cfd'],
    _description: 'List of concept uuids for CD4 and Viral Load',
  },
};

export interface ConfigObject {
  cd4ViralLoadConcepts: Array<string>;
}
