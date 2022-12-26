import React, {useEffect, useState} from "react";
import {useRouter, withRouter} from "next/router";
import {useDispatch} from "react-redux";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";

const Accordion = props => {
    const {t, title, children} = props;
    const router = useRouter();
    const dispatch = useDispatch();
    const [isOpen, setOpen] = useState(true);
    useEffect(() => {
    }, []);

    return (
        <div className="photo__item accordion-item">
            <div
                className={`photo__item-head accordion-item__head f jcb aic ${isOpen ? "open" : ""}`}
                onClick={() => setOpen(!isOpen)}
            >
                <div className="photo__item-title accordion-item__title">{title}</div>
                <div className="photo__item-arrow accordion-item__arrow">
                    <IconSvg icon="chevron-down"/>
                </div>
            </div>
            <div className={`photo__item-body accordion-item__body ${!isOpen ? "collapsed" : ""}`}>
                <div className="photo__item-body-inner accordion-item__body-inner">
                    {children}
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

export default withTranslation()(withRouter(Accordion));

// example accordion
{/*{photoData.map((photo, index) => (*/}
{/*<Accordion title={photo.title} key={index}>*/}
{/*<div className="photo__item-check-all">*/}
{/*<div className="form-check">*/}
{/*<input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />*/}
{/*<label className="form-check-label" htmlFor="flexCheckDefault">*/}
{/*すべて選択*/}
{/*</label>*/}
{/*</div>*/}
{/*</div>*/}
{/*<PhotoItems t={t} lan={lan} key={index} items={photo.list}/>*/}
{/*</Accordion>*/}
{/*))}*/}
