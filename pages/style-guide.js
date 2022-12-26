import React, {useEffect} from "react";
import { useRouter, withRouter } from "next/router";
import {connect, useDispatch} from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "next-i18next";
import Typography from "../components/style-guide/typography";
import Buttons from "../components/style-guide/buttons";

const StyleGuide = props => {
    const { t } = props;
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {}, []);

    return (
        <div className="main-page main-page--style-guide">
            <div className="main-page__container container-x">
                <div className="main-page__layout--full">
                    <Typography t={t}/>

                    <Buttons t={t}/>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((StyleGuide)));
