import * as AppActionType from "../constants/AppActionType";
import * as Configs from "../modules/Configs";

const initialState = {
    isLogin:
        typeof localStorage !== "undefined"
            ? !!localStorage.getItem(Configs.localStorageKey.ACCESS_TOKEN)
            : false,
    refCode:
        typeof localStorage !== "undefined"
            ? localStorage.getItem(Configs.localStorageKey.REF_CODE)
            : null,
    language:
        typeof localStorage !== "undefined"
            ? localStorage.getItem(Configs.localStorageKey.LANGUAGE)
            : null,
    sessionId:
        typeof localStorage !== "undefined"
            ? localStorage.getItem(Configs.localStorageKey.SESSION_ID)
            : null,
    globalLoading: false,
};
export default function AppReducer(state = initialState, action) {
    switch (action.type) {
        case AppActionType.DO_LOGIN_INIT_SUCCESS:
            return state;
        default:
            return state;
    }
}
