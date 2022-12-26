import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import Pagination from "react-js-pagination";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import {RouteGuard} from "../components/RouteGuard";
import DocumentItems from "../components/document-items/document-items";
import VideoItems from "../components/video-items/video-items";
import PopupDocumentDownload from "../components/popup-document-download/popup-document-download";
import { tutorialService } from '../services'

const ReadGuide = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }
    
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
    
    // video 
    const videoTitle = 'チュートリアル動画（動画）';
    const videoItems = [];
    for (let i = 1; i <= 24; i++) {
        videoItems.push({
            _id: i,
            name: `Lorem input ${i}`,
            filename: 'video-item.mp4',
            url: `${process.env.BASE_PATH}/assets/images/video-item.mp4`,
        });
    }

    const [formatVideoTutorial, setFormatVideoTutorial] = useState('video');
    const [resultVideos, setResultVideos] = useState([]);
    const [activePageVideo, setActivePageVideo] = useState(1);
    const [perPageVideo, setPerPageVideo] = useState(8);
    const [totalItemsVideo, setTotalItemsVideo] = useState(16);
    const [totalPageVideo, setTotalPageVideo] = useState(1);
    const [rangePageVideo, setRangePageVideo] = useState(3);

    const getVideoItems = (formatTutorial, page, per_page) => {
        tutorialService.getTutorialFiles(formatTutorial, page, per_page).then(response => {
            setResultVideos(response.data);
            setTotalItemsVideo(response.page.total_count);
            setTotalPageVideo(response.page.total_page);
            setActivePageVideo(response.page.page);
            setPerPageVideo(response.page.per_page);
        });
    }

    const handlePageChangeVideo = (pageNumber) => {
        setActivePageVideo(pageNumber);
        getVideoItems(formatVideoTutorial, pageNumber, perPageVideo);

        // const videosGood = paginateGood(videoItems, perPageVideo, (pageNumber - 1));
        // setResultVideos(videosGood);
    }

    useEffect(() => {
        getDocumentItems(formatDocumentTutorial, activePage, perPage);

        // const documentsGood = paginateGood(documentItems, perPage, (activePage - 1));
        // setResultDocuments(documentsGood);

        getVideoItems(formatVideoTutorial, activePageVideo, perPageVideo)
        // const videosGood = paginateGood(videoItems, perPageVideo, (activePageVideo - 1));
        // setResultVideos(videosGood);
    }, []);

    return (
        <RouteGuard>
            <main className="main-page main-page--read-guide">
                <Sidebar isMenuActive="read_guide" isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>

                    <div className="content content--read-guide">
                        <div className="content__inner">
                            <div className="document__wrapper">
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

                            <div className="video__wrapper">
                                <VideoItems
                                    t={t}
                                    title={videoTitle} 
                                    items={resultVideos} 
                                />
                                {totalItemsVideo > 0 ?
                                    <div className="pagination__wrapper f jcb aic">
                                        <div className="pagination__display">
                                            {`${totalItemsVideo}件中${activePageVideo}-${totalPageVideo}を表示`}
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
                                            activePage={activePageVideo}
                                            itemsCountPerPage={perPageVideo}
                                            totalItemsCount={totalItemsVideo}
                                            pageRangeDisplayed={rangePageVideo}
                                            onChange={e => handlePageChangeVideo(e)}
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
                               data={pdfFile}
                               handleClosePopup={handleClosePopupConfirmDownload}
                               handleSaveFile={handleSaveFileConfirmDownload} />
            </main>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((ReadGuide)));
