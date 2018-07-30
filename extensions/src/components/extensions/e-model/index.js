
import AnalysisComponent from '@/components/shared/analysis-component.vue';

import ToolsComponent from './tools.vue';
import ValidationsComponent from './validations.vue';


export default [{
  VueComponent: AnalysisComponent,
  attrs: {
    name: 'Analysis',
  },
}, {
  VueComponent: ValidationsComponent,
  attrs: {
    name: 'Validations',
  },
}, {
  VueComponent: ToolsComponent,
  attrs: {
    name: 'Tools',
  },
}];
