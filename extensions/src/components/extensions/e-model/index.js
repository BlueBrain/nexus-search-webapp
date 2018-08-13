
import AnalysisComponent from '@/components/shared/analysis-component.vue';

import ToolsComponent from './tools.vue';
import ValidationsComponent from './validations.vue';


export default [{
  VueComponent: AnalysisComponent,
  attrs: {
    name: 'Analysis',
    iconName: 'bar-chart',
  },
}, {
  VueComponent: ValidationsComponent,
  attrs: {
    name: 'Validations',
    iconName: 'safety',
  },
}, {
  VueComponent: ToolsComponent,
  attrs: {
    name: 'Tools',
    iconName: 'tool',
  },
}];
