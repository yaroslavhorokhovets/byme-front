import React, {useEffect} from "react";
import {useRouter, withRouter} from "next/router";
import {useDispatch} from "react-redux";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";

const Typography = props => {
    const {t} = props;
    const router = useRouter();
    const dispatch = useDispatch();
    useEffect(() => {
    }, []);

    return (
        <div className="typography">
            <div className="typography__inner">
                <h1 className="typography__title h1 mb1">Desktop/Mobile Typography </h1>
                <div className="typography__grid f jcs aic">
                    <div className="typography__column">
                        <h3 className="typography__column-title h3 border--b mb1 pb025">Display Regular</h3>

                        {/* heading regular width class regular */}
                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Large</p>
                        <h1 className="typography__column-title h1 regular mb2">Almost before we knew it, we had left the ground.</h1>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Medium</p>
                        <h2 className="typography__column-title h2 regular mb2">Almost before we knew it, we had left the ground.</h2>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Small</p>
                        <h3 className="typography__column-title h3 regular mb2">Almost before we knew it, we had left the ground.</h3>
                    </div>

                    <div className="typography__column">
                        <h3 className="typography__column-title h3 border--b mb1 pb025">Display Bold</h3>

                        {/* heading bold with class bold */}
                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Large</p>
                        <h1 className="typography__column-title h1 bold mb2">Almost before we knew it, we had left the ground.</h1>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Medium</p>
                        <h2 className="typography__column-title h2 bold mb2">Almost before we knew it, we had left the ground.</h2>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Display Small</p>
                        <h3 className="typography__column-title h3 bold mb2">Almost before we knew it, we had left the ground.</h3>
                    </div>
                </div>

                {/* Text Link */}
                <div className="typography__grid f jcs aic">
                    <div className="typography__column">
                        <h3 className="typography__column-title h3 border--b mb1 pb025">TEXT</h3>

                        {/* Text Link regular width class regular */}
                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Large</p>
                        <p className="typography__column-title p-large regular mb2">Almost before we knew it, we had left the ground.</p>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Medium</p>
                        <p className="typography__column-title p-medium regular mb2">Almost before we knew it, we had left the ground.</p>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Small</p>
                        <p className="typography__column-title p-small regular mb2">Almost before we knew it, we had left the ground.</p>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text X-Small</p>
                        <p className="typography__column-title p-x-small regular mb2">Almost before we knew it, we had left the ground.</p>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text XX-Small</p>
                        <p className="typography__column-title p-xx-small regular mb2">Almost before we knew it, we had left the ground.</p>
                    </div>

                    <div className="typography__column">
                        <h3 className="typography__column-title h3 border--b mb1 pb025">Link</h3>

                        {/* Text Link bold with class bold */}
                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Large</p>

                        <a className="typography__column-title block p-large bold pb2">Almost before we knew it, we had left the ground.</a>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Medium</p>
                        <a className="typography__column-title block p-medium bold mb2">Almost before we knew it, we had left the ground.</a>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text Small</p>
                        <a className="typography__column-title block p-small bold mb2">Almost before we knew it, we had left the ground.</a>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text X-Small</p>
                        <a className="typography__column-title block p-x-small bold mb2">Almost before we knew it, we had left the ground.</a>

                        <p className="typography__column-comment p-small c-gray uppercase mb2">Text XX-Small</p>
                        <a className="typography__column-title block p-xx-small bold mb2">Almost before we knew it, we had left the ground.</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter(Typography));
