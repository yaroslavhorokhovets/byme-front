import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import {RouteGuard} from "../components/RouteGuard";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import IconSvg from "../components/icon/";
import Pagination from "react-js-pagination";
import { InvoicesService, ActivityService } from '../services'
import moment from 'moment';

const current_year = moment().format('YYYY');
const current_month = moment().format('MM');

const Status = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    
    
    // fetch table data
    let photoData = [];
    for (let i = 1; i <= 40; i++) {
        photoData.push({
            _id: `byme ${i}`,
            date: '2022.05.14',
            time: `19:32:25`,
            tools: 'アプリ',
            details: `ログイン`,
        });
    }

    const paginateGood = (array, page_size, page_number) => {
        return array.slice(page_number * page_size, page_number * page_size + page_size);
    };

    const getActivityHistory = (year, month, page, per_page)  => {
        ActivityService.getActivityHistory(year, month, page, per_page).then(response => {
            //console.log(`getActivityHistory `, response);
            setFilterHistory(response.data);
            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    }
    const [filterYearHistory, setFilterYearHistory] = useState(current_year);
    const [filterMonthHistory, setFilterMonthHistory] = useState(current_month);
    const [filterHistory, setFilterHistory] = useState();
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(40);
    const [totalPage, setTotalPage] = useState(4);
    const [rangePage, setRangePage] = useState(3);
    
    // pagination 
    const handlePageChange = (pageNumber) => {
        //console.log(`active page is ${pageNumber}`);
        setActivePage(pageNumber);
        getActivityHistory(filterYearHistory, filterMonthHistory, pageNumber, perPage);

        // const photosGood = paginateGood(photoData, perPage, (pageNumber - 1));
        // setFilterHistory(photosGood);
    }

    const onChangeMonthHistory = (e) => {
        const { value } = e.target;
        setFilterMonthHistory(value);
        getActivityHistory(filterYearHistory, value, activePage, perPage);
    }
    const onChangeYearHistory = (e) => {
        const { value } = e.target;
        setFilterYearHistory(value);
        getActivityHistory(value, filterMonthHistory, activePage, perPage);
    }

    useEffect(() => {
        getActivityHistory(filterYearHistory, filterMonthHistory, activePage, perPage);
        // const photosGood = paginateGood(photoData, perPage, (activePage - 1));
        // console.log('photosGood :: ', photosGood);
        // setFilterHistory(photosGood);
    }, []);
    
    // ----------------------------- billing amount 
    let billingAmount = [];
    for (let i = 1; i <= 40; i++) {
        billingAmount.push({
            _id: `byme ${i}`,
            date: '2022.05.14',
            price: `5,000円`,
            details: `初期費用`,
        });
    }

    const getInvoices = (action_time, page, per_page) => {
        InvoicesService.getInvoices(action_time, page, per_page).then(response => {
            //console.log(`response`, response)
            setFilterBilling(response.list);
            setTotalBilling(response.total);

            setTotalItemsBilling(response.page.total_count);
            setTotalPageBilling(response.page.total_page);
            setActivePageBilling(response.page.page);
            setPerPageBilling(response.page.per_page);
        });
    }

    const currentActionTime = moment().format('YYYY-MM');
    const [actionTime, setActionTime] = useState(currentActionTime);
    const [totalBilling, setTotalBilling] = useState(0);
    const [filterBilling, setFilterBilling] = useState();
    const [activePageBilling, setActivePageBilling] = useState(1);
    const [perPageBilling, setPerPageBilling] = useState(10);
    const [totalItemsBilling, setTotalItemsBilling] = useState(40);
    const [totalPageBilling, setTotalPageBilling] = useState(4);
    const [rangePageBilling, setRangePageBilling] = useState(3);

    // pagination 
    const handlePageChangeBilling = (pageNumberBilling) => {
        //console.log(`active page is ${pageNumberBilling}`);
        setActivePageBilling(pageNumberBilling);
        // const billingGood = paginateGood(billingAmount, perPageBilling, (pageNumberBilling - 1));
        // setFilterBilling(billingGood);

        getInvoices(actionTime, pageNumberBilling, perPageBilling);
    }
    
    const [filterYearBilling, setFilterYearBilling] = useState(current_year);
    const [filterMonthBilling, setFilterMonthBilling] = useState(current_month);
    
    const onChangeMonthBilling = (e) => {
        const { value } = e.target;
        setFilterMonthBilling(value);
        const action_time = moment(filterYearBilling + '-' + value).format('YYYY-MM');
        setActionTime(action_time);
        getInvoices(action_time, activePageBilling, perPageBilling);
    }
    const onChangeYearBilling = (e) => {
        const { value } = e.target;
        setFilterYearBilling(value);
        const action_time = moment(value + '-' + filterMonthBilling).format('YYYY-MM');
        setActionTime(action_time);
        getInvoices(setActionTime, activePageBilling, perPageBilling);
    }
    useEffect(() => {
        getInvoices(actionTime, activePageBilling, perPageBilling);
        
        // const billingGood = paginateGood(billingAmount, perPageBilling, (activePageBilling - 1));
        // console.log('photosGood :: ', billingGood);
        // setFilterBilling(billingGood);
    }, []);

    let months = [];
    for (let i = 1; i <= 12; i++) {
        months.push({
            value: i,
            label: `${i}月`,
        });
    }

    let years = [];
    const date = new Date();
    const currentYear = date.getFullYear();
    const startYear = currentYear - 10;
    for (let i = currentYear; i >= startYear; i--) {
        years.push({
            value: i,
            label: `${i}年`,
        });
    }
    
    return (
        <RouteGuard>
            <main className="main-page main-page--status">
                <Sidebar isMenuActive="status"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('page_status')}</h2>
                    </div>

                    <div className="content content--white content--status">
                        <div className="content__inner">

                            <div className="operation-log">
                                <div className="operation-log__heading f jcb aic">
                                    <h4 className="operation-log__title">{t('status_operation_log_title')}</h4>
                                    <div className="operation-log__filters">
                                        <select className="form-select" onChange={onChangeYearHistory.bind(this)}>
                                            {years.map((item, index) => (
                                                <option key={index} value={item.value} selected={item.value == current_year}>{item.label}</option>
                                            ))}
                                        </select>
                                        <select className="form-select" onChange={onChangeMonthHistory.bind(this)}>
                                            {months.map((item, index) => (
                                                <option key={index} value={item.value} selected={item.value == current_month}>{item.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="operation-log__table">
                                    <div className="operation-log__head">
                                        <div className="operation-log__column col-id">{t('table_operation_log_id')}</div>
                                        <div className="operation-log__column col-date">{t('table_operation_log_date')}</div>
                                        <div className="operation-log__column col-time">{t('table_operation_log_time')}</div>
                                        <div className="operation-log__column col-tools">{t('table_operation_log_tools')}</div>
                                        <div className="operation-log__column col-details">{t('table_operation_log_details')}</div>
                                    </div>
                                    <div className="operation-log__body">
                                        {filterHistory?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="operation-log__row"
                                            >
                                                <div className="operation-log__column col-id"><span className="label">{t('table_operation_log_id')}:</span> {item.account_id}</div>
                                                <div className="operation-log__column col-date"><span className="label">{t('table_operation_log_date')}:</span> {moment(item.action_time).format('YYYY.MM.DD')}</div>
                                                <div className="operation-log__column col-time"><span className="label">{t('table_operation_log_time')}:</span> {moment(item.action_time).format('HH:MM:SS')}</div>
                                                <div className="operation-log__column col-tools"><span className="label">{t('table_operation_log_tools')}:</span> {item.device}</div>
                                                <div className="operation-log__column col-details"><span className="label">{t('table_operation_log_details')}:</span> {item.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {totalItems > 0 ?
                                    <div className="pagination__wrapper f jcb aic">
                                        <div className="pagination__display">
                                            {`${totalItems}件中${activePage > 1 ? ((activePage*16 + 1) - 16) : 1 }-${(activePage*16) > totalItems ? totalItems : activePage*16}を表示`}
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
                                            activePage={activePage}
                                            itemsCountPerPage={perPage}
                                            totalItemsCount={totalItems}
                                            pageRangeDisplayed={rangePage}
                                            onChange={e => handlePageChange(e)}
                                        />
                                    </div>
                                    : null
                                }
                            </div>
                            
                            <div className="billing-amount">
                                <div className="billing-amount__heading f jcb aic">
                                    <h4 className="billing-amount__title">{t('status_billing_amount')}</h4>
                                    <div className="billing-amount__filters">
                                        <select className="form-select" onChange={onChangeYearBilling.bind(this)}>
                                            {years.map((item, index) => (
                                                <option key={index} value={item.value} selected={item.value == current_year}>{item.label}</option>
                                            ))}
                                        </select>
                                        <select className="form-select" onChange={onChangeMonthBilling.bind(this)}>
                                            {months.map((item, index) => (
                                                <option key={index} value={item.value} selected={item.value == current_month}>{item.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="billing-amount__table">
                                    <div className="billing-amount__head">
                                        <div className="billing-amount__column col-id">{t('table_billing_amount_id')}</div>
                                        <div className="billing-amount__column col-date">{t('table_billing_amount_date')}</div>
                                        <div className="billing-amount__column col-price">{t('table_billing_amount_unit_price')}</div>
                                        <div className="billing-amount__column col-details">{t('table_billing_amount_usage_details')}</div>
                                    </div>
                                    <div className="billing-amount__body">
                                        {filterBilling?.map((item, index) => (
                                            <div
                                                key={index}
                                                className="billing-amount__row"
                                            >
                                                <div className="billing-amount__column col-id"><span className="label">{t('table_billing_amount_id')}:</span> {item._id}</div>
                                                <div className="billing-amount__column col-date"><span className="label">{t('table_billing_amount_date')}:</span> {moment(item.created_time).format('YYYY-MM-DD')}</div>
                                                <div className="billing-amount__column col-price"><span className="label">{t('table_billing_amount_unit_price')}:</span> {item.payee}円
                                                </div>
                                                <div className="billing-amount__column col-details"><span className="label">{t('table_billing_amount_usage_details')}:</span> {item.branch}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="billing-amount__total-price f jce acc">
                                        <div className="label">{t('table_billing_amount_total_label')}</div>
                                        <div className="price"> {totalBilling}円</div>
                                        <div className="tex">{t('table_billing_amount_text')}</div>
                                    </div>
                                </div>
                                {totalItemsBilling > 0 ?
                                    <div className="pagination__wrapper f jcb aic">
                                        <div className="pagination__display">
                                            {`${totalItemsBilling}件中${activePageBilling > 1 ? ((activePageBilling*16 + 1) - 16) : 1 }-${(activePageBilling*16) > totalItemsBilling ? totalItemsBilling : activePageBilling*16}を表示`}
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
                                            activePage={activePageBilling}
                                            itemsCountPerPage={perPageBilling}
                                            totalItemsCount={totalItemsBilling}
                                            pageRangeDisplayed={rangePageBilling}
                                            onChange={e => handlePageChangeBilling(e)}
                                        />
                                    </div>
                                    : null
                                }
                            </div>
                            
                        </div>
                    </div>
                </section>
            </main>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((Status)));
