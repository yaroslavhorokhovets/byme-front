import React, {useState, useEffect} from "react";
import { withRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import Pagination from "react-js-pagination";
import {RouteGuard} from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import VideoItems from "../../components/video-items/video-items";
import { tutorialService } from '../../services'

const TutorialVideo = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar)
    }

    // video 
    const videoTitle = 'チュートリアル動画';
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
            //console.log(response.data);
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

    // handle upload video
    const uploadVideoFile = (format_tutorial, fileUpload) => {
        tutorialService.uploadTutorialFiles(format_tutorial, fileUpload).then(response => {
            if (response.code == 200) {
                getVideoItems(formatVideoTutorial, activePageVideo, perPageVideo);
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
            const format_tutorial = 'video'; 
            const file = fileList[0];
            try {
                // *** FORMDATA
                const formData = new FormData();
                formData.append('file', file);
                uploadVideoFile(format_tutorial, formData);
            } catch (e) {
                //console.log('err : ', e.message);
                setIsErrorUpload(true);
            }
        }
    }

    useEffect(() => {
        getVideoItems(formatVideoTutorial, activePageVideo, perPageVideo);
        // const videosGood = paginateGood(videoItems, perPageVideo, (activePageVideo - 1));
        // setResultVideos(videosGood);
    }, []);


    return (
        <RouteGuard>
            <div className="main-page main-page--tutorial-video">
                <Sidebar isMenuActive="user_setting"
                         isMenuChildActive="tutorial-video"
                         isActiveSideBar={isActiveSideBar}
                         onClick={handleClickSideBar}/>
                <section className={`wrapper ${isActiveSideBar ? "active" : ""}`}>
                    <Navbar isActiveSideBar={isActiveSideBar} onClick={handleClickSideBar}/>

                    <div className="page__heading">
                        <h2 className="page__title mb-0">{`チュートリアル動画`}</h2>
                    </div>
                    
                    <div className="content content--tutorial-video">
                        <div className="content__inner">
                            <div className="video__wrapper">
                                <VideoItems
                                    isUpload={true}
                                    t={t}
                                    title={videoTitle}
                                    items={resultVideos}
                                    handleUpload={handleUpload}
                                    isSuccessUpload={isSuccessUpload}
                                    isErrorUpload={isErrorUpload}
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
            </div>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((TutorialVideo)));
