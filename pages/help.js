import React, {Fragment, useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import IconSvg from "components/icon/";
import {RouteGuard} from "../components/RouteGuard";
import { questionService } from 'services';
import * as Notification from '../modules/Notification'

const Help = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    // schema form
    const validationSchema = yup.object().shape({
        fullname: yup.string().required(t('fullname_valid_empty')),
        question: yup.string().required(t('question_valid_empty')),
        
        email: yup.string(t('email_valid_empty'))
            .required(t('email_valid_empty'))
            .test('test-name', t('email_valid_required'), function(value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
                let isValidEmail = emailRegex.test(value);
                let isValidPhone = phoneRegex.test(value);
                if (!isValidEmail && !isValidPhone ) {
                    return false;
                }
                return true;
            }),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;

    const [success, setSuccess] = useState(null);
    const onSubmit = ({ fullname, email, question }) => {
        return questionService.question(fullname, email, question)
            .then(response => {
                // const message = `${t('msg_request_help_success')}`;
                // setSuccess({
                //     message: message
                // });
                Notification.success(t('msg_request_help_success'));
            })
            .catch(error => {
                // setError('apiError', { message: error.message || error });
                Notification.error(error.message);
            });
    }

    useEffect(() => {
    }, []);


    return (
        <RouteGuard>
            <div className="main-page main-page--help">
                <Sidebar isMenuActive="inquiry" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('page_title_help')}</h2>
                    </div>

                    <div className="content content--white content--help">
                        <div className="content__inner">
                            <div className="help f jcs ais">
                                <div className="help__form">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="fullname">{t('fullname')} <span className="text-danger">*</span></label>
                                            <div className="form-value">
                                                <IconSvg icon="user" />
                                                <input type="text"
                                                       id="fullname"
                                                       className="form-control"
                                                       {...register('fullname')}
                                                       placeholder={t('fullname_placeholder')}/>
                                                <div className="text-danger">{errors.fullname?.message}</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="email">{t('email')} <span className="text-danger">*</span></label>
                                            <div className="form-value">
                                                <IconSvg icon="email" />
                                                <input type="text"
                                                       id="email"
                                                       className="form-control"
                                                       {...register('email')}
                                                       placeholder={t('email_placeholder')}/>
                                            </div>
                                            <div className="text-danger">{errors.email?.message}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="question">{t('question')}</label>
                                            <div className="form-value">
                                                <textarea type="text"
                                                       id="question"
                                                       className="form-control"
                                                       {...register('question')}
                                                       placeholder={t('question_placeholder')} rows="4">
                                                </textarea>
                                                <div className="text-danger">{errors.question?.message}</div>
                                            </div>
                                        </div>
                                
                                        {errors.apiError &&
                                        <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div>
                                        }
                                        {success &&
                                        <div className="text-success align-c mb-4">{success?.message}</div>
                                        }

                                        <div className="form-buttons f jcc aic">
                                            <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('btn_send')}</button>
                                        </div>
                                    </form>
                                </div>
                                
                                <div className="help__info">
                                    <div className="help__info-logo image--contain ratio">
                                        <img className="image__img"
                                             src={`${process.env.BASE_PATH}/assets/images/logo-block.png`} alt="help"/>
                                    </div>
                                    
                                    <div className="help__info-location f jcs aic mt1">
                                        <IconSvg icon="help_map"/>
                                        <p className="mb0">{t('help_location')}</p>
                                    </div>

                                    {/*<div className="help__info-phone f jcs aic mt1">*/}
                                        {/*<IconSvg icon="help_phone"/>*/}
                                        {/*<p className="mb0">0398-854-632</p>*/}
                                    {/*</div>*/}

                                    <div className="help__info-mail f jcs aic mt1">
                                        <IconSvg icon="help_mail"/>
                                        <p className="mb0">info@app-byme.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((Help)));
