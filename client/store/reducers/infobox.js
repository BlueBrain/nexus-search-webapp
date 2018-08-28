import * as types from "../actions/types";

export default function infoboxReducer(
  state = {
    messages: ["GettingStarted", "InProgress"]
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
