import React, {Fragment, useEffect, useState} from "react";
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
import {RouteGuard} from "../components/RouteGuard";
import { meetingService } from 'services';
import * as Notification from '../modules/Notification'

const Study = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    
    // schema form
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = yup.object().shape({
        name: yup.string().required(t('name_valid_empty')),
        person: yup.string().required(t('person_valid_empty')),
        phone: yup.string().matches(phoneRegExp, t('phone_valid_empty')),
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
        inquiries: yup.string().required(t('inquiries_valid_empty')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    const [success, setSuccess] = useState(null);
    const onSubmit = ({ name, person, phone, email, inquiries }) => {
        return meetingService.requestMetting(name, person, phone, email, inquiries)
            .then(response => {
                // const message = `${t('msg_request_meeting_success')}`;
                // setSuccess({ 
                //     message: message 
                // });
                Notification.success(t('msg_request_meeting_success'));
            })
            .catch(error => {
                Notification.error(error.message);
                // setError('apiError', { message: error.message || error });
            });
    }
    
    return (
        <RouteGuard>
            <div className="main-page main-page--study">
                <Sidebar isMenuActive="study_session_request" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                    <div className="content content--no-title">
                        <div className="content__inner">
                            <div className="study">
                                <div className="study__info">
                                    <div className="study__heading bold">
                                        {t('study_heading')}
                                    </div>
                                    <div className="study__content">
                                        <div className="study__times">
                                            <div className="study__time f jcs ais">
                                                <div className="study__time-label bold">{t('study_time_1')}</div>
                                                <div className="study__time-text">
                                                    <p>{t('study_time_1_am')}</p>
                                                    <p>{t('study_time_1_pm')}</p>
                                                </div>
                                            </div>
                                            <div className="study__time f jcs ais">
                                                <div className="study__time-label bold">{t('study_time_2')}</div>
                                                <div className="study__time-text">
                                                    <p>{t('study_time_2_am')}</p>
                                                    <p>{t('study_time_2_pm')}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="study__text">
                                            {htmlReactParse(t('study_desc'))}
                                        </div>
                                    </div>
                                </div>
                                <div className="study__form">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formName">{t('name')}</label>
                                            <div className="form-value">
                                                <input type="text"
                                                       id="formName"
                                                       className="form-control"
                                                       {...register('name')}
                                                       placeholder={t('name_placeholder')}/>
                                                <div className="text-danger">{errors.name?.message}</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formPerson">{t('person')}</label>
                                            <div className="form-value">
                                                <input type="text"
                                                       id="formPerson"
                                                       className="form-control"
                                                       {...register('person')}
                                                       placeholder={t('person_placeholder')}/>
                                                <div className="text-danger">{errors.person?.message}</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formPhone">{t('phone_placeholder')}</label>
                                            <div className="form-value">
                                                <input type="text"
                                                       id="formPhone"
                                                       className="form-control"
                                                       {...register('phone')}
                                                       placeholder={t('phone_placeholder')}/>
                                                <div className="text-danger">{errors.phone?.message}</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formEmail">{t('email')}</label>
                                            <div className="form-value">
                                                <input type="text"
                                                       id="formEmail"
                                                       className="form-control"
                                                       {...register('email')}
                                                       placeholder={t('email_placeholder')} />
                                                <div className="text-danger">{errors.email?.message}</div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formInquiries">{t('inquiries')}</label>
                                            <div className="form-value">
                                            <textarea id="formInquiries"
                                                      className="form-control"
                                                      {...register('inquiries')}
                                                      placeholder={t('inquiries_placeholder')}
                                                      rows="3"></textarea>
                                                <div className="text-danger">{errors.inquiries?.message}</div>
                                            </div>
                                        </div>
                                        {errors.apiError &&
                                            <div className="text-danger error-service align-c">{errors.apiError?.message}</div>
                                        }
                                        {success &&
                                            <div className="text-success align-c">{success?.message}</div>
                                        }

                                        <div className="form-buttons f jcc aic">
                                            <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('btn_send')}</button>
                                            {/*<button className="btn btn-primary btn-block btn-gradient" type="button" onClick={() => reset()}>Reset</button>*/}
                                        </div>
                                    </form>
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

export default withTranslation()(withRouter((Study)));
