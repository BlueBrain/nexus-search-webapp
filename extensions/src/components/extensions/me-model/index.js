
import AnalysisComponent from '@/components/shared/analysis-component.vue';
import ToolsComponent from './tools.vue';

export default [{
  VueComponent: AnalysisComponent,
  attrs: {
    name: 'Analysis',
  },
}, {
  VueComponent: ToolsComponent,
  attrs: {
    name: 'Tools',
  },
}];
