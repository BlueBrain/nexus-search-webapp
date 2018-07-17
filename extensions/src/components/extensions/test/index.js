
import EmojiComponent from './emoji.vue';
import NonEmojiComponent from './non-emoji.vue';

export default [{
  VueComponent: EmojiComponent,
  props: {
    name: 'Emoji generator',
  },
}, {
  VueComponent: NonEmojiComponent,
  props: {
    name: 'No Emoji here',
  },
}];
