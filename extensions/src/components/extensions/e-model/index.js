
// TODO: Show validation component when
// validation data will be present in nexus

import AnalysisComponent from './analysis.vue';
import ToolsComponent from './tools.vue';


export default [{
  VueComponent: AnalysisComponent,
  attrs: {
    name: 'Analysis',
    iconType: 'bar-chart',
  },
}, {
  VueComponent: ToolsComponent,
  attrs: {
    name: 'Tools',
    iconType: 'tool',
  },
}];
