import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';

import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from "yup"

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import { PushNotificationService } from 'services';
import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import IconSvg from "../../components/icon/";
import Pagination from "react-js-pagination";
import moment from 'moment';
import InputTime from '../../components/input-time/input-time'
import InputDateTime from '../../components/input-datetime/input-datetime'
import PopupNoticeHistoryDelete from '../../components/popup-notice-history-delete/popup-notice-history-delete'
import PopupNoticeHistoryEdit from '../../components/popup-notice-history-edit/popup-notice-history-edit'
import * as Notification from '../../modules/Notification';

const PushNotification = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    // schema form
    const validationSchema = yup.object().shape({
        notice_input_title: yup.string().required(t('input_valid_empty')),
        // notice_input_url: yup.string().required(t('input_valid_empty')),
        notice_input_contents: yup.string().required(t('input_valid_empty')),
    });

    const formOptions = { mode: 'onBlur',resolver: yupResolver(validationSchema) };

    // get functions to build form with useForm() hook
    const { register, handleSubmit, reset, setValue, getValues, setError , formState } = useForm(formOptions);
    const { errors } = formState;

    const [msgSuccess, setMsgSuccess] = useState(null);
    const onSubmit = ({ notice_input_title, notice_input_url, notice_input_contents}) => {
        const action_date = moment(currentDate).format('YYYY-MM-DD');
        const action_time = currentTime.format('HH:mm:ss');
        const result_date = `${action_date}, ${action_time}`; 
        const d = new Date(result_date);
        const isoDate = d.toISOString();
        
        PushNotificationService.addPushNotification(isoDate, notice_input_title, notice_input_url, notice_input_contents).then(response => {
            if (response.code == 200) {
                getPushNotification(activePage, perPage);
                Notification.success(t('msg_push_notification_success'));
                // setMsgSuccess(t('msg_push_notification_success'));
            } else {
                Notification.error(t('msg_push_notification_error'));
                // setError('apiError', { message: t('msg_push_notification_error') || error });
            }
        });
        
        return true;
    }
    
    // 0 - get time and date 
    const date = new Date();
    const [currentDate, setCurrentDate] = useState(date);
    const handleDateChange = (date) => {
        setCurrentDate(date);
    }

    const time = moment();
    const [currentTime, setCurrentTime] = useState(time);
    const handleTimeChange = (value) => {
        //console.log(`handleTimeChange:: `, value);
        setCurrentTime(value);
    }

    // action table
    const [currentPushId, setCurrentPushId] = useState();
    const [currentItemPush, setCurrentItemPush] = useState();
    const handlePostHistoryEdit = (item) => {
        const push_id = item?._id;
        setCurrentPushId(push_id);
        setCurrentItemPush(item);
        setIsOpenPopupEdit(true);
    }
    const handlePostHistoryDelete = (item) => {
        const push_id = item?._id;
        setCurrentPushId(push_id);
        setCurrentItemPush(item);
        setIsOpenPopupDelete(true);
    }

    // 1 - Get list push notification 
    const [pushNotificationList, setPushNotificationList] = useState();
    const getPushNotification = (page, per_page) => {
        PushNotificationService.getPushNotification(page, per_page).then(response => {
            setPushNotificationList(response.data);
            
            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    }
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(40);
    const [totalPage, setTotalPage] = useState(4);
    const [rangePage, setRangePage] = useState(3);

    // pagination 
    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        getPushNotification(pageNumber, perPage);
    }

    // popup action delete
    const [isOpenPopupDelete, setIsOpenPopupDelete] = useState(false);
    const handleNoticeHistoryDeleteClosePopup = () => {
        setIsOpenPopupDelete(false);
    }
    const handleNoticeHistoryDeleteCancel = () => {
        setIsOpenPopupDelete(false);
    }
    const [msgDeletePush, setMsgDeletePush] = useState();
    const handleNoticeHistoryDeleteSave = () => {
        //console.log(`handleNoticeHistoryDeleteSave`, currentPushId);
        PushNotificationService.deletePushNotification(currentPushId).then(response => {
            if (response.code == 200) {
                getPushNotification(activePage, perPage);
                Notification.success(t('msg_push_notification_success'));
                // setMsgDeletePush({success: t('msg_push_notification_success')});
                setIsOpenPopupDelete(false);
            } else {
                Notification.error(t('msg_push_notification_error'));
                // setMsgDeletePush({error: t('msg_push_notification_error')});
            }
        });
        setIsOpenPopupDelete(false);
    }

    // popup action edit
    const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
    const handleNoticeHistoryEditClosePopup = () => {
        setIsOpenPopupEdit(false);
    }
    const handleNoticeHistoryEditCancel = () => {
        setIsOpenPopupEdit(false);
    }
    const [msgEditPush, setMsgEditPush] = useState();
    const handleNoticeHistoryEditSave = ({description}) => {
        //console.log(`handleNoticeHistoryEditSave : `, description);
        PushNotificationService.editPushNotification(currentPushId, description).then(response => {
            if (response.code == 200) {
                getPushNotification(activePage, perPage);
                Notification.success(t('msg_push_notification_success'));
                // setMsgEditPush({success: t('msg_push_notification_success')});
            } else {
                Notification.error(t('msg_push_notification_error'));
                // setMsgEditPush({error: t('msg_push_notification_error')});
            }
        });
        setIsOpenPopupEdit(false);
        return true;
    }

    useEffect(() => {
        getPushNotification(activePage, perPage);
    }, []);

    return (
        <RouteGuard>
            <main className="main-page main-page--push-notification">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="push-notification"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar}
                            onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('push_notification_heading')}</h2>
                    </div>

                    <div className="content content--white content--setting-push-notification">
                        <div className="content__inner">
                            <h4 className="notice__title">{t('notice_page_title')}</h4>
                            <div className="notice__form">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label className="form-label">{t('notice_input_datetime')}</label>
                                        <div className="form-date-value f jcs aic">
                                            <InputTime 
                                                value={currentTime}
                                                handleValueChange={handleTimeChange.bind(this)}
                                            />
                                            <InputDateTime
                                                date={currentDate}
                                                handleChange={handleDateChange.bind(this)} 
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="notice_input_title">{t('notice_input_title')}</label>
                                        <div className="form-value">
                                            <input type="text" id="notice_input_title"
                                                   className="form-control"
                                                   {...register('notice_input_title')}
                                                   placeholder={t('notice_input_title_placeholder')}/>
                                            <div className="text-danger">{errors.notice_input_title?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-group d-none">
                                        <label className="form-label" htmlFor="notice_input_url">{t('notice_input_url')}</label>
                                        <div className="form-value">
                                            <input type="text" id="notice_input_url"
                                                   className="form-control"
                                                   {...register('notice_input_url')}
                                                   placeholder={t('notice_input_url_placeholder')}/>
                                            <div className="text-danger">{errors.notice_input_url?.message}</div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label" htmlFor="notice_input_contents">{t('notice_input_contents')}</label>
                                        <div className="form-value">
                                            <textarea id="notice_input_contents"
                                                      className="form-control"
                                                      {...register('notice_input_contents')}
                                                      placeholder={t('notice_input_contents_placeholder')}
                                                      rows="5"></textarea>
                                            <div className="text-danger">{errors.notice_input_contents?.message}</div>
                                        </div>
                                    </div>

                                    {errors.apiError && <div className="text-danger error-service align-c mb-4">{errors.apiError?.message}</div> }
                                    {msgSuccess && <div className="text-success align-c mb-4">{msgSuccess}</div> }

                                    <div className="form-buttons f jcc aic">
                                        <button className="btn btn-primary btn-block btn-gradient" type="submit">{t('notice_button_post')}</button>
                                    </div>
                                </form>
                            </div>


                            <h4 className="post-history__title">{t('notice_post_history_title')}</h4>
                            <div className="post-history__table">
                                <div className="post-history__head">
                                    <div className="post-history__column col-second">{t('notice_table_col_second')}</div>
                                    <div className="post-history__column col-date">{t('notice_table_col_date')}</div>
                                    <div className="post-history__column col-contents">{t('notice_table_col_contents')}</div>
                                    <div className="post-history__column col-action">{t('notice_table_col_action')}</div>
                                </div>
                                <div className="post-history__body">
                                    {pushNotificationList?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="post-history__row"
                                        >
                                            <div className="post-history__column col-second"><span className="label">{t('notice_table_col_second')}:</span> {item._id}</div>
                                            <div className="post-history__column col-date"><span className="label">{t('notice_table_col_date')}:</span> {moment(item.action_time).format('YYYY.MM.DD')}</div>
                                            <div className="post-history__column col-contents"><span className="label">{t('notice_table_col_contents')}:</span> {item.description}</div>
                                            <div className="post-history__column col-action">
                                                <span className="label">{t('notice_table_col_action')}:</span>
                                                <button
                                                    className='post-history__edit'
                                                    type='button'
                                                    onClick={e => handlePostHistoryEdit(item)}
                                                >
                                                    <IconSvg icon='table_edit' />
                                                </button>
                                                <button
                                                    className='post-history__delete'
                                                    type='button'
                                                    onClick={e => handlePostHistoryDelete(item)}
                                                >
                                                    <IconSvg icon='table_delete' />
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
                        </div>
                    </div>
                </section>

                <PopupNoticeHistoryDelete
                    t={t} lan={lan}
                    msg={msgDeletePush}
                    isOpen={isOpenPopupDelete}
                    handleClosePopup={handleNoticeHistoryDeleteClosePopup}
                    handleRequestSubmit={handleNoticeHistoryDeleteSave}
                    handleCancel={handleNoticeHistoryDeleteCancel} />

                <PopupNoticeHistoryEdit
                    t={t} lan={lan}
                    item={currentItemPush}
                    msg={msgEditPush}
                    isOpen={isOpenPopupEdit}
                    handleClosePopup={handleNoticeHistoryEditClosePopup}
                    handleRequestSubmit={handleNoticeHistoryEditSave}
                    handleCancel={handleNoticeHistoryEditCancel} />
            </main>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((PushNotification)));
