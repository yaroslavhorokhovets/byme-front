import React, { useState, useEffect } from "react";
import { withRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "next-i18next";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import {RouteGuard} from "../components/RouteGuard";
import { businessService } from 'services';
import * as Notification from '../modules/Notification';
import { spinner } from '../public/assets/images/Spinner.gif'

const ReservationSiteCooperation = (props) => {
    const { t, i18n } = props;
    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const [businessEmail, setBusinessEmail] = useState("");
    const [businessDate, setBusinessDate] = useState("");
    const [loadingStatus, setLoadingStatus] = useState("block");
    const [preloaderStatus, setPreLoaderStatus] = useState("none");
    const [suffloaderStatus, setSuffLoaderStatus] = useState("none");

    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    //Will be populated after sign in.
    const signInBusiness = () => {

        if(businessEmail){ 
            return; 
        }
        setLoadingStatus("none");
        setPreLoaderStatus("block");
        businessService.startInit((result) => {
            setBusinessEmail(result.email);
            setBusinessDate(result.started_date);            
            setPreLoaderStatus("none");
            setSuffLoaderStatus("block");
            setTimeout(() => {
                setSuffLoaderStatus("none");
                setLoadingStatus("block");
            }, 1000)
        });
        // businessService.start();   //modern google api(updated at 11/21/2022)
    }

    const signOutBusiness = () => { 
        businessService.signOut();
        Notification.error(t('Sign Outed'));
        setBusinessEmail("")
        setBusinessDate("")
    }

    const changeBusinessPassword = () => {  
        businessService.changePassword();
        Notification.error(t('password changed'));
    }

    const tableStyle = {
        fontSize: '12px',
    };

    const buttonStyle = {
        fontSize: '12px',
        height: '32px',
        margin: '2px',
        verticalAlign: 'middle',
        backgroundColor: '#dd4633',
    }; 

    const preloaderStyle = {
        textAlign: 'center',
        height: '80%',
        display: preloaderStatus
    }; 

    const suffloaderStyle = {
        textAlign: 'center',
        height: '80%',
        display: suffloaderStatus
    };

    useEffect(() => {
        businessService.getBusinessProfile().then((response) => {
            if(response.data !== null && response.data.status){
                setBusinessEmail(response.data.email)
                setBusinessDate(response.data.started_date)
            }else{
                setBusinessEmail("")
                setBusinessDate("")
            }            
        }); 
    }, []);


    return (
        <RouteGuard>
            <div className="main-page main-page--help">
                <Sidebar isMenuActive="reservation_site_cooperation" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                    <div className="page__heading">
                        <h2 className="page__title mb-0">{t('reservation_site_cooperation')}</h2>
                    </div>
                    <div style={preloaderStyle}><img src="/assets/images/loading.webp" width="40%" alt="Logo" /></div>
                    <div style={suffloaderStyle}><img src="/assets/images/checked.png" width="16%" alt="Logo" /></div>
                    <div className="content content--white content--help" style={{'display':loadingStatus}}>
                        <div className="content__inner">
                            <div className="help f jcs ais">
                                <div className="help__form w-100">
                                    <table className="table" style={tableStyle}>
                                        <thead>
                                            <tr>
                                                <th className="text-center">予約サイト</th>
                                                <th className="text-center">ID</th>
                                                <th className="text-center">パスワード</th>
                                                <th className="text-center">前回巡回終了時刻</th>
                                                <th className="text-center">連携情報</th>
                                                <th className="text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="text-nowrap align-middle">                                           
                                                    <svg onClick={signInBusiness} xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill={!businessEmail?"red":"grey"} className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>&nbsp;
                                                    Googleビジネスプロフィール
                                                </td>
                                                <td className="text-nowrap align-middle">{businessEmail?businessEmail:''}</td>
                                                <td className="text-nowrap align-middle">{businessEmail?'●●●●●●':''}</td>
                                                <td className="text-nowrap align-middle">{businessDate?businessDate:''}</td>
                                                <td className="text-nowrap align-middle">{businessEmail?'開始済み':''/*'終了した'*/}</td>
                                                <td className="d-flex align-items-center">
                                                    <button className="btn btn-danger" onClick={signOutBusiness} style={buttonStyle} disabled={!businessEmail?'disabled':''}>連携解除</button>
                                                    <button className="btn btn-danger" onClick={changeBusinessPassword} style={buttonStyle} disabled={!businessEmail?'disabled':''}>パスワード変更</button>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="red" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>&nbsp;
                                                    楽天トラベル
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="red" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>&nbsp;
                                                    じゃらんnet
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="red" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>&nbsp;
                                                    一休.com
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="red" className="bi bi-plus-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                                    </svg>&nbsp;
                                                    るるぶトラベル
                                                </td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>
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

export default withTranslation()(withRouter((ReservationSiteCooperation)));
