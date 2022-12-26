import React, {useState, useEffect} from "react";
import {useRouter, withRouter} from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import { userService, LoadingService } from 'services';
import IconSvg from "../components/icon/";
import { ActivityService } from '../services'
import * as Notification from '../modules/Notification'
import HTMLReactParser from "html-react-parser";

const ResetPassword = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;
    const router = useRouter();
    const [success, setSuccess] = useState(null);
    const loginUrl = '/login';

    // schema form
    const validationSchema = yup.object().shape({
        code: yup.string()
            .required(t('input_valid_empty'))
            .min(4, t('otp_valid_required')),
        request_code: yup.string()
            .required(t('input_valid_empty'))
            .min(4, t('otp_valid_required')),
        email: yup.string(t('username_valid_empty'))
            .required(t('username_valid_empty'))
            .test('test-name', t('username_valid_required'), function(value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                const phoneRegex = /^(\+91-|\+91|0)?\d{10}$/; // Change this regex based on requirement
                let isValidEmail = emailRegex.test(value);
                let isValidPhone = phoneRegex.test(value);
                if (!isValidEmail && !isValidPhone ) {
                    return false;
                }
                return true;
            }),
        new_password: yup.string()
            .required(t('input_valid_empty'))
            .min(4, t('password_valid_required'))
            .max(12, t('password_valid_required')),
        confirm_password: yup.string()
            .required(t('input_valid_empty'))
            .min(4, t('password_valid_required'))
            .max(12, t('password_valid_required')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ email, request_code, code, new_password }) => {
        return userService.resetPassword(email, request_code, code, new_password)
            .then(response => {
                ActivityService.addActivityHistory('Web', t('activity_history_reset_password'));
                const message = `(${email}) ${t('msg_reset_password')}`;
                Notification.success(message);
            })
            .catch(error => {
                Notification.error(t('msg_reset_password_errors'));
            });
    }

    const [randomImages, setRandomImages] = useState([]);
    useEffect(() => {
        LoadingService.getRandomImages().then(response => {
            setRandomImages(response);
        });
    }, []);

    return (
        <main className="main-page main-page--login">
            <section className="login login--account-recovery">
                <div className="login__container container">
                    <div className="login__inner f jcc aic">
                        <div className="login__block">
                            {/* <h4 className="h4 bold">{t('login_block_title')}</h4> */}
                            <div className="login__block-logo image--contain ratio">
                                <img className="image__img"
                                     src={`${process.env.BASE_PATH}/assets/images/logo-block.png`} alt="logo"/>
                            </div>
                            <p className="p align-c mt-3">{HTMLReactParser(t('login_block_content'))}</p>
                            <div className="random__images f fw jcc aic">
                                {randomImages.map((item, index) => (
                                    <div key={index} className="random__image image--cover ratio">
                                        <img className="image__img"
                                             src={`${item}`}
                                             alt="logo"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="login__form">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="login__form-inner">
                                    <div className="login__form-logo image--contain ratio">
                                        <img className="image__img"
                                             src={`${process.env.BASE_PATH}/assets/images/logo-block.png`} alt="logo"/>
                                    </div>
                                    <h4 className="h4 bold">{t('reset_password_form_title')}</h4>
                                    
                                    <div className="login__form-block">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formRequestOTP">
                                                {t('request_code')}
                                            </label>
                                            <IconSvg icon="key" />
                                            <input type="text"
                                                   id="formRequestOTP"
                                                   className="form-control"
                                                   {...register('request_code')}
                                                   placeholder={t('request_code_placeholder')}/>
                                            <div className="text-danger">{errors.request_code?.message}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formOTP">
                                                {t('otp')}
                                            </label>
                                            <IconSvg icon="key" />
                                            <input type="text"
                                                   id="formOTP"
                                                   className="form-control"
                                                   {...register('code')}
                                                   placeholder={t('otp_placeholder')}/>
                                            <div className="text-danger">{errors.code?.message}</div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formEmail">
                                                {t('email')}
                                            </label>
                                            <IconSvg icon="email" />
                                            <input type="text"
                                                   id="formEmail"
                                                   className="form-control"
                                                   {...register('email')}
                                                   placeholder={t('email_placeholder')}/>
                                            <div className="text-danger">{errors.email?.message}</div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formNewPassword">
                                                {t('new_password')}
                                            </label>
                                            <IconSvg icon="pass" />
                                            <input type="password"
                                                   id="formNewPassword"
                                                   className="form-control"
                                                   {...register('new_password')}
                                                   placeholder={t('new_password_placeholder')}/>
                                            <div className="text-danger">{errors.new_password?.message}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formConfirmPassword">
                                                {t('confirm_password')}
                                            </label>
                                            <IconSvg icon="pass" />
                                            <input type="password"
                                                   id="formConfirmPassword"
                                                   className="form-control"
                                                   {...register('confirm_password')}
                                                   placeholder={t('confirm_password_placeholder')}/>
                                            <div className="text-danger">{errors.confirm_password?.message}</div>
                                        </div>

                                        {errors.apiError &&
                                        <div className="text-danger error-service">{errors.apiError?.message}</div>
                                        }
                                        {success &&
                                        <div className="text-success">{success?.message}</div>
                                        }
                                        
                                        <div className="login__form-submit form-group align-c">
                                            <a className="btn btn-cancel" href={loginUrl}>{t('btn_cancel')}</a>
                                            <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('btn_reset_password')}</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"]))
    }
});

export default withTranslation()(withRouter(ResetPassword));
