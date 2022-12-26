import React, {useState, useEffect} from "react";
import {useRouter, withRouter} from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";
import htmlReactParse from 'html-react-parser';

import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";

import { userService, LoadingService, ActivityService } from 'services'
import IconSvg from "../components/icon/";
import * as Notification from '../modules/Notification'
const forgotPasswordUrl = `${process.env.BASE_PATH}/account-recovery`;

const Login = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;
    const router = useRouter();

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
            }),
        password: yup.string()
            .required(t('password_valid_empty'))
            .min(4, t('password_valid_required'))
            .max(12, t('password_valid_required')),
    }); 

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, setError, formState } = useForm(formOptions);
    const { errors } = formState;

    const onSubmit = ({ username, password }) => {
        //console.log('onSubmit ::: ', password);
        return userService.login(username, password)
            .then(() => {
                // save activity_history
                ActivityService.addActivityHistory('Web', t('activity_history_login'));
                
                // get return url from query parameters or default to '/'
                const returnUrl = router.query.returnUrl || '/';
                router.push(returnUrl);
            })
            .catch(error => {
                Notification.error(t('msg_login_errors'));
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
            <section className="login">
                <div className="login__container container">
                    <div className="login__inner f jcc aic">
                        <div className="login__block">
                            {/* <h4 className="h4 bold">{t('login_block_title')}</h4> */}
                            <div className="login__block-logo image--contain ratio">
                                <img className="image__img"
                                     src={`${process.env.BASE_PATH}/assets/images/logo-block.png`} alt="logo"/>
                            </div>
                            <p className="p align-c mt-3">{htmlReactParse(t('login_block_content'))}</p>
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
                                    <h4 className="h4 bold">{t('login_form_title')}</h4>
                                    <div className="login__form-block">
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formEmail">{t('username')}</label>
                                            <IconSvg icon="user" />
                                            <input type="text"
                                                   id="formEmail"
                                                   className="form-control"
                                                   {...register('username')}
                                                   placeholder={t('username_placeholder')}/>
                                            <div className="text-danger">{errors.username?.message}</div>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label" htmlFor="formPassword">{t('password')}</label>
                                            <IconSvg icon="pass" />
                                            <input type="password"
                                                   id="formPassword"
                                                   className="form-control"
                                                   {...register('password')}
                                                   placeholder={t('password_placeholder')}/>
                                            <div className="text-danger">{errors.password?.message}</div>
                                            {errors.apiError &&
                                                <div className="text-danger error-service">{errors.apiError?.message}</div>
                                            }
                                        </div>
                                        <div className="login__form-submit form-group align-c">
                                            <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('signIn')}</button>
                                            <a className="c-neutrals" href={forgotPasswordUrl}>{t('forgot_password')}</a>
                                        </div>

                                        {/* <div className="login__form-create f jcc aic form-group align-c">
                                            <p className="c-neutrals mb-0 me-2">Don't have an account?</p>
                                            <a className="c-second ml-2" href="#!">Register</a>
                                        </div> */}
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

export default withTranslation()(withRouter(Login));
