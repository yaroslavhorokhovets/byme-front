import React, { Fragment, useState, useEffect } from "react";
import { withRouter } from "next/router";
import { connect } from "react-redux";
import htmlReactParse from 'html-react-parser';
import moment from "moment";
import Link from "next/link";

// language
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

// component
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import IconSvg from "components/icon/";
import { RouteGuard } from "../components/RouteGuard";
import { InvoicesService, PushNotificationEmailService, reportService, userService } from '../services'

const Report = (props) => {
    const { classPrefix, notices } = props;
    const { title, content } = props.data;

    return (
        <div className={`report ${classPrefix ? classPrefix : ''}`}>
            <div className="report__inner">
                <div className="report__heading f jcs aic">
                    <IconSvg icon="alert" />
                    <div className="report__title">{title}</div>
                </div>
                {notices.length > 0 ?
                    <div className="report__content">
                        {notices?.map((item, index) => (
                            <div key={index} className="report__content-item">
                                {item?.created_time &&
                                    <p>{moment(item?.created_time).format('YYYY.MM.DD')}</p>
                                }
                                {item?.description &&
                                    <p>{item?.description}</p>
                                }
                            </div>
                        ))}
                    </div>
                    :
                    <div className="report__content">{content}</div>
                }
            </div>
        </div>
    );
}

const TotalReport = (props) => {
    const { classPrefix } = props;
    const { title, number, unit, list } = props.data;
    return (
        <div className={`total-report ${classPrefix ? classPrefix : ''}`}>
            <div className="total-report__inner">
                <div className="total-report__heading f jcs aic">{title}</div>
                <div className="total-report__content align-c">
                    <span className="total-report__number c-primary">{number}</span>
                    <span className="total-report__unit">{unit}</span>
                </div>
                {list?.length > 0 ? (
                    <>
                        <ul className="total-report__list">
                            {list?.map((item, index) => (
                                <li key={index} className="total-report__item">{item.facility_name ? item.facility_name : item.username}</li>
                            ))}
                        </ul>
                        <div className="total-report__see-more">???????????????</div>
                    </>
                ) : ''}
            </div>
        </div>
    );
}

const ChartReport = (props) => {
    const { classPrefix } = props;
    const { title, link, icon } = props.data;
    return (
        <Link href={link ? link : ''}>
            <div className={`chart-report block align-c ${classPrefix ? classPrefix : ''}`}>
                <div className="chart-report__inner">
                    <div className="chart-report__heading f jcc aic">
                        <IconSvg icon={icon ? icon : 'chart'} />
                    </div>
                    <div className="chart-report__content">{title}</div>
                </div>
            </div>
        </Link>
    );
}

const Index = props => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    const [notices, setNotices] = useState([]);
    const getPushNotification = (page, per_page) => {
        PushNotificationEmailService.getPushNotification(page, per_page).then(response => {
            setNotices(response.data);
        });
    }

    const [user, setUser] = useState(null);
    const [userPermission, setUserPermission] = useState('user');
    const getUserDetails = () => {
        userService.getAll().then(user => {
            console.log(`user::: `, user);
            setUser(user.data);
            setUserPermission(user?.permission);
        });
    }


    const [reportDelete, setReportDelete] = useState(0);
    const [reportUpload, setReportUpload] = useState(0);
    const [reportEdited, setReportEdited] = useState(0);
    const [reportRequestEdit, setReportRequestEdit] = useState(0);
    const getUserReport = (start_time, end_time) => {
        reportService.getReports(start_time, end_time).then(response => {
            if (response.code == 200) {
                const data = response.data;
                setReportDelete(data.number_image_delete);
                setReportUpload(data.number_image_upload);
                setReportEdited(data.number_image_edited);
                setReportRequestEdit(data.number_image_request_edit);
            }
        });
    }



    const [numberImageTakeToday, setNumberImageTakeToday] = useState(0);
    const [numberImageEdited, setNumberImageEdited] = useState(0);
    const [numberImageRequest, setNumberImageRequest] = useState(0);

    const [reportNumberAccounts, setReportNumberAccounts] = useState(0);
    const [reportAccounts, setReportAccounts] = useState([]);
    const getAdminReport = (start_time, end_time) => {
        reportService.getAdminReports(start_time, end_time).then(response => {
            if (response.code == 200) {
                const data = response.data;
                setNumberImageEdited(data.number_image_edited);
                setNumberImageTakeToday(data.number_image_take_today);
                setNumberImageRequest(data.number_image_request_edit);

                setReportAccounts(data.account_range_time?.list);
                setReportNumberAccounts(data.account_range_time?.number);
            }
        });
    }

    const [excelFileInvoice, setExcelFileInvoice] = useState(null);
    const getLinkExcelFileInvoice = () => {
        InvoicesService.downloadInvoiceUser().then(response => {
            if (response.code == 200) {
                const data = response.data;
                setExcelFileInvoice(data);
            }
        });
    }

    useEffect(() => {
        // const today = moment('2022-04-01').format('YYYY-MM-DD');
        const today = moment().format('YYYY-MM-DD');
        const start_time = today;
        const end_time = moment(today).add(1, 'month').format('YYYY-MM-DD');

        getUserReport(start_time, end_time);
        getAdminReport(start_time, end_time);
        getUserDetails();

        getPushNotification(1, 2);
        getLinkExcelFileInvoice();

    }, []);

    const reportData = {
        title: '????????????',
        content: htmlReactParse('<p>2022.05.27</p><p>????????? ???????????????????????????????????????????????????????????????????????????????????????</p><p>2022.05.04</p><p>????????????????????????????????????????????????????????????????????????????????????????????????????????????</p>')
    }

    const chartReportData1 = {
        title: '???????????????',
        link: '/status',
        icon: 'chart'
    }
    const chartReportData2 = {
        title: '?????????',
        link: excelFileInvoice,
        icon: 'invoice'
    }
    const chartReportData3 = {
        title: '?????????',
        link: excelFileInvoice,
        icon: 'receipt'
    }

    const reportUploadData = {
        title: '??????????????????????????????',
        number: reportUpload,
        unit: '???'
    }
    const reportEditedData = {
        title: '??????????????????????????????',
        number: reportEdited,
        unit: '???'
    }
    const reportRequestEditData = {
        title: '????????????????????????',
        number: reportRequestEdit,
        unit: '???'
    }
    const reportDeleteData = {
        title: '???????????????????????????????????????',
        number: reportDelete,
        unit: '???'
    }

    // admin 
    const reportUploadDataAdmin = {
        title: '???????????????????????????',
        number: numberImageTakeToday,
        unit: '???'
    }
    const reportRequestEditDataAdmin = {
        title: '?????????????????????',
        number: numberImageRequest,
        unit: '???'
    }
    const reportEditedDataAdmin = {
        title: '?????????????????????',
        number: numberImageEdited,
        unit: '???'
    }

    const reportAccountsData = {
        title: '??????????????????????????????',
        number: reportNumberAccounts,
        unit: '???',
        list: reportAccounts
    }

    console.log(`notices::: `, notices);

    return (
        <RouteGuard>
            <div className="main-page main-page--dashboard">
                <Sidebar isMenuActive="dashboard" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar} />
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`} >
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar} />

                    {user?.permission == 'user' ?
                        (
                            <div className="welcome">
                                <p className="welcome__guest">
                                    {`${t('welcome_guest')} ${user?.facility_name} ${t('welcome_guest_last')} ${user?.representative_name} ${t('welcome_guest_end')} `} 
                                    <span className="welcome__facility-code c-primary">{`${t('welcome_facility_code')} ${user?.facility_code}`}</span>
                                </p>
                                
                            </div>
                        ) : null}

                    <div className="content content--no-title content--dashbroad">
                        <div className="content__inner f jcs ais">
                            <div className={user?.permission == 'user' ? "content-left" : "content-full"}>

                                {user?.permission == 'user' ? <Report data={reportData} notices={notices} /> : null}

                                <div className="total-reports f jcc ait fw">
                                    {user?.permission == 'user' ? (
                                        <>
                                            <TotalReport data={reportUploadData} />
                                            <TotalReport data={reportEditedData} />
                                            <TotalReport data={reportRequestEditData} />
                                            <TotalReport data={reportDeleteData} />
                                        </>
                                    )
                                        :
                                        (
                                            <>
                                                <TotalReport data={reportUploadDataAdmin} />
                                                <TotalReport data={reportRequestEditDataAdmin} />
                                                <TotalReport data={reportEditedDataAdmin} />
                                                <TotalReport data={reportAccountsData} />
                                            </>
                                        )
                                    }

                                </div>
                            </div>

                            {user?.permission == 'user' ? (
                                <div className="content-right">
                                    <ChartReport classPrefix="bg-chart-blue" data={chartReportData1} />
                                    <ChartReport classPrefix="bg-chart-orange" data={chartReportData2} />
                                    <ChartReport classPrefix="bg-chart-blue-50" data={chartReportData3} />
                                </div>
                            ) : null}

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

export default withTranslation()(withRouter((Index)));