import { all, put, call } from "redux-saga/effects";
import { spawnTask } from "./Utils";
import * as AppActionType from "../constants/AppActionType";
import * as Configs from "../modules/Configs";

export function* doLoginInit({ payload }) {
    try {
        const loginInitResponse = payload.loginInitResponse;
        const hash = loginInitResponse.data.hash;
        const refCode = hash;
        
        const userInfo = loginInitResponse.data.accountInfoVo;
        const language = userInfo.lang;

        localStorage.setItem(Configs.localStorageKey.REF_CODE, refCode);
        localStorage.setItem(Configs.localStorageKey.LANGUAGE, language);

        yield put({
            type: AppActionType.DO_LOGIN_INIT_SUCCESS,
            payload: {
                isLogin: true,
                refCode: refCode,
                language: language,
            }
        });
    } catch (e) {
        console.log(e);
    }
}

export function* doLoginSubmit({ payload }) {
    try {
        const loginSubmitResponse = payload.loginSubmitResponse;

        const accessToken = loginSubmitResponse.data.data.token;

        const sessionId = payload.sessionId;

        localStorage.setItem(Configs.localStorageKey.ACCESS_TOKEN, accessToken);
        localStorage.setItem(Configs.localStorageKey.SESSION_ID, sessionId);

        yield put({
            type: AppActionType.DO_LOGIN_SUBMIT_SUCCESS,
            payload: {
                accessToken: accessToken,
                sessionId: sessionId
            }
        });
    } catch (e) {
        console.log(e);
    }
}

export function* doLogout() {
    try {
        localStorage.removeItem(Configs.localStorageKey.REF_CODE);
        localStorage.removeItem(Configs.localStorageKey.ACCESS_TOKEN);
        localStorage.removeItem(Configs.localStorageKey.LANGUAGE);
        yield put({
            type: AppActionType.DO_LOGOUT_SUCCESS
        });
    } catch (e) {
        console.log(e);
    }
}

export function* appSaga() {
    yield all([
        spawnTask(AppActionType.DO_LOGIN_INIT, doLoginInit),
        spawnTask(AppActionType.DO_LOGIN_SUBMIT, doLoginSubmit),
        spawnTask(AppActionType.DO_LOGOUT, doLogout),
    ]);
}
