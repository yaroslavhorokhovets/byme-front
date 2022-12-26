const { i18n } = require("./next-i18next.config");
module.exports = {
    i18n,
    env: {
        FAVICON: "/assets/images/favicon.ico",
        TITLE: "BYME",
        META_FB_APP_ID: "123456789",
        OG_TITLE: "BYME",
        OG_DESCRIPTION: "BYME",
        OG_IMAGE: "/assets/images/logo.jpg",
        OG_TYPE: "article",

        API_URL: "https://jsonplaceholder.typicode.com/users",
        HOME_URL: "https://byme.jp.site/homepage",
        BASE_URL: 'https://byme.jp.site/',
        BASE_PATH: "",
        CLIENT_ID: "197778587583-daa48igh2fbnv6rcstprroknhv76peb1.apps.googleusercontent.com",
        CLIENT_SECRET: "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",
        PROJECT_ID: "byme-371122",
        AUTH_URI: "https://accounts.google.com/o/oauth2/auth",
        SCOPE: "https://www.googleapis.com/auth/business.manage",
        TOKEN_URI: "https://oauth2.googleapis.com/token",
        AUTH_PROVIDER_X509_CERT_URL: "https://www.googleapis.com/oauth2/v1/certs",
        REDIRECT_URIS: [
            "http://localhost:3000",
            "https://admin-byme.com/login"
        ],
        PROMPT: "consent",
        RESPONSE_TYPE: "token",
        AUTH_URL: "https://accounts.google.com/o/oauth2/v2/auth"
    },

    // service jwt api login
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: process.env.NODE_ENV === 'development'
            ? `http://127.0.0.1:8000/api/v1.0` // development api
            : 'http://127.0.0.1:8000/api/v1.0' // production api path backup 'http://54.249.152.229:8080/api/v1.0'
    },
    
    basePath: "",
    
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    }
};