import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import { tutorialService } from '../../services'
import Pagination from "react-js-pagination";
import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import DocumentItems from "../../components/document-items/document-items";
import PopupDocumentDownload from '../../components/popup-document-download/popup-document-download'

const Manual = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    
    // popup action 
    const [isOpenPopupConfirmDownload, setIsOpenPopupConfirmDownload] = useState(false);
    const [pdfFile, setPdfFile] = useState();
    const handleConfirmDownload = (data) => {
        setIsOpenPopupConfirmDownload(!isOpenPopupConfirmDownload);
        setPdfFile(data);
    }

    const handleClosePopupConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }

    const handleSaveFileConfirmDownload = () => {
        setIsOpenPopupConfirmDownload(false);
    }

    const paginateGood = (array, page_size, page_number) => {
        return array.slice(page_number * page_size, page_number * page_size + page_size);
    };

    // document
    const documentTitle = 'ダウンロード資料（書式）';
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
        tutorialService.getTutorialFiles(formatTutorial, page, per_page).then(response => {
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

    // handle upload action
    const uploadDocumentFile = (format_tutorial, fileUpload) => {
        tutorialService.uploadTutorialFiles(format_tutorial, fileUpload).then(response => {
            if (response.code == 200) {
                getDocumentItems(formatDocumentTutorial, activePage, perPage);
                setIsSuccessUpload(true);
            } else {
                setIsErrorUpload(true);
            }
        });
    }

    const [isErrorUpload, setIsErrorUpload] = useState(false);
    const [isSuccessUpload, setIsSuccessUpload] = useState(false);

    const handleUpload = (e) => {
        const files = e.target.files || e.dataTransfer.files;
        const fileList = Object.keys(files).map((file) => files[file]);
        if (fileList.length > 0) {
            const format_tutorial = 'pdf'; 
            const file = fileList[0];
                
            try {
                // *** FORMDATA
                const formData = new FormData();
                formData.append('file', file);
                uploadDocumentFile(format_tutorial, formData);
            } catch (e) {
                //console.log('err : ', e.message);
                setIsErrorUpload(true);
            }
        }
    }
    
    useEffect(() => {
        getDocumentItems(formatDocumentTutorial, activePage, perPage);

        // const documentsGood = paginateGood(documentItems, perPage, (activePage - 1));
        // setResultDocuments(documentsGood);
    }, []);

    return (
        <RouteGuard>
            <main className="main-page main-page--setting-manual">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="manual"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{`マニュアル`}</h2>
                    </div>
                    
                    <div className="content content--setting-manual">
                        <div className="content__inner">
                            <div className="document__wrapper">
                                <DocumentItems
                                    isUpload={true}
                                    t={t}
                                    title={documentTitle}
                                    items={resultDocuments}
                                    handleConfirmDownload={handleConfirmDownload}
                                    handleUpload={handleUpload}
                                    isSuccessUpload={isSuccessUpload}
                                    isErrorUpload={isErrorUpload}
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
                <PopupDocumentDownload 
                    t={t} lan={lan}
                   isOpen={isOpenPopupConfirmDownload}
                   data={pdfFile}
                   handleClosePopup={handleClosePopupConfirmDownload}
                   handleSaveFile={handleSaveFileConfirmDownload} 
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

export default withTranslation()(withRouter((Manual)));
