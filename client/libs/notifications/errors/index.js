import { notification } from 'antd';
import Notifications from "../../../components/Notifications";

const DEFAULT_ERROR_NOTIFICATION_CONFIG = {
  duration: 0,
}

export default defaultConfig => {
  const errorConfig = Object.assign(defaultConfig, DEFAULT_ERROR_NOTIFICATION_CONFIG);
  return {
    connectionError () {
      const { message, description, icon } = Notifications.errors.connectionError;
      notification.open({
        message,
        description,
        icon,
        ...errorConfig
      });
    },
    somethingWentWrongError () {
      const { message, description, icon } = Notifications.errors.somethingWentWrongError;
      notification.open({
        message,
        description,
        icon,
        ...errorConfig
      });
    }
  }
}