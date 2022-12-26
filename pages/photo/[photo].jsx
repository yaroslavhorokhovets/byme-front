import React, { Fragment, useState, useEffect } from "react";
import { withRouter, useRouter } from "next/router";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";

import { RouteGuard } from "../../components/RouteGuard";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import IconSvg from "../../components/icon/";
import PhotoCategory from "../../components/photo-category/photo-category";

// services
import { categoryService } from "../../services";

const Photo = (props) => {
    const { currentID, t, i18n } = props;
    const lan = i18n.language;
    const router = useRouter();
    const [currentCategory, setCurrentCategory] = useState(null);

    // process logic sidebar
    const [isActiveSideBar, setActiveSideBar] = useState(false);
    const handleClickSideBar = () => {
        setActiveSideBar(!isActiveSideBar);
    };

    const [childCategory, setChildCategory] = useState([]);
    useEffect(() => {
        // get name and breadcrumb
        categoryService.getCurrentCategory(currentID).then((category) => {
            setCurrentCategory(category);
        });

        // get sub child category
        categoryService.getSubChildCategory(currentID).then((category) => {
            setChildCategory(category);
        });
        
    }, []);

    return (
        <RouteGuard>
            <div className="main-page main-page--photo">
                <Sidebar
                    isMenuActive="check_the_photos_taken"
                    isActiveSideBar={isActiveSideBar}
                    isMenuChildActive={router.query.photo}
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

                    <ol className="breadcrumb breadcrumb--photo">
                        <li className="breadcrumb-item">
                            <span>すべての写真</span>
                            <IconSvg icon="chevron_right" />
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page"
                        >
                            <a href={`${currentCategory?.url}`}>
                                {currentCategory?.title}
                            </a>
                        </li>
                    </ol>
                    
                    {childCategory.map((item, index) => (
                        <PhotoCategory
                            key={index}
                            t={t}
                            lan={lan}
                            rootCategoryId={currentCategory?.id}
                            category={item}
                        />
                    ))}
                </section>
            </div>
        </RouteGuard>
    );
};

export default withTranslation()(withRouter(Photo));

export const getServerSideProps = async ({ locale, query }) => {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            currentID: query.photo,
        },
    };
};
