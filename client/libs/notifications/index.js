import errors from "./errors";
import messages from "./messages";

const DEFAULT_NOTIFICATION_CONFIG = {
  placement: 'topRight',
  bottom: 50,
  duration: 5,
}

export default {
  errors: errors(DEFAULT_NOTIFICATION_CONFIG),
  messages: messages(DEFAULT_NOTIFICATION_CONFIG)
}