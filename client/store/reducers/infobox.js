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
    console.log(messageKey);
    if (state.messages.filter(key => messageKey === key).length === 0) {
        let newState = Array.from(state.messages);
        newState.push(messageKey);
        return newState;
      }
      return state;

    case types.REMOVE_INFOBOX:
    console.log(messageKey);
      return {
        messages: state.messages.filter(key => key !== messageKey)
      };

    default:
      return state;
  }
}
