import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import {RouteGuard} from "../components/RouteGuard";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import { ActivityService, reportService, userService } from '../services'

const Settings = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;
    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    // schema form
    const validationSchema = yup.object().shape({
        input_setting_reset_id: yup.string()
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
        input_setting_current_password: yup.string()
            .required(t('input_setting_password_valid_empty'))
            .min(4, t('input_setting_password_required'))
            .max(12, t('input_setting_password_required')),
        input_setting_new_password: yup.string()
            .required(t('input_setting_password_valid_empty'))
            .min(4, t('input_setting_password_required'))
            .max(12, t('input_setting_password_required')),
        input_setting_re_new_password: yup.string()
            .required(t('input_setting_password_valid_empty'))
            .min(4, t('input_setting_password_required'))
            .max(12, t('input_setting_password_required')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;

    const [success, setSuccess] = useState(null);
    const onSubmit = ({ input_setting_reset_id, input_setting_current_password, input_setting_new_password, input_setting_re_new_password}) => {
        const account_id = user?._id;
            userService.updatePasswordAccount(account_id, input_setting_re_new_password, input_setting_reset_id)
            .then(response => {
                ActivityService.addActivityHistory('Web', t('msg_request_update_account_success'));
                //console.log(response);
                const message = `${t('msg_request_update_account_success')}`;
                setSuccess({
                    message: message
                });
            })
            .catch(error => {
                setError('apiError', { message: error.message || error });
            });
        return true;
    }

    const [user, setUser] = useState(null);
    useEffect(() => {
        userService.getAll().then(user => {
            setUser(user.data);
        });
    }, []);

    return (
        <RouteGuard>
            <div className="main-page main-page--settings">
                <Sidebar isMenuActive="settings"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('setting_page_title')}</h2>
                    </div>

                    <div className="content content--white">
                        <div className="content__inner">

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <h4 className="setting-login__title">{t('setting_login_id_reset_title')}</h4>
                                <div className="setting-login__form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_setting_reset_id">{t('input_setting_reset_id')}</label>
                                        <div className="form-value">
                                            <input type="text" id="notice_input_title"
                                                   className="form-control"
                                                   {...register('input_setting_reset_id')}
                                                   placeholder={t('input_setting_reset_id_placeholder')}/>
                                            <div className="text-danger">{errors.input_setting_reset_id?.message}</div>
                                        </div>
                                    </div>
                                </div>
    
    
                                <h4 className="setting-password__title">{t('setting_password_reset_title')}</h4>
                                <div className="setting-password__form">
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_setting_current_password">{t('input_setting_current_password')}</label>
                                        <div className="form-value">
                                            <input type="password"
                                                   id="input_setting_current_password"
                                                   className="form-control"
                                                   {...register('input_setting_current_password')}
                                                   placeholder={t('input_setting_current_password_placeholder')}/>
                                            <div className="text-danger">{errors.input_setting_current_password?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_setting_new_password">
                                            {t('input_setting_new_password')}
                                        </label>
                                        <div className="form-value">
                                            <input type="password"
                                                   id="input_setting_new_password"
                                                   className="form-control"
                                                   {...register('input_setting_new_password')}
                                                   placeholder={t('input_setting_new_password_placeholder')}/>
                                            <div className="text-danger">{errors.input_setting_new_password?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_setting_re_new_password">
                                            {t('input_setting_re_new_password')}
                                        </label>
                                        <div className="form-value">
                                            <input type="password"
                                                   id="input_setting_re_new_password"
                                                   className="form-control"
                                                   {...register('input_setting_re_new_password')}
                                                   placeholder={t('input_setting_re_new_password_placeholder')}/>
                                            <div className="text-danger">{errors.input_setting_re_new_password?.message}</div>
                                        </div>
                                    </div>
    
                                    {errors.apiError &&
                                    <div className="text-danger error-service align-c">{errors.apiError?.message}</div>
                                    }
                                    {success &&
                                    <div className="text-success align-c">{success?.message}</div>
                                    }

                                </div>
                                
                                <div className="settings__form-submit form-group align-c">
                                    <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('button_setting_renew')}</button>
                                </div>
                            </form>
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

export default withTranslation()(withRouter((Settings)));
