import errors from "./errors";

const DEFAULT_NOTIFICATION_CONFIG = {
  placement: 'bottomRight',
  bottom: 50,
  duration: 5,
}

export default {
  errors: errors(DEFAULT_NOTIFICATION_CONFIG)
}