import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { userService, ActivityService } from '../../services'
import * as Notification from "../../modules/Notification";

const NewRegistration = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    
    const [isOnFacilityCode, setIsOnFacilityCode] = useState(false);
    const onChangeSubAccount = (e) => {
        const target = e.target;
        setIsOnFacilityCode(target.checked);
    }

    const [isOnInnType, setIsOnInnType] = useState(false);
    const onChangeInType = (e) => {
        const target = e.target;
        setIsOnInnType(target.checked);
    }

    // schema form
    const validationSchema = yup.object().shape({
        facility_name: yup.string().required(t('input_valid_empty')),
        facility_code: isOnFacilityCode ? yup.string().required(t('input_valid_empty')) : null,
        postal_code: yup.string().required(t('input_valid_empty')),
        type_base: isOnInnType ? yup.string().required(t('input_valid_empty')) : null,
        representative_name: yup.string().required(t('input_valid_empty')),
        phone_number: yup.string().required(t('input_valid_empty')),
        fax_number: yup.string().required(t('input_valid_empty')),
        email: yup.string(t('input_valid_empty'))
            .required(t('input_valid_empty'))
            .test('test-name', t('input_valid_empty'), function(value) {
                const emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                let isValidEmail = emailRegex.test(value);
                if (!isValidEmail) {
                    return false;
                }
                return true;
            }),
        ID_use: yup.string().required(t('input_valid_empty')),
        password:  yup.string()
            .required(t('password_valid_empty'))
            .min(4, t('password_valid_required'))
            .max(12, t('password_valid_required')),
        price: yup.string().required(t('input_valid_empty')),
        annual_usage_fee: yup.string().required(t('input_valid_empty')),
        instant_delivery_request_fee: yup.string().required(t('input_valid_empty'))
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;

    const [success, setSuccess] = useState(null);
    const onSubmit = ({
                          facility_name, 
                          facility_code, 
                          postal_code, 
                          type_base, 
                          representative_name, 
                          phone_number, 
                          fax_number, 
                          email, 
                          ID_use, 
                          password, 
                          price, 
                          annual_usage_fee, 
                          instant_delivery_request_fee
    }) => {
        const sales_staff = 'string';
        const permission = 'user';
        const address = 'string';
        const lst_buy = isCheck ? isCheck : [];
        userService.register(
            facility_name,
            facility_code,
            sales_staff,
            password,
            representative_name,
            email,
            postal_code,
            address,
            phone_number,
            fax_number,
            ID_use,
            type_base,
            lst_buy,
            price,
            annual_usage_fee,
            instant_delivery_request_fee,
            permission
        ).then(response => {
            //console.log(response);
            if (response.code == 200) {
                ActivityService.addActivityHistory('Web', t('msg_request_register_account_success'));
                Notification.success(t('msg_request_register_account_success'));
            }
            if (response.code == 409) {
                Notification.success(t('msg_request_register_account_exist_error'));
            }
        }).catch(error => {
            Notification.error(t('msg_request_register_account_error'));
        })
        return false;
    }
    
    const typeOptions = [
        "広角レンズ",
        "三脚",
        "照明",
        "ディフューザー",
        "黒シート"
    ];
    const [isCheck, setIsCheck] = useState([]);
    const handleTypeOptionChecked = (e) => {
        const { value, checked } = e.target;
        setIsCheck([...isCheck, value]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== value));
        }
    }

    useEffect(() => {
        // reset form with user data
        // const userTemp = {
        //     facility_name: "test",
        //     facility_code: "facility_code_1234",
        //     sales_staff: "test_sales_staff",
        //     password: "12345678",
        //     representative_name: "representative_name_test",
        //     email: "test@gmail.com",
        //     postal_code: "04083",
        //     address: "address",
        //     phone_number: "123456789",
        //     fax_number: "123456789",
        //     ID_use: "id_use_1234",
        //     type_base: "type_base",
        //     lst_buy: [
        //         "広角レンズ", 
        //         "三脚",
        //         "照明",
        //         "ディフューザー",
        //         "黒シート"
        //     ],
        //     price: 1500,
        //     annual_usage_fee: 500,
        //     instant_delivery_request_fee: 1000,
        //     permission: "user"
        // }
        // reset(userTemp);
    }, []);

    return (
        <RouteGuard>
            <div className="main-page main-page--study">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="new-registration"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('new_registration_heading')}</h2>
                    </div>

                    <div className="content content--white">
                        <div className="content__inner">

                            <form className="new-registration__form" onSubmit={handleSubmit(onSubmit)}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_name">{t('label_new_registration_facility_name')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_name"
                                               className="form-control"
                                               {...register('facility_name')}
                                               placeholder={t('input_new_registration_facility_name_placeholder')}/>
                                        <div className="text-danger">{errors.facility_name?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-group__checkbox-toggle f jcs aic">
                                        <label className="form-label" htmlFor="input_new_registration_sub_account">{t('label_new_registration_facility_code')}</label>
                                        <div className="checkbox__toggle">
                                            <input type="checkbox" className="checkbox" id="checkbox_sub_account" onChange={onChangeSubAccount.bind(this)} />
                                            <label htmlFor="checkbox_sub_account"></label>
                                        </div>
                                    </div>
                                    
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_sub_account"
                                               className="form-control"
                                               {...register('facility_code')}
                                               placeholder={t('input_new_registration_facility_code_placeholder')} disabled={!isOnFacilityCode}/>
                                        {isOnFacilityCode && 
                                            <div className="text-danger">{errors.facility_code?.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_post_code">{t('label_new_registration_post_code')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_post_code"
                                               className="form-control"
                                               {...register('postal_code')}
                                               placeholder={t('input_new_registration_post_code_placeholder')}/>
                                        <div className="text-danger">{errors.postal_code?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="form-group__checkbox-toggle f jcs aic">
                                        <label className="form-label" htmlFor="input_new_registration_inn_type">{t('label_new_registration_inn_type')}</label>
                                        <div className="checkbox__toggle">
                                            <input type="checkbox" className="checkbox" id="checkbox_inn_type" onChange={onChangeInType.bind(this)} />
                                            <label htmlFor="checkbox_inn_type"></label>
                                        </div>
                                    </div>
                                    
                                    <div className="form-value ">
                                        <div className="form-value--select">
                                            <select 
                                                name="input_new_registration_inn_type" 
                                                id="input_new_registration_inn_type"
                                                className="form-control"
                                                {...register('type_base')}
                                                disabled={!isOnInnType}
                                            >
                                                <option value={''}>{t('label_new_registration_inn_type')}</option>
                                                <option value={t('旅館')}>{t('旅館')}</option>
                                                <option value={t('ホテル')}>{t('ホテル')}</option>
                                                <option value={t('その他')}>{t('その他')}</option>
                                            </select>
                                        </div>
                                        {isOnInnType &&
                                            <div className="text-danger">{errors.type_base?.message}</div>
                                        }
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_representative_name">{t('label_new_registration_representative_name')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_representative_name"
                                               className="form-control"
                                               {...register('representative_name')}
                                               placeholder={t('input_new_registration_representative_name_placeholder')}/>
                                        <div className="text-danger">{errors.representative_name?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_telephone_number">{t('label_new_registration_telephone_number')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_telephone_number"
                                               className="form-control"
                                               {...register('phone_number')}
                                               placeholder={t('input_new_registration_telephone_number_placeholder')}/>
                                        <div className="text-danger">{errors.phone_number?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_fax">{t('label_new_registration_fax')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_fax"
                                               className="form-control"
                                               {...register('fax_number')}
                                               placeholder={t('input_new_registration_fax_placeholder')}/>
                                        <div className="text-danger">{errors.fax_number?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_mail">{t('label_new_registration_mail')}</label>
                                    <div className="form-value">
                                        <input type="email" id="input_new_registration_mail"
                                               className="form-control"
                                               {...register('email')}
                                               placeholder={t('input_new_registration_mail_placeholder')}/>
                                        <div className="text-danger">{errors.email?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_user_id">{t('label_new_registration_user_id')}</label>
                                    <div className="form-value">
                                        <input type="text" id="input_new_registration_user_id"
                                               className="form-control"
                                               {...register('ID_use')}
                                               placeholder={t('input_new_registration_user_id_placeholder')}/>
                                        <div className="text-danger">{errors.ID_use?.message}</div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="input_new_registration_password">{t('label_new_registration_password')}</label>
                                    <div className="form-value">
                                        <input type="password" id="input_new_registration_password"
                                               className="form-control"
                                               {...register('password')}
                                               placeholder={t('input_new_registration_password_placeholder')}/>
                                        <div className="text-danger">{errors.password?.message}</div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">{t('label_new_registration_options')}</label>
                                    <div className="form-checkboxes f jcs aic">
                                        {typeOptions?.map((option, index) => (
                                            <div key={index} className="form-group__checkbox form-group__checkbox--red">
                                                <input type="checkbox"
                                                       onChange={e => handleTypeOptionChecked(e)}
                                                       id={`type_options_${index}`}
                                                       name={`type_options_${index}`}
                                                       value={option}
                                                />
                                                <label htmlFor={`type_options_${index}`}>{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group__price">
                                    <label className="form-label">{t('label_new_registration_price')}</label>
                                    <div className="form-group">
                                        <div className="form-value">
                                            <div className="group">
                                                <input type="text" id="input_new_registration_initial_code"
                                                    className="form-control"
                                                    {...register('price')}
                                                    placeholder={t('input_new_registration_initial_code_placeholder')}/>
                                                <div className="text-danger">{errors.price?.message}</div>
                                            </div>
                                            <div className="group">
                                                <input type="text" id="input_new_registration_initial_usage_fee"
                                                    className="form-control"
                                                    {...register('annual_usage_fee')}
                                                    placeholder={t('input_new_registration_initial_usage_fee_placeholder')}/>
                                                <div className="text-danger">{errors.annual_usage_fee?.message}</div>
                                            </div>
                                            <div className="group">
                                                <input type="text" id="input_new_registration_initial_fee"
                                                    className="form-control"
                                                    {...register('instant_delivery_request_fee')}
                                                    placeholder={t('input_new_registration_initial_fee_placeholder')}/>
                                                <div className="text-danger">{errors.instant_delivery_request_fee?.message}</div>
                                            </div>
                                        </div>
                                        
                                        
                                       
                                    </div>
                                </div>

                                {errors.apiError && <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div> }
                                {success && <div className="text-success align-c mb-4">{success?.message}</div> }

                                <div className="form-buttons f jcc aic">
                                    <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('button_new_registration')}</button>
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

export default withTranslation()(withRouter((NewRegistration)));
