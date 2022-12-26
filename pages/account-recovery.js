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

const AccountRecovery = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;
    const router = useRouter();
    const [success, setSuccess] = useState(null);
    const loginUrl = '/login';

    // schema form
    const validationSchema = yup.object().shape({
        username: yup.string(t('username_valid_empty'))
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
            })
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ username }) => {
        return userService.recovery(username)
            .then(response => {
                // console.log(response);
                // Account recovery email sent to
                const message = `(${username}) ${t('msg_recovery')}`;
                Notification.success(message);
                
                setTimeout(() => {
                    const returnUrl = router.query.returnUrl || '/reset-password';
                    router.push(returnUrl);
                }, 2000);
            })
            .catch(error => {
                Notification.error(t('msg_recovery_errors'));
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
                                    <h4 className="h4 bold">{t('account_recovery_form_title')}</h4>
                                    <p className="p">{t('account_recovery_form_desc')}</p>
                                    
                                    <div className="login__form-block">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formEmail">
                                                {t('username')}
                                                <span className="text-danger">*</span>
                                            </label>
                                            <IconSvg icon="email" />
                                            <input type="text"
                                                   id="formEmail"
                                                   className="form-control"
                                                   {...register('username')}
                                                   placeholder={t('username_placeholder')}/>
                                            <div className="text-danger">{errors.username?.message}</div>
                                            {errors.apiError &&
                                            <div className="text-danger error-service">{errors.apiError?.message}</div>
                                            }
                                            {success &&
                                            <div className="text-success">{success?.message}</div>
                                            }
                                        </div>
                                        <div className="login__form-submit form-group align-c">
                                            <a className="btn btn-cancel" href={loginUrl}>{t('btn_cancel')}</a>
                                            <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('btn_recovery')}</button>
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

export default withTranslation()(withRouter(AccountRecovery));
