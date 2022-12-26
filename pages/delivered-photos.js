import React, { Fragment, useState, useEffect } from "react";
import { withRouter } from "next/router";
import { RouteGuard } from "../components/RouteGuard";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";
import Sidebar from "../components/sidebar/sidebar";
import Navbar from "../components/navbar/navbar";
import Pagination from "react-js-pagination";
import PhotoItems from "../components/photo-items/photo-items";
import PopupPhotos from "../components/popup-photos/popup-photos";
import PopupDownload from "../components/popup-download/popup-download";
import PopupRequestEdit from "../components/popup-request-edit/popup-request-edit";
import {
    ImageService,
    downloadService,
    userService,
    AccountService,
} from "services";
import * as Notification from "../modules/Notification";
import { ActivityService } from "../services";
import IconSvg from "../components/icon/";
import PopupFilterPhoto from "components/popup-filter-photo/popup-filter-photo";
import moment from "moment";
import PopupRequestImageEdit from "components/popup-request-image-edit/popup-request-image-edit";

const DeliveredPhotos = (props) => {
    const { t, i18n } = props;
    const lan = i18n.language;

    // process logic sidebar
    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar);
    };

    const getRequestHistoryImages = (
        tab,
        page,
        per_page,
        account_ids,
        start_time,
        end_time
    ) => {
        ImageService.getFilterImages(
            tab,
            page,
            per_page,
            account_ids,
            start_time,
            end_time
        ).then((response) => {
            console.log(`getFilterImages`, response);
            setFilterPhotos(response.data);
            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    };

    const [filterPhotos, setFilterPhotos] = useState([]);
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(16);
    const [totalItems, setTotalItems] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [rangePage, setRangePage] = useState(3);

    const handlePageChange = (pageNumber) => {
        //console.log(`active page is ${pageNumber}`);
        setActivePage(pageNumber);
        getRequestHistoryImages(
            isActiveTab,
            pageNumber,
            perPage,
            isAccountCheck,
            startDate,
            endDate
        );
    };

    // process handle check all checkboxes
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    const [isCheckPhoto, setIsCheckPhoto] = useState([]);

    const handleChecked = (e) => {
        const { id, value, checked } = e.target;
        setIsCheck([...isCheck, id]);

        setIsCheckPhoto([...isCheckPhoto, value]);

        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== id));

            setIsCheckPhoto(isCheckPhoto.filter((item) => item !== value));
        }
    };

    const checkedAllPhoto = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(filterPhotos.map((photo) => photo._id));

        setIsCheckPhoto(filterPhotos.map((photo) => photo.image_id));
        if (isCheckAll) {
            setIsCheck([]);

            setIsCheckPhoto([]);
        }
    };

    // process handle click popup
    const [isOpenPopupPhoto, setIsOpenPopupPhoto] = useState(false);
    const [popupItemPhoto, setPopupItemPhoto] = useState({});
    const handleClickPopupImage = (photoItem) => {
        //console.log('handleClickPopupImage', photoItem);
        setPopupItemPhoto(photoItem);
        if (user?.permission == "user") {
            setIsOpenPopupPhoto(!isOpenPopupPhoto);
        } else {
            setIsOpenPopupImageEdit(!isOpenPopupImageEdit);
        }

        const id = photoItem.image_id;
        setIsCheck([]);
        setIsCheck([id]);
    };

    const handleDownload = (photo_id) => {
        setIsOpenPopupPhoto(!isOpenPopupPhoto);
        setIsOpenPopupDownload(!isOpenPopupDownload);
    };

    const handleRequestEdit = (photo_id) => {
        setIsOpenPopupPhoto(!isOpenPopupPhoto);
        setIsOpenPopupEdit(!isOpenPopupEdit);
    };

    const handleClosePopup = () => {
        setIsOpenPopupPhoto(false);
    };

    // popup download
    const [isOpenPopupDownload, setIsOpenPopupDownload] = useState(false);
    const handleClosePopupDownload = () => {
        setIsOpenPopupDownload(false);
    };
    const handleSaveFilesDownload = () => {
        setIsOpenPopupDownload(false);
    };
    const [valueRatioOption, setValueRatioOption] = useState("16x9");
    const radioChange = (e) => {
        const target = e.currentTarget;
        const currentValue = target.value;
        setValueRatioOption(currentValue);
        //console.log('Current Radio Checked :: ', currentValue);
    };
    const handleDownloadFiles = () => {
        const image_ids = isCheckPhoto; // get list image ids

        downloadService
            .downloadImage(valueRatioOption, image_ids)
            .then((response) => {
                //console.log('Zip File URL :: ', response.data);
                window.open(response.data);
            })
            .catch((error) => {});
        setIsOpenPopupDownload(false);
    };

    // popup request edit
    const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
    const handleClosePopupEdit = () => {
        setIsOpenPopupEdit(false);
    };

    const [msgRequestEdit, setMsgRequestEdit] = useState("");
    const handleSubmitRequestEdit = ({ note }) => {
        //console.log('handleSubmitRequestEdit ::: ', note);
        const image_ids = isCheck; // get list image ids

        setMsgRequestEdit("");
        downloadService
            .photoRequestEdit(image_ids, note)
            .then((response) => {
                if (response.code == 200) {
                    getRequestHistoryImages(
                        isActiveTab,
                        activePage,
                        perPage,
                        isAccountCheck,
                        startDate,
                        endDate
                    );

                    ActivityService.addActivityHistory(
                        "Web",
                        t("activity_history_check_photos_take")
                    );
                    Notification.success(t("msg_request_edit_success"));
                }
            })
            .catch((error) => {
                Notification.error(error.message);
            });
    };
    const handleCancelEdit = () => {
        setIsOpenPopupEdit(false);
    };

    // button handle download, request edit
    const handleDownloadPhotos = () => {
        if (isCheck.length > 0) {
            setIsOpenPopupDownload(!isOpenPopupDownload);
        } else {
            Notification.warning("最低1枚をご選択ください");
        }
    };

    const handleRequestEditPhotos = () => {
        if (isCheck.length > 0) {
            setIsOpenPopupEdit(!isOpenPopupEdit);
        } else {
            Notification.warning("最低1枚をご選択ください");
        }
    };

    useEffect(() => {
        getRequestHistoryImages(
            isActiveTab,
            activePage,
            perPage,
            isAccountCheck,
            startDate,
            endDate
        );
    }, []);

    const [isActiveTab, setActiveTab] = useState("all");

    const handleTabChange = (activeTab) => {
        //console.log(`active tab is ${activeTab}`);
        setActiveTab(activeTab);
        getRequestHistoryImages(
            activeTab,
            activePage,
            perPage,
            isAccountCheck,
            startDate,
            endDate
        );
    };

    // option Role Admin
    const [user, setUser] = useState(null);
    useEffect(() => {
        userService.getAll().then((user) => {
            setUser(user.data);
        });
    }, []);

    const [isOpenPopupFilter, setIsOpenPopupFilter] = useState(false);
    const handleShowFilters = () => {
        setIsOpenPopupFilter(!isOpenPopupFilter);
    };

    // onchange RangeDate
    const startOfYear = moment().startOf('year');
    const endOfYear   = moment().endOf('year');

    const [startDate, setStartDate] = useState(startOfYear);
    const [endDate, setEndDate] = useState(endOfYear);
    const [isValidRangeDate, setIsValidRangeDate] = useState(false);

    const onChangeRangeDate = (field, value) => {
        const SHOW_TIME = true;
        const format = "YYYY/MM/DD HH:mm:ss";
        const getFormat = (time) => (time ? format : "YYYY/MM/DD");
        //console.log('onChange', field, value && value.format(getFormat(SHOW_TIME)));
        if (field == "startValue") {
            setStartDate(value);
        } else {
            setEndDate(value);
        }

        if (startDate !== null || endDate !== null) {
            setIsValidRangeDate(false);
        }
    };

    //---- popup filter in admin
    const [searchText, setSearchText] = useState("");
    const [codeUser, setCodeUser] = useState("");
    const [listUsers, setListUsers] = useState(null);

    const getAccountActionFilter = (search, code_user, page, per_page) => {
        AccountService.getAccountActionFilter(
            search,
            code_user,
            page,
            per_page
        ).then((response) => {
            setListUsers(response.data);
        });
    };

    useEffect(() => {
        // Get Account Action filter checkboxes
        if (user?.permission == "admin") {
            getAccountActionFilter(searchText, codeUser, 1, 6);
        }
    }, [user?.permission]);

    const handleSavePopupFilterPhoto = () => {
        console.log(`handleSavePopupFilterPhoto`);
        console.log(`isAccountCheck`, isAccountCheck);
        console.log(`startDate`, moment(startDate).format("YYYY-MM"));
        console.log(`endDate`, moment(endDate).format("YYYY-MM"));

        getRequestHistoryImages(
            isActiveTab,
            activePage,
            perPage,
            isAccountCheck,
            moment(startDate),
            moment(endDate)
        );
    };

    // handle checkbox in popup
    const [isAccountCheck, setIsAccountCheck] = useState([]);
    const handleAccountChecked = (e) => {
        const { id, checked } = e.target;

        setIsAccountCheck([...isAccountCheck, id]);
        if (!checked) {
            setIsAccountCheck(isAccountCheck.filter((item) => item !== id));
        }
    };

    //--- close popup role admin
    const [isOpenPopupImageEdit, setIsOpenPopupImageEdit] = useState(false);
    const handleClosePopupImageEdit = () => {
        setIsOpenPopupImageEdit(false);
    };

    const handleSubmitRequestImageEdit = () => {};
    const handleCancelImageEdit = () => {
        setIsOpenPopupImageEdit(false);
    };

    return (
        <RouteGuard>
            <div className="main-page main-page--photo">
                <Sidebar
                    isMenuActive="check_the_delivered_photos"
                    isActiveSideBar={isActiveSideBar}
                    onClick={handleClickSideBar}
                />
                <div
                    className={`sidebar__overlay${
                        isActiveSideBar ? " active" : ""
                    }`}
                ></div>
                <section
                    className={`wrapper ${isActiveSideBar ? "active" : ""}`}
                >
                    <Navbar
                        isActiveSideBar={isActiveSideBar}
                        onClick={handleClickSideBar}
                    />

                    <div className="photo__category-heading f jcb aic pb-4">
                        <h2 className="photo__category-title">
                        {user?.permission == "user" ?
                                t("page_title_user_delivered_photos")
                            :
                                t("page_title_admin_delivered_photos")
                        }
                        </h2>
                        <div className="photo__category-actions relative f jce aic">
                            {user?.permission == "user" ? (
                                <>
                                    <button
                                        className="btn btn-primary btn-gradient btn--small"
                                        type="button"
                                        onClick={(e) => handleDownloadPhotos(e)}
                                    >
                                        {t("btn_download_photo")}
                                    </button>
                                    <button
                                        className="btn btn-primary btn-gradient btn--small"
                                        type="button"
                                        onClick={(e) =>
                                            handleRequestEditPhotos(e)
                                        }
                                    >
                                        {t("btn_edit_photo")}
                                    </button>
                                    <button
                                        className="btn btn-default btn--small"
                                        type="button"
                                        onClick={(e) => checkedAllPhoto(e)}
                                    >
                                        {!isCheckAll
                                            ? t("btn_check_all")
                                            : t("btn_check_clear_all")}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        className="btn btn-default btn--icon btn--small"
                                        type="button"
                                        onClick={(e) => handleShowFilters()}
                                    >
                                        <IconSvg icon="filter" />
                                        {t("フィルター")}
                                    </button>
                                    <PopupFilterPhoto
                                        t={t}
                                        isOpen={isOpenPopupFilter}
                                        listUsers={listUsers}
                                        isValidRangeDate={isValidRangeDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        handleClosePopup={handleShowFilters}
                                        handleSavePopup={
                                            handleSavePopupFilterPhoto
                                        }
                                        onChangeRangeDate={onChangeRangeDate}
                                        handleChecked={handleAccountChecked}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <ul className="photo__action-filters">
                        <li
                            className={isActiveTab == "all" ? "active" : ""}
                            onClick={(e) => handleTabChange("all")}
                        >
                            すべて
                        </li>
                        <li
                            className={
                                isActiveTab == "before_upload" ? "active" : ""
                            }
                            onClick={(e) => handleTabChange("before_upload")}
                        >
                            依頼前
                        </li>
                        <li
                            className={isActiveTab == "pending" ? "active" : ""}
                            onClick={(e) => handleTabChange("pending")}
                        >
                            依頼中
                        </li>
                        <li
                            className={isActiveTab == "edited" ? "active" : ""}
                            onClick={(e) => handleTabChange("edited")}
                        >
                            納品済
                        </li>
                    </ul>

                    <div className="content content--white content--photo">
                        <div className="content__inner">
                            {filterPhotos ? (
                                <div className="photo__list">
                                    <PhotoItems
                                        t={t}
                                        lan={lan}
                                        items={filterPhotos}
                                        isCheck={isCheck}
                                        handleChecked={handleChecked}
                                        handleClickPopupImage={
                                            handleClickPopupImage
                                        }
                                    />
                                </div>
                            ) : null}

                            {totalItems > 0 ? (
                                <div className="pagination__wrapper f jcb aic">
                                    <div className="pagination__display">
                                        {`${totalItems}件中${
                                            activePage > 1
                                                ? activePage * 16 + 1 - 16
                                                : 1
                                        }-${
                                            activePage * 16 > totalItems
                                                ? totalItems
                                                : activePage * 16
                                        }を表示`}
                                    </div>
                                    <Pagination
                                        nextPageText={t("pagination_next_page")}
                                        prevPageText={t("pagination_prev_page")}
                                        firstPageText={t(
                                            "pagination_first_page"
                                        )}
                                        lastPageText={t("pagination_last_page")}
                                        itemClassFirst={`pagination__first`}
                                        itemClassLast={`pagination__last`}
                                        itemClass={`pagination__item`}
                                        itemClassNext={`pagination__next`}
                                        itemClassPrev={`pagination__prev`}
                                        activePage={activePage}
                                        itemsCountPerPage={perPage}
                                        totalItemsCount={totalItems}
                                        pageRangeDisplayed={rangePage}
                                        onChange={(e) => handlePageChange(e)}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>

                <PopupPhotos
                    t={t}
                    lan={lan}
                    isOpen={isOpenPopupPhoto}
                    image_id={popupItemPhoto?._id}
                    url={popupItemPhoto?.url}
                    handleClosePopup={handleClosePopup}
                    handleDownload={handleDownload}
                    handleRequestEdit={handleRequestEdit}
                />
                {user?.permission == "user" ? (
                    <>
                        <PopupDownload
                            isCategory={`delivered`}
                            t={t}
                            lan={lan}
                            isOpen={isOpenPopupDownload}
                            image_id={popupItemPhoto?.image_id}
                            url={popupItemPhoto?.url}
                            radioChange={radioChange}
                            handleClosePopup={handleClosePopupDownload}
                            handleSaveFiles={handleSaveFilesDownload}
                            handleDownloadFiles={handleDownloadFiles}
                        />
                        <PopupRequestEdit
                            t={t}
                            lan={lan}
                            data={{ note: null }}
                            isOpen={isOpenPopupEdit}
                            image_id={popupItemPhoto?._id}
                            url={popupItemPhoto?.url}
                            msg={msgRequestEdit}
                            handleClosePopup={handleClosePopupEdit}
                            handleRequestEdit={handleSubmitRequestEdit}
                            handleCancelEdit={handleCancelEdit}
                        />
                    </>
                ) : (
                    <PopupRequestImageEdit
                        t={t}
                        lan={lan}
                        data={{ note: null }}
                        isOpen={isOpenPopupImageEdit}
                        image_id={popupItemPhoto?._id}
                        url={popupItemPhoto?.url}
                        handleClosePopup={handleClosePopupImageEdit}
                        handleRequestEdit={handleSubmitRequestEdit}
                        handleCancelEdit={handleCancelImageEdit}
                    />
                )}
            </div>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter(DeliveredPhotos));
