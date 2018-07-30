import { notification } from 'antd';
import Notifications from "../../../components/Notifications";

export default defaultConfig => {
  return {
    loggedOut () {
      const { message, description, icon } = Notifications.messages.loggedOut;
      notification.open({
        message,
        description,
        icon,
        ...defaultConfig
      });
    }
  }
}