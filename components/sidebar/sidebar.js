import React, {useEffect, useState} from "react";
import {useRouter, withRouter} from "next/router";
import {useDispatch} from "react-redux";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";
import IconSvg from "components/icon/";
import PopupLogout from "components/popup-logout/popup-logout";


// service
import { categoryService, userService } from '../../services'
import Link from "next/link";

const Menu = props => {
    const { isMenuActive, isChildActive, title, icon, child, url } = props;
    const [isOpen, setOpen] = useState(false);
    
    let svgClass = '';

    if (isMenuActive) {
        svgClass = 'isChildActive'
        if (isOpen) {
            svgClass = '';
        }
    } else {
        if (isOpen) {
            svgClass = 'isChildActive';
        }
    }

    const handleMenuClick = (e) => {
        e.preventDefault();
        setOpen(!isOpen);
    }

    return (
        <li className={`sidebar__category has-dropdown ${svgClass}`}>
            <div className="sidebar__category-menus" onClick={e => handleMenuClick(e)}><IconSvg icon={icon} />{title}</div>
            <div className="sidebar__dropdown-wrapper">
                <ul className={`sidebar__dropdown list-unstyled`}>
                    {child.map((item, index) => {
                        return (
                            <li className={isChildActive === item.id ? 'active' : ''} key={index} >
                                <a href={item.url} className="link">{item.title}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
            <div className="sidebar__icon">
                <IconSvg icon="min"/>
                <IconSvg icon="plus"/>
            </div>
        </li>
    );
}

const Sidebar = props => {
    const {t, isMenuActive, onClick, isActiveSideBar, isMenuChildActive} = props;
    const router = useRouter();
    const dispatch = useDispatch();

    const [childMenu, setChildMenu] = useState([]);


    const [user, setUser] = useState(null);
    const [userPermission, setUserPermission] = useState('user');

    useEffect(() => {
        let isMounted = true;
        categoryService.getMenuCategories().then(menus => {
            if (isMounted) setChildMenu(menus);
        });

        userService.getAll().then(response => {
            if (isMounted) {
                const userData = response.data;
                setUser(userData);
                setUserPermission(userData?.permission);
            }
        });
        
        return () => { isMounted = false };
    }, []);
    
    const menusDataUser = [
        {
            title: t('dashboard'),
            tag: 'dashboard',
            url: '/',
            icon: 'dashboard'
        },
        {
            title: t('check_the_photos_taken'),
            tag: 'check_the_photos_taken',
            url: '/photo',
            icon: 'camera',
            child: childMenu
        },
        {
            title: t('read_guide'),
            tag: 'read_guide',
            url: '/read-guide',
            icon: 'book'
        },
        {
            title: t('reservation_site_cooperation'),
            tag: 'reservation_site_cooperation',
            url: '/reservation-site-cooperation',
            icon: 'photo'
        },
        {
            title: t('upload_google_image'),
            tag: 'upload_google_image',
            url: '/upload_google_image',
            icon: 'photo'
        },
        {
            title: t('user_setting'),
            tag: 'user_setting',
            url: '/user-setting',
            icon: 'setting'
        },
        {
            title: t('terms_of_service'),
            tag: 'terms_of_service',
            url: '/terms-of-service',
            icon: 'dieukhoan',
        },
        {
            title: t('privacy_policy'),
            tag: 'privacy_policy',
            url: '/privacy-policy',
            icon: 'chinhsach',
        },
        {
            title: t('study_session_request'),
            tag: 'study_session_request',
            url: '/study',
            icon: 'union',
        },
        {
            title: t('inquiry'),
            tag: 'inquiry',
            url: '/help',
            icon: 'help',
        }
    ];
    const menusDataAdmin = [
        {
            title: t('admin_dashboard'),
            tag: 'dashboard',
            url: '/',
            icon: 'admin-dashboard'
        },
        {
            title: t('all_photos'),
            tag: 'check_the_photos_taken',
            url: '/photo',
            icon: 'camera',
            child: childMenu
        },
        {
            prefix: "sidebar__category--no-fill",
            title: t('check_the_delivered_photos_admin'),
            tag: 'check_the_delivered_photos',
            url: '/delivered-photos',
            icon: 'photo'
        },
        {
            title: t('admin_user_setting'),
            tag: 'user_setting',
            url: '/user-setting',
            icon: 'user',
            child: [
                {
                    id: 'notice',
                    title: t('notice'),
                    tag: 'notice',
                    url: '/settings/notice'
                },
                {
                    id: 'usage-status',
                    title: t('usage_status'),
                    tag: 'usage-status',
                    url: '/settings/usage-status'
                },
                {
                    id: 'manual',
                    title: t('manual'),
                    tag: 'manual',
                    url: '/settings/manual'
                },
                {
                    id: 'account-information',
                    title: t('account_information'),
                    tag: 'account-information',
                    url: '/settings/account-information'
                },
                {
                    id: 'tutorial-video',
                    title: t('tutorial_video'),
                    tag: 'tutorial-video',
                    url: '/settings/tutorial-video'
                },
                {
                    id: 'new-registration',
                    title: t('new_registration'),
                    tag: 'new-registration',
                    url: '/settings/new-registration'
                },
                {
                    id: 'push-notification',
                    title: t('push_notification'),
                    tag: 'push-notification',
                    url: '/settings/push-notification'
                },
                {
                    id: 'billing',
                    title: t('billing'),
                    tag: 'billing',
                    url: '/settings/billing'
                }
            ]
        },
        {
            title: t('setting'),
            tag: 'settings',
            url: '/settings',
            icon: 'setting',
        },
        {
            title: t('terms_of_service'),
            tag: 'terms_of_service',
            url: '/terms-of-service',
            icon: 'dieukhoan',
        },
        {
            title: t('privacy_policy'),
            tag: 'privacy_policy',
            url: '/privacy-policy',
            icon: 'chinhsach',
        },
    ];

    let menusData = menusDataUser;;
    if (userPermission == 'admin') {
        menusData = menusDataAdmin;
    }

    const [isPopupLogoutOpen, setIsPopupLogoutOpen] = useState(false);
    const handleClosePopup = () => setIsPopupLogoutOpen(false);
    const handleCancel = () => setIsPopupLogoutOpen(false);
    const handleClickLogout = () => setIsPopupLogoutOpen(true);
    const handleYes = () => {
        userService.logout();
    };

    return (
        <>
            <PopupLogout
                t={t}
                isOpen={isPopupLogoutOpen} 
                handleClosePopup={handleClosePopup}
                handleCancel={handleCancel}
                handleYes={handleYes}
            />
            <aside className={`sidebar position-fixed top-0 left-0 overflow-auto h-100 float-left ${isActiveSideBar ? "active" : ""}`}>
                <div className="sidebar__header f jcs aic">
                    <div className="sidebar__menu" onClick={onClick}>
                        <IconSvg icon="menu"/>
                    </div>
                    <Link href="/">
                        <div className="block">
                            <div className="sidebar__logo image--contain ratio">
                                <img className="image__img" src={`${process.env.BASE_PATH}/assets/images/logo-dashboard.png`} alt="logo" />
                            </div>
                        </div>
                    </Link>
                </div>
    
                <ul className="sidebar__categories list-unstyled">
                    {menusData.map((menu, index) => {
                        const { prefix, child, tag, icon, title, url} = menu;
                        const isCurrentMenuActive = (tag === isMenuActive) ? ' active' : '';
                        return (
                            child ?
                                <Menu key={index}
                                      url={url}
                                      isMenuActive={isCurrentMenuActive}
                                      isChildActive={isMenuChildActive}
                                      title={title}
                                      icon={icon}
                                      child={child} />
                                :
                                <li key={index} className={`sidebar__category ${prefix}${isCurrentMenuActive} `}>
                                    <Link href={url}>
                                        <div className="sidebar__category-menus"><IconSvg icon={icon} />{title}</div>
                                    </Link>
                                </li>
                        )
                    })}
                    <li className="sidebar__sign-out f jcc aic mt2">
                        <button type="button" className="btn btn-default" onClick={handleClickLogout}><IconSvg icon="logout"/>{t('logout')}</button>
                    </li>
                </ul>
            </aside>
        </>
    )}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter(Sidebar));
