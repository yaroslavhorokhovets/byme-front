import React, {useState, useEffect, useCallback} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import IconSvg from "../../components/icon/";
import PopupInvoiceEdit from '../../components/popup-invoice-edit/popup-invoice-edit';
import Pagination from "react-js-pagination";

import moment from 'moment';
import InputDateTime from '../../components/input-datetime/input-datetime';

import { AccountService, ActivityService, InvoicesService } from '../../services';
import PopupInvoiceDownload from '../../components/popup-invoice-download/popup-invoice-download';
import PopupInvoiceUpload from '../../components/popup-invoice-upload/popup-invoice-upload';
import * as Notification from "../../modules/Notification";


const Billing = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
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

    // Handle submit Form
    const handleSubmitFilter = () => {
        const actionTimeSelected = moment(parentDateState).format('YYYY-MM');
        setActionTime(actionTimeSelected);
        //console.log('checkboxes : ', isCheck);
        //console.log('valueFacilityCode : ', valueFacilityCode);
        //console.log('choose date : ', actionTimeSelected);
        //console.log(': --------------------- : ');
        
        getInvoices(actionTimeSelected, activePage, perPage);
    }
    
    // handle checkbox 
    const [isCheck, setIsCheck] = useState([]);
    const handleChecked = (e) => {
        const { id, checked } = e.target;
        //console.log([...isCheck, id]);

        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter(item => item !== id));
        }
    }

    // ---------- Filter data logic 
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
            //console.log(response.data);
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

    // ------------- action table
    // Fetch invoices data
    const getInvoices = (action_time, page, per_page) => {
        InvoicesService.getInvoices(action_time, page, per_page).then(response => {
            //console.log(`getInvoices `, response)
            setFilterBilling(response.list);

            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    }
    // pagination invoices
    const handlePageChange = (pageNumber) => {
        //console.log(`active page is ${pageNumber}`);
        setActivePage(pageNumber);
        getInvoices(actionTime, pageNumber, perPage);
    }

    const currentActionTime = moment('2022-06').format('YYYY-MM');
    const [actionTime, setActionTime] = useState(currentActionTime);
    
    const [filterBilling, setFilterBilling] = useState();
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(40);
    const [totalPage, setTotalPage] = useState(4);
    const [rangePage, setRangePage] = useState(3);

    const [isCheckBilling, setIsCheckBilling] = useState([]);
    const handleCheckedBilling = (e) => {
        const { id, checked } = e.target;
        setIsCheckBilling([...isCheckBilling, id]);
        if (!checked) {
            setIsCheckBilling(isCheckBilling.filter(item => item !== id));
        }
    }

    const [currentInvoice, setCurrentInvoice] = useState(null);
    const handleInvoiceEdit = (obj) => {
        setCurrentInvoice(obj);
        setIsOpenPopup(true)
    }

    // -- handle popup edit
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const handleCancelPopup = () => {
        getInvoices(actionTime, activePage, perPage);
        setIsOpenPopup(false);
    }
    
    const handleClosePopup = () => {
        getInvoices(actionTime, activePage, perPage);
        setIsOpenPopup(false);
    } 

    // -- action popup download 
    const [isOpenPopupConfirmDownload, setIsOpenPopupConfirmDownload] = useState(false);
    const [csvFile, setCsvFile] = useState();
    const [popupMsg, setPopupMsg] = useState();
    
    const handleInvoiceDownload = (obj) => {
        setCurrentInvoice(obj)
        setIsOpenPopupConfirmDownload(true);
        if (obj) {
            InvoicesService.downloadInvoice([obj._id]).then(response => {
                if (response.code == 200) {
                    //console.log(`InvoicesService.downloadInvoice`, response);
                    setCsvFile(response.data);
                    // setPopupMsg(t('msg_invoice_download_success'));
                }
            });
        }
    }

    const handleClosePopupConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }

    const handleSaveFileConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }

    // -- handle popup upload 
    const [isOpenPopupConfirmUpload, setIsOpenPopupConfirmUpload] = useState(false);
    const [popupMsgSuccessUpload, setPopupMsgSuccessUpload] = useState();
    const [popupMsgErrorUpload, setPopupMsgErrorUpload] = useState();

    const uploadDocumentFile = (fileUpload) => {
        InvoicesService.uploadInvoice(fileUpload).then(response => {
            if (response.code == 200) {
                // Refesh data table invoices
                getInvoices(actionTime, activePage, perPage);
                Notification.success(t('msg_invoice_upload_success'));
            } else {
                Notification.error(t('msg_invoice_upload_error'));
            }
        });
    }

    const [excelFile, setExcelFile] = useState(null);
    const handleClosePopupConfirmUpload = () => setIsOpenPopupConfirmUpload(false);
    const handleSaveFileConfirmUpload = (e) => {
        const files = e.target.files || e.dataTransfer.files;
        //console.log(`handleSaveFileConfirmUpload`, files);
        const fileList = Object.keys(files).map((file) => files[file]);
        if (fileList.length > 0) {
            const file = fileList[0];
            setExcelFile(file);
        }
    }
    const handleSubmitUploadFile = () => {
        if (excelFile) {
            try {
                const formData = new FormData();
                formData.append('file', excelFile);
                uploadDocumentFile(formData);
            } catch (e) {
                setPopupMsgErrorUpload(t('msg_invoice_upload_error'));
            }
        }
    }
    
    const handleSubmitInvoiceUpload = () => {
        setIsOpenPopupConfirmUpload(true);
        // open popup upload files csv invoices
        //console.log(`handleSubmitInvoiceUpload`);
    }

    const handleSubmitInvoiceDownload = () => {
        if (isCheckBilling.length > 0) {
            //console.log(`handleSubmitInvoiceDownload`, isCheckBilling);

            InvoicesService.downloadInvoice(isCheckBilling).then(response => {
                if (response.code == 200) {
                    //console.log(`InvoicesService.downloadInvoice`, response);
                    Notification.success(t('msg_invoice_download_success'));
                    window.open(response.data);
                }
            });
        } else {
            Notification.warning(t('msg_invoice_download_warning'));
        }
    }

    useEffect(() => {
        // Get Account Action filter checkboxes 
        getAccountActionFilter(searchText, codeUser, activePageFilter, perPageFilter);
        
        // filter billing 
        getInvoices(actionTime, activePage, perPage);
    }, []);
    
    return (
        <RouteGuard>
            <main className="main-page main-page--setting-billing">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="billing"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('billing_page_title')}</h2>
                    </div>

                    <div className="content content--white content--setting-billing">
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

                            <div className="billing__buttons form-buttons f jcc aic">
                                <button 
                                    className="btn btn-primary btn-block btn-gradient" 
                                    type="button"
                                    onClick={handleSubmitInvoiceUpload}
                                >
                                    {t('billing_button_filter')}
                                </button>
                            </div>

                            <div className="billing__table">
                                <div className="billing__head">
                                    <div className="billing__column col-name">{t('billing_table_col_name')}</div>
                                    <div className="billing__column col-billing-date">{t('billing_table_col_billing_date')}</div>
                                    <div className="billing__column col-transfer-date">{t('billing_table_col_transfer_date')}</div>
                                    <div className="billing__column col-major_items">{t('billing_table_col_major_items')}</div>
                                    <div className="billing__column col-sub-item">{t('billing_table_col_sub_item')}</div>
                                    <div className="billing__column col-quantity">{t('billing_table_col_quantity')}</div>
                                    <div className="billing__column col-payee">{t('billing_table_col_payee')}</div>
                                    <div className="billing__column col-selection">{t('billing_table_col_selection')}</div>
                                    <div className="billing__column col-action">{t('billing_table_col_action')}</div>
                                </div>
                                <div className="billing__body">
                                    {filterBilling?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="billing__row"
                                        >
                                            <div className="billing__column col-name">{item.username}</div>
                                            <div className="billing__column col-billing-date">{moment(item.day_request).format('YYYY/MM/DD')}</div>
                                            <div className="billing__column col-transfer-date">{moment(item.day_transfer).format('YYYY/MM/DD')}</div>
                                            
                                            <div className="billing__column col-major_items">{item.big_project}</div>
                                            <div className="billing__column col-sub-item">{item.small_project}</div>
                                            
                                            <div className="billing__column col-quantity">{item.quantity}</div>
                                            <div className="billing__column col-payee">{item.payee}円</div>
                                            
                                            <div className="billing__column col-selection">
                                                <div className="form-group__checkbox form-group__checkbox--primary">
                                                    <input type="checkbox"
                                                           onChange={e => handleCheckedBilling(e)}
                                                           id={item._id}
                                                           name={`billing_${item._id}`}
                                                           value={item._id}
                                                           checked={isCheckBilling.includes(item._id)}
                                                    />
                                                    <label htmlFor={item._id}></label>
                                                </div>
                                            </div>
                                            <div className="billing__column col-action">
                                                <button
                                                    className='billing__edit'
                                                    type='button'
                                                    onClick={e => handleInvoiceEdit(item)}
                                                >
                                                    <IconSvg icon='table_edit' />
                                                </button>
                                                <button
                                                    className='billing__download'
                                                    type='button'
                                                    onClick={e => handleInvoiceDownload(item)}
                                                >
                                                    <IconSvg icon='table_download' />
                                                </button>
                                            </div>
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

                            <div className="billing-buttons f jcc aic">
                                <button 
                                    onClick={handleSubmitInvoiceDownload}
                                    className="btn btn-primary btn-gradient" 
                                    type="button">{t('billing_button_invoice_upload')}</button>
                                <button 
                                    onClick={handleSubmitInvoiceDownload}
                                    className="btn btn-primary btn-gradient" 
                                    type="button">{t('billing_button_receipt_upload')}</button>
                            </div>
                        </div>
                    </div>
                </section>

                <PopupInvoiceEdit
                    t={t} lan={lan}
                    invoice={currentInvoice}
                    isOpen={isOpenPopup}
                    handleClosePopup={handleClosePopup}
                    handleCancel={handleCancelPopup} />

                <PopupInvoiceDownload
                    t={t} lan={lan}
                    msg={popupMsg}
                    isOpen={isOpenPopupConfirmDownload}
                    data={csvFile}
                    handleClosePopup={handleClosePopupConfirmDownload}
                    handleSaveFile={handleSaveFileConfirmDownload}
                />
                <PopupInvoiceUpload
                    t={t} lan={lan}
                    isErrorUpload={popupMsgErrorUpload}
                    isSuccessUpload={popupMsgSuccessUpload}
                    isOpen={isOpenPopupConfirmUpload}
                    handleClosePopup={handleClosePopupConfirmUpload}
                    handleSaveFile={handleSaveFileConfirmUpload}
                    handleSubmit={handleSubmitUploadFile}
                />
            </main>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter(Billing));
