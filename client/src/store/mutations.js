export const initUserInfo = (state, data) => {
  state.userInfo = {
    ...state.userInfo,
    ...data
  }
}
