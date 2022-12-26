import React, {Fragment, useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

// Form Validation
import { useForm } from "react-hook-form";
import { useFormik } from "formik";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

// language
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

// component
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import IconSvg from "components/icon/";
import {RouteGuard} from "../components/RouteGuard";
import {categoryService, meetingService, userService} from 'services';


const FormWrapDetails = (props) => {
    const {t, user, handleChangeRegistrationForm} = props;
    return (
        <div className="study__form--details">
            <div className="form-group">
                <label className="form-label" htmlFor="formName">{t('name')}</label>
                <div className="form-value">{user?.username}</div>
            </div>
            <div className="form-group">
                <label className="form-label"
                       htmlFor="facility_code">{t('facility_code')}</label>
                <div className="form-value">{user?.facility_owner_name}</div>
            </div>
            <div className="form-group">
                <label className="form-label"
                       htmlFor="postal_code">{t('postal_code')}</label>
                <div className="form-value">{user?.postal_code}</div>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="address">{t('address')}</label>
                <div className="form-value">{user?.address}</div>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="inn_type">{t('inn_type')}</label>
                <div className="form-value">{user?.type_base}</div>
            </div>
            <div className="form-group">
                <label className="form-label"
                       htmlFor="representative_name">{t('representative_name')}</label>
                <div className="form-value">{user?.representative_name}</div>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="phone">{t('phone')}</label>
                <div className="form-value">{user?.phone_number}</div>
            </div>
            <div className="form-group">
                <label className="form-label"
                       htmlFor="fax_number">{t('fax_number')}</label>
                <div className="form-value">{user?.fax_number ? user?.fax_number : '999-876-543'}</div>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="email">{t('email')}</label>
                <div className="form-value c-second">{user?.email}</div>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="usage_id">{t('usage_id')}</label>
                <div className="form-value">{user?.usage_id ? user?.usage_id : 'byme'}</div>
            </div>
            <div className="form-group">
                <label className="form-label"
                       htmlFor="current_password">{t('password')}</label>
                <div className="form-value">{`********`}</div>
            </div>
            <div className="form-buttons f jcc aic">
                <button className="btn btn-primary btn-block btn-gradient"
                        onClick={e => handleChangeRegistrationForm(e)}
                        type="button">{t('btn_change_registration_information')}</button>
            </div>
        </div>
    );
}

const UserProfile = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    const getAccountDetails = () => {
        userService.getAll().then(response => {
            if (response.code == 200) {
                const userData = response.data
                setUser(userData);
            } else {
                setUser(userDefault);
            }
        });
    }

    const [user, setUser] = useState(null);
    const userDefault = {
        "_id": 0,
        "username": "Bymeグランドホテル",
        "facility_owner_name": t('facility_code'),
        "email": "byme@byme.com",
        "postal_code": t('postal_code'),
        "address": t('address'),
        "phone_number": "1234567",
        "type_base": t('inn_type'),
        "representative_name": t('representative_name'),
        "fax_number": t('fax_number'),
        "usage_id": t('usage_id'),
    }
    useEffect(() => {
        getAccountDetails();
    }, []);

    const [isChangeRegistration, setIsChangeRegistration] = useState(false);
    const handleChangeRegistrationForm = (e) => {
        e.preventDefault();
        setIsChangeRegistration(!isChangeRegistration);
    }

    // schema form
    const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
    const validationSchema = yup.object().shape({
        name: yup.string().required(t('name_valid_empty')),
        facility_code: yup.string().required(t('facility_code_valid_empty')),
        postal_code: yup.string().required(t('postal_code_valid_empty')),
        address: yup.string().required(t('address_valid_empty')),
        inn_type: yup.string().required(t('inn_type_valid_empty')),
        representative_name: yup.string().required(t('representative_name_valid_empty')),
        phone: yup.string().matches(phoneRegExp, t('phone_valid_empty')),
        fax_number: yup.string().required(t('fax_number_valid_empty')),
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
        usage_id: yup.string().required(t('usage_id_valid_empty')),
        current_password: yup.string()
            .required(t('password_valid_empty'))
            .min(4, t('password_valid_required'))
            .max(12, t('password_valid_required')),
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
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;


    const [success, setSuccess] = useState(null);
    const onSubmit = ({ account_id, name, new_password, facility_code, email, postal_code, address, representative_name, phone, fax_number, usage_id, inn_type }) => {
        userService.updateAccount(account_id, new_password, facility_code, email, postal_code, address, representative_name, phone, inn_type)
            .then(response => {
                console.log(response);
                const message = `${t('msg_request_update_account_success')}`;
                setSuccess({
                    message: message
                });
            })
            .catch(error => {
                setError('apiError', { message: error.message || error });
            });
        getAccountDetails();
        return true;
    }

    return (
        <RouteGuard>
            <div className="main-page main-page--study">
                <Sidebar active="user_setting"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('page_title_profile')}</h2>
                    </div>

                    <div className="content content--white">
                        <div className="content__inner">
                            <div className="study">
                                <div className="study__form">
                                    {isChangeRegistration ?
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <input type="hidden" name="account_id" {...register('account_id')} defaultValue={user?._id} />
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="formName">{t('name')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="formName"
                                                           className="form-control"
                                                           {...register('name')}
                                                           defaultValue={user?.username}
                                                           placeholder={t('name_placeholder')}/>
                                                    <div className="text-danger">{errors.name?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="facility_code">{t('facility_code')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="facility_code"
                                                           className="form-control"
                                                           {...register('facility_code')}
                                                           defaultValue={user?.facility_owner_name}
                                                           placeholder={t('facility_code_placeholder')}/>
                                                    <div className="text-danger">{errors.facility_code?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="postal_code">{t('postal_code')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="postal_code"
                                                           className="form-control"
                                                           {...register('postal_code')}
                                                           defaultValue={user?.postal_code}
                                                           placeholder={t('postal_code_placeholder')}/>
                                                    <div className="text-danger">{errors.postal_code?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="address">{t('address')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="address"
                                                           className="form-control"
                                                           {...register('address')}
                                                           defaultValue={user?.address}
                                                           placeholder={t('address_placeholder')} />
                                                    <div className="text-danger">{errors.address?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="inn_type">{t('inn_type')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="inn_type"
                                                           className="form-control"
                                                           {...register('inn_type')}
                                                           defaultValue={user?.type_base}
                                                           placeholder={t('inn_type_placeholder')}/>
                                                    <div className="text-danger">{errors.inn_type?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="representative_name">{t('representative_name')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="representative_name"
                                                           className="form-control"
                                                           {...register('representative_name')}
                                                           defaultValue={user?.representative_name}
                                                           placeholder={t('representative_name_placeholder')}/>
                                                    <div className="text-danger">{errors.representative_name?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="phone">{t('phone')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="phone"
                                                           className="form-control"
                                                           {...register('phone')}
                                                           defaultValue={user?.phone_number}
                                                           placeholder={t('phone_placeholder')}/>
                                                    <div className="text-danger">{errors.inn_type?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="fax_number">{t('fax_number')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="fax_number"
                                                           className="form-control"
                                                           {...register('fax_number')}
                                                           defaultValue={user?.fax_number}
                                                           placeholder={t('fax_number_placeholder')}/>
                                                    <div className="text-danger">{errors.fax_number?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="email">{t('email')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="email"
                                                           className="form-control"
                                                           {...register('email')}
                                                           defaultValue={user?.email}
                                                           placeholder={t('email_placeholder')}/>
                                                    <div className="text-danger">{errors.email?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="usage_id">{t('usage_id')}</label>
                                                <div className="form-value">
                                                    <input type="text"
                                                           id="usage_id"
                                                           className="form-control"
                                                           {...register('usage_id')}
                                                           defaultValue={user?.usage_id}
                                                           placeholder={t('usage_id_placeholder')}/>
                                                    <div className="text-danger">{errors.usage_id?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="current_password">{t('current_password')}</label>
                                                <div className="form-value">
                                                    <input type="password"
                                                           id="current_password"
                                                           className="form-control"
                                                           {...register('current_password')}
                                                           placeholder={t('current_password_placeholder')}/>
                                                    <div className="text-danger">{errors.current_password?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="new_password">{t('new_password')}</label>
                                                <div className="form-value">
                                                    <input type="password" id="new_password"
                                                           className="form-control"
                                                           {...register('new_password')}
                                                           placeholder={t('new_password_placeholder')}/>
                                                    <div className="text-danger">{errors.new_password?.message}</div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label" htmlFor="re_enter_new_password">{t('re_enter_new_password')}</label>
                                                <div className="form-value">
                                                    <input type="password" id="re_enter_new_password"
                                                           className="form-control"
                                                           {...register('confirm_password')}
                                                           placeholder={t('re_enter_new_password_placeholder')}/>
                                                    <div className="text-danger">{errors.confirm_password?.message}</div>
                                                </div>
                                            </div>
                                            {errors.apiError &&
                                            <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div>
                                            }
                                            {success &&
                                            <div className="text-success align-c mb-4">{success?.message}</div>
                                            }

                                            <div className="form-buttons f jcc aic">
                                                <button className="btn btn-default btn--shadow" type="button" onClick={() => reset()}>{t('btn_cancel')}</button>
                                                <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('btn_save')}</button>
                                            </div>
                                        </form>
                                        :
                                        <FormWrapDetails t={t} user={user} handleChangeRegistrationForm={handleChangeRegistrationForm} />
                                    }
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

export default withTranslation()(withRouter((UserProfile)));
