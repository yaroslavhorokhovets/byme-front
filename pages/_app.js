import React, { useEffect, useState } from "react";
import { appWithTranslation, useTranslation } from "next-i18next";
import { Provider, useDispatch, useSelector } from "react-redux";

import { wrapper } from "../store/configureStore";
import Head from "next/head";
import { FacebookProvider } from "react-facebook";
import Loading from "../components/loading";

import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/style.scss";
import "toastr/build/toastr.min.css";
import "react-notifications/lib/notifications.css";
import router from "next/router";

if (typeof window !== "undefined") {
    require("jquery/dist/jquery.min");
    require("bootstrap/dist/js/bootstrap.bundle.min");
    require("../assets/js/source");
}

function App({ Component, pageProps }) {
    const { t } = useTranslation("common");
    const dispatch = useDispatch();
    const app = useSelector((state) => state.app);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url) => {
            url !== router.pathname ? setLoading(true) : setLoading(false);
        };
        const handleComplete = (url) => setLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleComplete);
        router.events.on("routeChangeError", handleComplete);
    }, [router]);

    return (
        <FacebookProvider appId={process.env.META_FB_APP_ID}>
            <Head>
                <link rel="shortcut icon" href={process.env.FAVICON} />
                <title>{process.env.TITLE}</title>
                <meta
                    property="fb:app_id"
                    content={process.env.META_FB_APP_ID}
                />
                <meta property="og:type" content={process.env.OG_TYPE} />
                <meta property="og:url" content={process.env.HOME_URL} />
                <meta property="og:title" content={process.env.OG_TITLE} />
                <meta property="og:image" content={process.env.OG_IMAGE} />
                <meta
                    property="og:description"
                    content={process.env.OG_DESCRIPTION}
                />
                <meta property="og:image:width" content="822" />
                <meta property="og:image:height" content="315" />
                <meta name="google-signin-client_id" content={process.env.CLIENT_ID} ></meta>
                <script src="https://accounts.google.com/gsi/client"></script>
                <script src="https://apis.google.com/js/api.js"></script>
            </Head>
            <Loading loading={loading} />  
            <Component {...pageProps} />
        </FacebookProvider>
    );
}

export default appWithTranslation(wrapper.withRedux(App));
