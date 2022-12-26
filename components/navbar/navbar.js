import React, {useEffect, useState} from "react";
import Link from 'next/link';
import {useRouter, withRouter} from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {withTranslation} from "next-i18next";
import IconSvg from "components/icon/";

// service
import { userService } from 'services';

const Navbar = props => {
    const {t, isActiveSideBar, onClick} = props;
    const router = useRouter();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    const getItemsCount = () => {
        return cart.reduce((accumulator, item) => accumulator + item.quantity, 0);
    };
    
    const [hasDropdownMenu, setDropdownMenu] = useState(false);
    
    const dropdownUserMenu = () => {
        setDropdownMenu(!hasDropdownMenu);
    }

    const [user, setUser] = useState(null);

    const logout = () => {
        userService.logout();
    }
    
    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    // only show nav when logged in
    if (!user) return null;
    
    return (
        <nav className="navbar">
            <div className="navbar__container">
                <div className="narbar__inner f jcb aic">
                    <div className={`navbar__logo f jcs aic ${isActiveSideBar ? "active" : ""}`}>
                        <div className="navbar__menu" onClick={onClick}>
                            <IconSvg icon="menu"/>
                        </div>
                        <a href={`/`} className="block">
                            <div className="navbar__logo-img image--contain ratio">
                                <img className="image__img" src={`${process.env.BASE_PATH}/assets/images/logo-dashboard.png`} alt="logo" />
                            </div>
                        </a>
                    </div>

                    <div className="navbar__header f jcs aic">
                        <div className="d-none navbar__header-user f jcc aic relative">
                            <a className="navbar__header-logo image--contain ratio" href={`/settings`} onClick={dropdownUserMenu}>
                                <img className="image__img" src={`${process.env.BASE_PATH}/assets/images/guest.png`} alt="avatar"/>
                            </a>

                            <div className={`dropdown-menu ${hasDropdownMenu ? 'show' : ''}`}>
                                <a href="/user-profile" className="dropdown-item"><IconSvg icon="user"/> {t('profile')}</a>
                                {/*<a href="" className="dropdown-item"><IconSvg icon="book"/> Calendar</a>*/}
                                <a href="/settings" className="dropdown-item"><IconSvg icon="setting"/> {t('setting')}</a>
                                <div className="divider dropdown-divider"></div>
                                <a href="#" className="dropdown-item" onClick={logout}><IconSvg icon="logout"/> {t('logout')}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export const getStaticProps = async ({locale}) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter(Navbar));
