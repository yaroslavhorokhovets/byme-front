import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import IconSvg from "../../components/icon";
import InputDateTimeRange from "../../components/input-datetime-range/input-datetime-range";
import Pagination from "react-js-pagination";
import moment from 'moment';
import { AccountService } from 'services';
import * as Notification from '../../modules/Notification';


const UsageStatus = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    const [isDropdown, setIsDropdown] = useState(true);
    const handleUsageDropdown = () => {
        setIsDropdown(!isDropdown);
    }

    // handle checkbox 
    const handleChecked = (e) => {
        //console.log(e);
    }

    // Filter data logic 
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
    
    // handle input search 
    const handleSearch = (e) => {
        const searchText = e.target.value;
        const resultSearchText = searchText.trim().toLowerCase();
        setSearchText(resultSearchText);
        getAccountActionFilter(resultSearchText, codeUser, activePageFilter, perPageFilter);
    }
    
    // handle change code user
    const handleChangeCodeUser = (e) => {
        const value = e.target.value;
        const codeUser = value.trim().toLowerCase();
        setCodeUser(codeUser);
    }

    const handleSubmitSearch = () => {
        getAccountActionFilter(searchText, codeUser, activePageFilter, perPageFilter);
    }

    // onchange RangeDate 
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isValidRangeDate, setIsValidRangeDate] = useState(false);
    
    const onChangeRangeDate = (field, value) => {
        const SHOW_TIME = true;
        const format = 'YYYY/MM/DD HH:mm:ss';
        const getFormat = (time) => (time ? format : 'YYYY/MM/DD');
        //console.log('onChange', field, value && value.format(getFormat(SHOW_TIME)));
        if (field == 'startValue') {
            setStartDate(value);
        } else {
            setEndDate(value);
        }

        if (startDate !== null || endDate !== null) {
            setIsValidRangeDate(false);
        }
    }
    
    // button download
    const handleClickDownloadCSV = () => {
        //console.log(`searchText`, searchText);
        //console.log(`codeUser`, codeUser);
        //console.log(`startTime`, moment(startDate).format('YYYY-MM-DD'));
        //console.log(`endTime`, moment(endDate).format('YYYY-MM-DD'));
        //console.log(`--------- handleClickDownloadCSV --------`);
        
        if (startDate == null || endDate == null) {
            setIsValidRangeDate(true);
        } else {
            AccountService.getAccountActionDownloadCSV(searchText, codeUser, startDate, endDate).then(response => {
                if (response.code == 200) {
                    Notification.success(t('msg_download_success'));
                    //console.log('Zip File URL :: ', response.data);
                    window.open(response.data);
                }
            });
        }
    }

    useEffect(() => {
        getAccountActionFilter(searchText, codeUser, activePageFilter, perPageFilter);
    }, []);
    
    return (
        <RouteGuard>
            <div className="main-page main-page--setting-usage">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="usage-status"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('usage_page_title')}</h2>
                    </div>

                    <div className="content content--white">
                        <div className="content__inner">

                            <div className="usage__filter f jcs ais">
                                <div className={`usage__filter-facility-name ${isDropdown ? 'is-dropdown' : ''}`}>
                                    <div className="heading f jcb aic" onClick={handleUsageDropdown}>
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

                                            {totalItemsFilter > 10 ?
                                                <div className="pagination__wrapper pagination__wrapper--link f jcb aic">
                                                    <div className="pagination__display">
                                                        {`${totalItemsFilter}件中${activePageFilter > 1 ? ((activePageFilter*10 + 1) - 10) : 1 }-${(activePageFilter*10) > totalItemsFilter ? totalItemsFilter : activePageFilter*10}を表示`}
                                                    </div>
                                                    <Pagination
                                                        nextPageText={t('pagination_next_page')}
                                                        prevPageText={t('pagination_prev_page')}
                                                        firstPageText={t('pagination_first_page')}
                                                        lastPageText={t('pagination_last_page')}
                                                        itemClassFirst={`pagination__first`}
                                                        itemClassLast={`pagination__last`}
                                                        itemClass={`pagination__item`}
                                                        itemClassNext={`pagination__next`}
                                                        itemClassPrev={`pagination__prev`}
                                                        activePage={activePageFilter}
                                                        itemsCountPerPage={perPageFilter}
                                                        totalItemsCount={totalItemsFilter}
                                                        pageRangeDisplayed={rangePageFilter}
                                                        onChange={e => handlePageChangeFilter(e)}
                                                    />
                                                </div>
                                                : null
                                            }
                                            
                                        </div>
                                    </div>
                                </div>

                                <div className="usage__filter-date f jcs ais">
                                    <div className="form-group">
                                        <label className="form-label">{t('input_facility_code_label')}</label>
                                        <div className="form-value">
                                            <input type="text"
                                                   className="form-control"
                                                   placeholder={t('input_facility_code_placeholder')}
                                                   onChange={handleChangeCodeUser.bind(this)}
                                            />
                                        </div>
                                    </div>
                                   
                                    <div className="form-group">
                                        <label className="form-label">{t('input_set_period_label')}</label>
                                        <div className="form-date-value">
                                            <InputDateTimeRange
                                                isValid={isValidRangeDate}
                                                labelStart={t('input_start_date_label')}
                                                labelEnd={t('input_end_date_label')}
                                                onChange={onChangeRangeDate}
                                                startDate={startDate}
                                                endDate={endDate}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="usage__buttons form-buttons f jcc aic">
                                <button 
                                    className="btn btn-primary btn-block btn-gradient" 
                                    type="button"
                                    onClick={handleClickDownloadCSV}
                                >{t('billing_button_filter')}</button>
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

export default withTranslation()(withRouter((UsageStatus)));
