import * as types from "../actions/types";

const DEFAULT_MESSAGES = []; //["GettingStarted", "InProgress"]

export default function infoboxReducer(
  state = {
    messages: DEFAULT_MESSAGES
  },
  action
) {
  let messageKey = action.payload;
  switch (action.type) {
    case types.ADD_INFOBOX:
      if (state.messages.filter(key => messageKey === key).length === 0) {
        let newMessages = Array.from(state.messages);
        newMessages.push(messageKey);
        return {
          messages: newMessages
        }
      }
      return state;

    case types.REMOVE_INFOBOX:
      return {
        messages: state.messages.filter(key => key !== messageKey)
      };

    default:
      return state;
  }
}
