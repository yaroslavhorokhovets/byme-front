export const localStorageKey = {
    ACCESS_TOKEN: "nft-access-token",
    REF_CODE: "nft-ref-code",
    LANGUAGE: "language",
    SESSION_ID: "session_id",
};

export const cookieOptions = {
    path: "/",
    domain: "",
    secure:
        typeof window !== "undefined"
            ? window.location.protocol === "https:"
            : false,
    expires: new Date(Date.now() + 86400000)
};

export const ResponseCode = {
    SUCCESS: 200,
    UNAUTHORIZED: 401,
    NOT_PERMISSION: 403,
    NOT_FOUND: 404,
    FAIL: 500
};
