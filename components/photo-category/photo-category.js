import React, { useState, useEffect } from "react";

import {
    ImageService,
    downloadService,
    ActivityService,
    userService,
    AccountService,
    businessService
} from "services";
import Pagination from "react-js-pagination";
import PhotoCategoryItems from "components/photo-category-items/photo-category-items";
import PopupRequestEdit from "components/popup-request-edit/popup-request-edit";
import PopupDownload from "components/popup-download/popup-download";
import PopupPhotos from "components/popup-photos/popup-photos";
import * as Notification from "../../modules/Notification";
import PopupFilterPhoto from "components/popup-filter-photo/popup-filter-photo";
import IconSvg from "components/icon/";
import moment from "moment";
import PopupRequestImageEdit from "components/popup-request-image-edit/popup-request-image-edit";

const PhotoCategory = (props) => {
    const { t, lan, rootCategoryId, category } = props;
    const { id, name, child_categories } = category;

    const [typeCategory, setTypeCategory] = useState("all");

    const [accessToken, setAccessToken] = useState("");
    const [refreshToken, setRefreshToken] = useState("");

    // useEffect data
    useEffect(() => {
        if (rootCategoryId) {
            getImages(
                rootCategoryId,
                isActiveTab,
                typeCategory,
                accountIds,
                startDate,
                endDate,
                activePage,
                perPage
            );
        }

        businessService.getBusinessProfile().then((response) => {
            if(response.data !== null && response.data.status){
                setAccessToken(response.data.access_token)
                setRefreshToken(response.data.refresh_token)
            }           
        }); 

    }, []);

    // filter tab
    const [isActiveTab, setIsActiveTab] = useState(id);
    const handleClickTab = (activeTab) => {
        const child_id = activeTab == id ? id : activeTab;
        const typeCategory = activeTab == id ? "all" : null;

        setIsActiveTab(activeTab);
        getImages(
            rootCategoryId,
            child_id,
            typeCategory,
            accountIds,
            startDate,
            endDate,
            activePage,
            perPage
        );
    };

    // process handle check all checkboxes
    const [isCheckAll, setIsCheckAll] = useState(false);
    const [isCheck, setIsCheck] = useState([]);

    const handleChecked = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== id));
        }
    };

    const checkedAllPhoto = () => {
        setIsCheckAll(!isCheckAll);
        setIsCheck(filterPhotos.map((photo) => photo._id));
        if (isCheckAll) {
            setIsCheck([]);
        }
    };

    // load data filterphoto
    const [filterPhotos, setFilterPhotos] = useState();
    const getImages = (
        rootCategoryId,
        isActiveTab,
        typeCategory,
        accountIds,
        startDate,
        endDate,
        page,
        per_page
    ) => {
        ImageService.getFilterImagesByChildCategory(
            rootCategoryId,
            isActiveTab,
            typeCategory,
            accountIds,
            startDate,
            endDate,
            page,
            per_page
        ).then((response) => {
            setFilterPhotos(response.data);
            setTotalItems(response.page.total_count);
            setTotalPage(response.page.total_page);
            setActivePage(response.page.page);
            setPerPage(response.page.per_page);
        });
    };

    // pagination
    const [activePage, setActivePage] = useState(1);
    const [perPage, setPerPage] = useState(16);
    const [totalItems, setTotalItems] = useState(8);
    const [totalPage, setTotalPage] = useState(1);
    const [rangePage, setRangePage] = useState(3);

    const [accountIds, setAccountIds] = useState([]);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();

    const handlePageChange = (pageNumber) => {
        // console.log(`active page is ${pageNumber}`);
        setActivePage(pageNumber);
        getImages(
            rootCategoryId,
            isActiveTab,
            typeCategory,
            accountIds,
            startDate,
            endDate,
            pageNumber,
            perPage
        );
    };

    // process handle click popup
    const [isOpenPopupPhoto, setIsOpenPopupPhoto] = useState(false);
    const [popupItemPhoto, setPopupItemPhoto] = useState({
        _id: 0,
        image_id: 0,
        title: `photo`,
        url: `${process.env.BASE_PATH}/assets/images/card_1.jpg`,
    });
    const handleClickPopupImage = (photoItem) => {
        setPopupItemPhoto(photoItem);

        if (user?.permission == "user") {
            setIsOpenPopupPhoto(!isOpenPopupPhoto);
        } else {
            setIsOpenPopupImageEdit(!isOpenPopupImageEdit);
        }

        const id = photoItem._id;
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

    const [isGoogleUploaded, setIsGoogleUploaded] = useState(false);
    const handleUploadGoogle = (photo_url, image_id) => {
        
        let newAccessToken = "";
        if(refreshToken !== ""){
            businessService.retrieveAccessTokenFromRefreshToken(refreshToken).then(result => {
                console.log(result.access_token);
                newAccessToken = result.access_token;
                businessService.uploadGoogleBusinessImageWithToken(newAccessToken, photo_url, (result) => {
                    if(result.code === 503){
                        Notification.success(t("msg_google_image_failed"));
                        return;
                    }
                    businessService.updateFileGoogleStatus(image_id).then((res)=>{
                        if(res.code === 200){
                            Notification.success(t("msg_google_upload_success"));
                            getImages(
                                rootCategoryId,
                                isActiveTab,
                                typeCategory,
                                accountIds,
                                startDate,
                                endDate,
                                activePage,
                                perPage
                            );
                        }
                    });
                });              
            });
        }else{
            businessService.uploadGoogleBusinessImage(photo_url, (result) => {
                if(result.code === 503){
                    Notification.success(t("msg_google_image_failed"));
                    return;
                }
                businessService.updateFileGoogleStatus(image_id).then((res)=>{
                    if(res.code === 200){
                        Notification.success(t("msg_google_upload_success"));
                        getImages(
                            rootCategoryId,
                            isActiveTab,
                            typeCategory,
                            accountIds,
                            startDate,
                            endDate,
                            activePage,
                            perPage
                        );
                    }
                });
            }); 
        }
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
        // console.log('Current Radio Checked :: ', currentValue);
    };
    const handleDownloadFiles = () => {
        const image_ids = isCheck; // get list image ids
        downloadService
            .downloadImage(valueRatioOption, image_ids)
            .then((response) => {
                ActivityService.addActivityHistory(
                    "Web",
                    t("activity_history_check_photos_take")
                );
                Notification.success(t("msg_request_edit_success"));

                // console.log('Zip File URL :: ', response.data);
                window.open(response.data);
            })
            .catch((error) => {
                Notification.error(error.message);
            });
        setIsOpenPopupDownload(false);
    };

    // popup request edit
    const [isOpenPopupEdit, setIsOpenPopupEdit] = useState(false);
    const handleClosePopupEdit = () => {
        setIsOpenPopupEdit(false);
    };
    const [msgRequestEdit, setMsgRequestEdit] = useState("");
    const handleSubmitRequestEdit = ({ note }) => {
        // console.log('handleSubmitRequestEdit ::: ', note);
        const image_ids = isCheck; // get list image ids
        setMsgRequestEdit("");
        downloadService
            .photoRequestEdit(image_ids, note)
            .then((response) => {
                if (response.code == 200) {
                    getImages(
                        rootCategoryId,
                        isActiveTab,
                        typeCategory,
                        accountIds,
                        startDate,
                        endDate,
                        activePage,
                        perPage
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

    //--- option Role Admin
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
    const today = moment();
    const start_time = moment(today).subtract(12, "month");
    const end_time = today;

    const [startDate, setStartDate] = useState(start_time);
    const [endDate, setEndDate] = useState(end_time);
    const [isValidRangeDate, setIsValidRangeDate] = useState(false);

    const onChangeRangeDate = (field, value) => {
        const SHOW_TIME = true;
        const format = "DD/MM/YYYY HH:mm:ss";
        const getFormat = (time) => (time ? format : "DD/MM/YYYY");
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
            console.log(`Admin pupup filter photo:: `, response.data);
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
        console.log(`accountIds`, accountIds);
        console.log(`startDate`, moment(startDate).format("YYYY/MM/DD"));
        console.log(`endDate`, moment(endDate).format("YYYY/MM/DD"));

        const start = moment(startDate);
        const end = moment(endDate);

        getImages(
            rootCategoryId,
            isActiveTab,
            typeCategory,
            accountIds,
            start,
            end,
            activePage,
            perPage
        );
    };

    // handle checkbox in popup
    // const [isAccountCheck, setIsAccountCheck] = useState([]);
    // const [accountIds, setAccountIds] = useState([]);
    const handleAccountChecked = (e) => {
        const { id, checked } = e.target;

        setAccountIds([...accountIds, id]);
        if (!checked) {
            setAccountIds(accountIds.filter((item) => item !== id));
        }
    };

    //--- close popup role admin
    const [isOpenPopupImageEdit, setIsOpenPopupImageEdit] = useState(false);
    const handleClosePopupImageEdit = () => {
        setIsOpenPopupImageEdit(false);
    };

    const handleCancelImageEdit = () => {
        setIsOpenPopupImageEdit(false);
    };

    return (
        <div key={id} className="photo__category">
            <div className="photo__category-heading f jcb aic pb-4">
                <h2 data-child-id={id} className="photo__category-title">
                    {name}
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
                                onClick={(e) => handleRequestEditPhotos(e)}
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
                                handleSavePopup={handleSavePopupFilterPhoto}
                                onChangeRangeDate={onChangeRangeDate}
                                handleChecked={handleAccountChecked}
                            />
                        </>
                    )}
                </div>
            </div>

            <ul className="photo__action-filters">
                <li
                    data-id="all"
                    className={isActiveTab == id ? `active` : ""}
                    onClick={(e) => handleClickTab(id)}
                >
                    すべて
                </li>
                {child_categories.map((child, index) => (
                    <li
                        key={child.id}
                        data-id={child.id}
                        className={isActiveTab == child.id ? `active` : ""}
                        onClick={(e) => handleClickTab(child.id)}
                    >
                        {child.name}
                    </li>
                ))}
            </ul>

            <div className="photo__category-content">
                <div className="photo__category-content-inner">
                    {filterPhotos ? (
                        <div className="photo__list">
                            <PhotoCategoryItems
                                t={t}
                                lan={lan}
                                items={filterPhotos}
                                isCheck={isCheck}
                                handleChecked={handleChecked}
                                handleClickPopupImage={handleClickPopupImage}
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
                                firstPageText={t("pagination_first_page")}
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

            {user?.permission == "user" ? (
                <>
                    <PopupPhotos
                        t={t}
                        lan={lan}
                        isOpen={isOpenPopupPhoto}
                        image_id={popupItemPhoto?._id}
                        url={popupItemPhoto?.origin_url}
                        handleClosePopup={handleClosePopup}
                        handleDownload={handleDownload}
                        handleRequestEdit={handleRequestEdit}
                        handleUploadGoogle={handleUploadGoogle}
                    />

                    <PopupDownload
                        isCategory={`category`}
                        t={t}
                        lan={lan}
                        isOpen={isOpenPopupDownload}
                        image_id={`${popupItemPhoto?._id}`}
                        url={popupItemPhoto?.origin_url}
                        radioChange={radioChange}
                        handleClosePopup={handleClosePopupDownload}
                        handleSaveFiles={handleSaveFilesDownload}
                        handleDownloadFiles={handleDownloadFiles}
                    />

                    <PopupRequestEdit
                        t={t}
                        lan={lan}
                        data={popupItemPhoto}
                        isOpen={isOpenPopupEdit}
                        image_id={popupItemPhoto?._id}
                        url={popupItemPhoto?.origin_url}
                        msg={msgRequestEdit}
                        handleClosePopup={handleClosePopupEdit}
                        handleRequestEdit={handleSubmitRequestEdit}
                        handleCancelEdit={handleCancelEdit}
                    />
                </>
            ) : (
                <>
                    <PopupRequestImageEdit
                        t={t}
                        lan={lan}
                        data={popupItemPhoto}
                        isOpen={isOpenPopupImageEdit}
                        image_id={popupItemPhoto?._id}
                        url={popupItemPhoto?.origin_url}
                        handleClosePopup={handleClosePopupImageEdit}
                        handleRequestEdit={handleSubmitRequestEdit}
                        handleCancelEdit={handleCancelImageEdit}
                    />
                </>
            )}
        </div>
    );
};

export default PhotoCategory;
