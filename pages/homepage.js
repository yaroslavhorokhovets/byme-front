import React, { Fragment } from "react";
import { withRouter } from "next/router";

// language
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

const Homepage = props => {
    const { t, i18n, isLogin } = props;
    const lan = i18n.language;

    const categoryData1 = {
        index: 1,
        title: "Xbox",
        image: "https://imgur.com/uKQqsuA.png",
        href: "/"
    }
    const categoryData2 = {
        index: 2,
        title: "PS5",
        image: "https://imgur.com/3Y1DLYC.png",
        href: "/"
    }
    const categoryData3 = {
        index: 3,
        title: "Switch",
        image: "https://imgur.com/Dm212HS.png",
        href: "/"
    }
    const categoryData4 = {
        index: 4,
        title: "PC",
        image: "https://imgur.com/qb6IW1f.png",
        href: "/"
    }
    const categoryData5 = {
        index: 4,
        title: "Accessories",
        image: "https://imgur.com/HsUfuRU.png",
        href: "/"
    }
    
    return (
        <div className="main-page main-page--index">
            <div className="main-page__container container-x">
                <div className="main-page__layout--full">
                </div>
            </div>
        </div>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((Homepage)));
