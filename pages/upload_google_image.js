import React, { useState, useEffect } from "react";
import { withRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation } from "next-i18next";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import {RouteGuard} from "../components/RouteGuard";
import DocumentItems from "../components/document-items/document-items";
import PhotoCategory from "../components/photo-category/photo-category";
import Pagination from "react-js-pagination";
import PopupDocumentDownload from "../components/popup-document-download/popup-document-download";
import { businessService } from 'services';
import * as Notification from '../modules/Notification';

const UploadGoogleImage = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;
    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const readMask="storeCode,regularHours,name,languageCode,title,phoneNumbers,categories,storefrontAddress,websiteUri,regularHours,specialHours,serviceArea,labels,adWordsLocationExtensions,latlng,openInfo,metadata,profile,relationshipData,moreHours";
    const [imgFile, setImgFile] = useState();
    const [isOpenPopupConfirmDownload, setIsOpenPopupConfirmDownload] = useState(false);
    const handleConfirmDownload = (data) => {
        setIsOpenPopupConfirmDownload(!isOpenPopupConfirmDownload);
        setImgFile(data);
    }

    const handleClosePopupConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }
    
    const handleSaveFileConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }

    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    // document
    const documentTitle = 'Google アップロード';
    const documentItems = [];
    for (let i = 1; i <= 24; i++) {
        documentItems.push({
            _id: i,
            name: `Lorem input ${i}`,
            filename: 'document-item.pdf',
            src: `${process.env.BASE_PATH}/assets/images/document-item.svg`,
            url: `${process.env.BASE_PATH}/assets/images/document-item.pdf`,
        });
    }

    const [formatDocumentTutorial, setFormatDocumentTutorial] = useState('pdf');
    const [resultDocuments, setResultDocuments] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(4);
    const [totalItems, setTotalItems] = useState(16);
    const [totalPage, setTotalPage] = useState(1);
    const [rangePage, setRangePage] = useState(3);

    const getDocumentItems = (formatTutorial, page, per_page) => {
        businessService.getTutorialFiles(formatTutorial, page, per_page).then(response => {
            console.log(response)
            setResultDocuments(response.data);
            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    }

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
        getDocumentItems(formatDocumentTutorial, pageNumber, perPage);

        // const photosGood = paginateGood(documentItems, perPage, (pageNumber - 1));
        // console.log(photosGood);
        // setResultDocuments(photosGood);
    }

    const buttonStyle = {
        fontSize: '12px',
        height: '32px',
        margin: '2px',
        verticalAlign: 'middle',
        backgroundColor: '#dd4633',
        float: 'right',
    }; 

    const buttonGreyStyle = {
        fontSize: '12px',
        height: '32px',
        margin: '2px',
        verticalAlign: 'middle',
        backgroundColor: '#f2f2f2',
        float: 'right',
        color: 'black',
        boxShadow: 'boder-box',
        border: '1px solid gray',
    }; 
    
    useEffect(() => {
        getDocumentItems(formatDocumentTutorial, activePage, perPage);
    }, []);


    return (
        <RouteGuard>
            <div className="main-page main-page--help">
                <Sidebar isMenuActive="upload_google_image" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                <div className={`sidebar__overlay${isActiveSideBar ? " active" : ""}`}></div>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                    <div className="page__heading">
                        <p></p>
                        {/* <h2 className="page__title mb-0">{t('upload_google_image')}</h2> */}
                    </div>
                    <div className="content content--white content--help">
                        <div className="content__inner">
                            <div className="document__wrapper">
                                <button className="btn btn-danger" style={buttonGreyStyle} onClick={null}>キャンセル</button>
                                <button className="btn btn-danger" style={buttonStyle} onClick={null}>写真を削除</button>
                                <button className="btn btn-danger" style={buttonStyle} onClick={null}>アップロード</button>
                                <button className="btn btn-danger" style={buttonStyle} onClick={null}>提携サイトから削除</button>
                                <DocumentItems
                                    t={t}
                                    title={documentTitle}
                                    items={resultDocuments}
                                    handleConfirmDownload={handleConfirmDownload}
                                />
                                {totalItems > 0 ?
                                    <div className="pagination__wrapper f jcb aic">
                                        <div className="pagination__display">
                                            {`${totalItems}件中${activePage}-${totalPage}を表示`}
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
                    </div>
                </section>
                <PopupDocumentDownload t={t} lan={lan}
                               isOpen={isOpenPopupConfirmDownload}
                               data={imgFile}
                               handleClosePopup={handleClosePopupConfirmDownload}
                               handleSaveFile={handleSaveFileConfirmDownload} />
            </div>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((UploadGoogleImage)));
