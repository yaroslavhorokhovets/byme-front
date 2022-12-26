import React, {Fragment, useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { useFormik } from "formik";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";
import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import IconSvg from "../../components/icon/";
import Pagination from "react-js-pagination";

import moment from 'moment';
import InputDateTime from '../../components/input-datetime/input-datetime'

import { AccountService, ActivityService, userService } from '../../services'
import * as Notification from '../../modules/Notification'

const AccountInformation = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    // 1 - Form Account filter 
    const [isDropdown, setIsDropdown] = useState(true);
    const handleDropdown = () => {
        setIsDropdown(!isDropdown);
    }
    
    // handle Input FacilityCode Change
    const [valueFacilityCode, setValueFacilityCode] = useState('');
    const handleInputFacilityCodeChange = (e) => {
        const value = e.target.value;
        setValueFacilityCode(value);
    }

    // the parentState will be set by its child slider component
    const currentDate = new Date();
    const [parentDateState, setParentDateState] = useState(currentDate);
    const handleDateChange = (date) => {
        setParentDateState(date);
    }
    
    // handle checklist account
    const [isCheck, setIsCheck] = useState([]);
    const handleChecked = (e) => {
        const { id, checked } = e.target;
        //console.log([...isCheck, id]);

        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    }

    // list users filter
    const [activePageFilter, setActivePageFilter] = useState(1);
    const [perPageFilter, setPerPageFilter] = useState(10);
    const [totalItemsFilter, setTotalItemsFilter] = useState(40);
    const [totalPageFilter, setTotalPageFilter] = useState(4);
    const [rangePageFilter, setRangePageFilter] = useState(3);

    const [searchText, setSearchText] = useState('');
    const [codeUser, setCodeUser] = useState('');
    const [listUsers, setListUsers] = useState(null);

    const getAccountActionFilter = (search, code_user, page, per_page) => {
        AccountService.getAccountActionFilter(search, code_user, page, per_page).then(response => {
            setListUsers(response.data);

            setTotalItemsFilter(response.page.total_count);
            setTotalPageFilter(response.page.total_page);
            setActivePageFilter(response.page.page);
            setPerPageFilter(response.page.per_page);
        });
    }
    const handlePageChangeFilter = (pageNumber) => {
        //console.log(`active page is ${pageNumber}`);
        setActivePageFilter(pageNumber);
        getAccountActionFilter(searchText, codeUser, pageNumber, perPageFilter);
    }
    const handleSearch = (e) => {
        const searchText = e.target.value;
        const resultSearchText = searchText.trim().toLowerCase();
        setSearchText(resultSearchText);
        getAccountActionFilter(resultSearchText, codeUser, activePageFilter, perPageFilter);
    }
    const handleSubmitSearch = () => {
        getAccountActionFilter(searchText, codeUser, activePageFilter, perPageFilter);
    }
    
    // 2 - Register User
    const typeOptions = [
        "広角レンズ",
        "三脚",
        "照明",
        "ディフューザー",
        "黒シート"
    ];
    const [isCheckOptions, setIsCheckOptions] = useState([]);
    const handleTypeOptionChecked = (e) => {
        const { value, checked } = e.target;
        setIsCheckOptions([...isCheckOptions, value]);
        if (!checked) {
            setIsCheckOptions(isCheckOptions.filter(item => item !== value));
        }
    }

    // schema form
    const validationSchema = yup.object().shape({
        facility_name: yup.string().required(t('input_valid_empty')),
        facility_code: yup.string().required(t('input_valid_empty')),
        sales_staff: yup.string().required(t('input_valid_empty')),
        postal_code: yup.string().required(t('input_valid_empty')),
        address: yup.string().required(t('input_valid_empty')),
        type_base: yup.string().required(t('input_valid_empty')),
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
        price: yup.number()
            .typeError(t('input_valid_empty'))
            .required(t('input_valid_empty')),
        annual_usage_fee: yup.number()
            .typeError(t('input_valid_empty'))
            .required(t('input_valid_empty')),
        instant_delivery_request_fee: yup.number()
            .typeError(t('input_valid_empty'))
            .required(t('input_valid_empty'))
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;

    const [success, setSuccess] = useState(null);
    const onSubmit = ({
                          facility_name,
                          facility_code,
                          sales_staff,
                          postal_code,
                          address,
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
        const permission = 'user';
        const lst_buy = isCheckOptions ? isCheckOptions : [];
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
    const userTemp = {
        facility_name: "Bymeグランドホテル",
        facility_code: "1234567",
        sales_staff: "山田太郎",
        postal_code: "04083",
        address: "東京都新宿区Byme１丁目",
        type_base: "ホテル or 旅館",
        representative_name: "Byme 太郎",
        phone_number: "000-123-456",
        fax_number: "999-876-543",
        email: "byme@byme.com",
        ID_use: "利用IDbyme",
        password: "12345678",
        lst_buy: [
            "広角レンズ",
            "三脚",
            "照明",
            "ディフューザー",
            "黒シート"
        ],
        price: 9000,
        annual_usage_fee: 500,
        instant_delivery_request_fee: 1000,
        permission: "user"
    }

    const [user, setUser] = useState(null);
    useEffect(() => {
        setUser(userTemp);
        // reset(userTemp);
    }, []);


    useEffect(() => {
        // Get Account Action filter checkboxes 
        getAccountActionFilter(searchText, codeUser, activePageFilter, perPageFilter);
    }, []);
    
    const [userInfo, setUserInfo] = useState([]);
    const onChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <RouteGuard>
            <div className="main-page main-page--setting-account">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="account-information"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('page_title_account_information')}</h2>
                    </div>

                    <div className="content content--white">
                        <div className="content__inner">
                            <div className="billing__filters f jcs ais">
                                <div className={`billing__filter-facility-name ${isDropdown ? 'is-dropdown' : ''}`}>
                                    <div className="heading f jcb aic" onClick={handleDropdown}>
                                        <span>{t('billing_filter_name_title')}</span>
                                        <IconSvg icon="arrow-down"/> 
                                    </div>
                                    <div className="body">
                                        <div className="body__inner">
                                            <div className="search f jcs aic">
                                                <div className="search__input-wrapper">
                                                    <IconSvg icon="search"/>
                                                    <input 
                                                        className="search__input-el form-control" 
                                                        type="text" 
                                                        name={`search`} 
                                                        placeholder={t('billing_filter_search_input_placeholder')}
                                                        onChange={handleSearch.bind(this)}
                                                    />
                                                </div>
                                                <button 
                                                    className="search__button-filter"
                                                    onClick={handleSubmitSearch}
                                                >
                                                    <IconSvg icon="filter"/>
                                                    </button>
                                            </div>
                                            
                                            <div className="list">
                                                {listUsers?.map((item, index) => (
                                                    <div key={index} className="item">
                                                        <div className="form-group__checkbox form-group__checkbox--billing">
                                                            <input type="checkbox"
                                                                onChange={e => handleChecked(e)}
                                                                id={item._id}
                                                                name={`facility_name_${item._id}`}
                                                                value={item._id}
                                                            />
                                                            <label htmlFor={item._id}>{item.facility_name ? item.facility_name : item.username}</label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="billing__filter-date f jcs aic">
                                    <div className="form-group">
                                        <label className="form-label">{t('input_facility_code_label')}</label>
                                        <div className="form-value">
                                            <input type="text"
                                                   className="form-control"
                                                   placeholder={t('input_facility_code_placeholder')}
                                                   onChange={handleInputFacilityCodeChange.bind(this)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">{t('input_reference_month')}</label>
                                        <div className="form-date-value">
                                            <InputDateTime
                                                date={parentDateState}
                                                handleChange={handleDateChange.bind(this)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="account">
                                <form className="account__form" onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="label_new_registration_facility_name">{t('label_new_registration_facility_name')}</label>
                                        <div className="form-text">{userInfo?.facility_name}</div>
                                        <div className="form-value">
                                            <input type="text" id="label_new_registration_facility_name"
                                                   className="form-control"
                                                   {...register('facility_name')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_facility_name_placeholder')}/>
                                            <div className="text-danger">{errors.facility_name?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="label_new_registration_facility_code">{t('label_new_registration_facility_code')}</label>
                                        <div className="form-text">{userInfo?.facility_code}</div>
                                        <div className="form-value">
                                            <input type="text" id="label_new_registration_facility_code"
                                                   className="form-control"
                                                   {...register('facility_code')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_facility_code_placeholder')}/>
                                            <div className="text-danger">{errors.facility_code?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="label_new_registration_sales_staff">{t('label_new_registration_sales_staff')}</label>
                                        <div className="form-text">{userInfo?.sales_staff}</div>
                                        <div className="form-value">
                                            <input type="text" id="label_new_registration_sales_staff"
                                                   className="form-control"
                                                   {...register('sales_staff')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_sales_staff_placeholder')}/>
                                            <div className="text-danger">{errors.sales_staff?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="label_new_registration_post_code">{t('label_new_registration_post_code')}</label>
                                        <div className="form-text">{userInfo?.postal_code}</div>
                                        <div className="form-value">
                                            <input type="text" id="label_new_registration_post_code"
                                                   className="form-control"
                                                   {...register('postal_code')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_post_code_placeholder')}/>
                                            <div className="text-danger">{errors.postal_code?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="label_new_registration_address">{t('label_new_registration_address')}</label>
                                        <div className="form-text">{userInfo?.address}</div>
                                        <div className="form-value">
                                            <input type="text" id="label_new_registration_address"
                                                   className="form-control"
                                                   {...register('address')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_address_placeholder')}/>
                                            <div className="text-danger">{errors.address?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_inn_type">{t('label_new_registration_inn_type')}</label>
                                        <div className="form-text">{userInfo?.type_base}</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_inn_type"
                                                   className="form-control"
                                                   {...register('type_base')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_inn_type_placeholder')}/>
                                            <div className="text-danger">{errors.type_base?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_representative_name">{t('label_new_registration_representative_name')}</label>
                                        <div className="form-text">{userInfo?.representative_name}</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_representative_name"
                                                   className="form-control"
                                                   {...register('representative_name')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_representative_name_placeholder')}/>
                                            <div className="text-danger">{errors.representative_name?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_telephone_number">{t('label_new_registration_telephone_number')}</label>
                                        <div className="form-text">{userInfo?.phone_number}</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_telephone_number"
                                                   className="form-control"
                                                   {...register('phone_number')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_telephone_number_placeholder')}/>
                                            <div className="text-danger">{errors.phone_number?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_fax">{t('label_new_registration_fax')}</label>
                                        <div className="form-text">{userInfo?.fax_number}</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_fax"
                                                   className="form-control"
                                                   {...register('fax_number')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_fax_placeholder')}/>
                                            <div className="text-danger">{errors.fax_number?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_mail">{t('label_new_registration_mail')}</label>
                                        <div className="form-text c-second underline">{userInfo?.email}</div>
                                        <div className="form-value">
                                            <input type="email" id="input_new_registration_mail"
                                                   className="form-control"
                                                   {...register('email')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_mail_placeholder')}/>
                                            <div className="text-danger">{errors.email?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_user_id">{t('label_new_registration_user_id')}</label>
                                        <div className="form-text">{userInfo?.ID_use}</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_user_id"
                                                   className="form-control"
                                                   {...register('ID_use')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_user_id_placeholder')}/>
                                            <div className="text-danger">{errors.ID_use?.message}</div>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="input_new_registration_password">{t('label_new_registration_password')}</label>
                                        <div className="form-text">{userInfo?.password}</div>
                                        <div className="form-value">
                                            <input type="password" id="input_new_registration_password"
                                                   className="form-control"
                                                   {...register('password')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_password_placeholder')}/>
                                            <div className="text-danger">{errors.password?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('label_new_registration_options')}</label>
                                        <div className="form-text f fw jcs aic">
                                            {isCheckOptions?.map((option, index) => (
                                                <div key={index} data-index={index} className="form-text__option">{option}
                                                    {(isCheckOptions.length <= 1 || (isCheckOptions.length - 1) == index) ? '' : ', '}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="form-checkboxes f jcs aic">
                                            {typeOptions?.map((option, index) => (
                                                <div key={index} className="form-group__checkbox form-group__checkbox--red">
                                                    <input type="checkbox"
                                                           onChange={handleTypeOptionChecked.bind(this)}
                                                           id={`type_options_${index}`}
                                                           name={`type_options_${index}`}
                                                           value={option}
                                                    />
                                                    <label htmlFor={`type_options_${index}`}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('label_new_registration_price')}</label>
                                        <div className="form-text">{userInfo?.price ? userInfo?.price : 0}円</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_initial_code"
                                                   className="form-control"
                                                   {...register('price')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_initial_code_placeholder')}/>
                                            <div className="text-danger">{errors.price?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('input_new_registration_initial_usage_fee_placeholder')}</label>
                                        <div className="form-text">{userInfo?.annual_usage_fee ? userInfo?.annual_usage_fee : 0}円</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_initial_usage_fee"
                                                   className="form-control"
                                                   {...register('annual_usage_fee')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_initial_usage_fee_placeholder')}/>
                                            <div className="text-danger">{errors.annual_usage_fee?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">{t('input_new_registration_initial_fee_placeholder')}</label>
                                        <div className="form-text">{userInfo?.instant_delivery_request_fee ? userInfo?.instant_delivery_request_fee : 0}円</div>
                                        <div className="form-value">
                                            <input type="text" id="input_new_registration_initial_fee"
                                                   className="form-control"
                                                   {...register('instant_delivery_request_fee')}
                                                   onChange={onChange.bind(this)}
                                                   placeholder={t('input_new_registration_initial_fee_placeholder')}/>
                                            <div className="text-danger">{errors.instant_delivery_request_fee?.message}</div>
                                        </div>
                                    </div>

                                    {errors.apiError && <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div> }
                                    {success && <div className="text-success align-c mb-4">{success?.message}</div> }

                                    <div className="form-buttons f jcc aic">
                                        <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('button_setting_renew')}</button>
                                    </div>
                                </form>
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

export default withTranslation()(withRouter((AccountInformation)));
