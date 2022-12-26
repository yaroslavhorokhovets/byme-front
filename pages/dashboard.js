import React from "react";
import { useState, useEffect } from 'react';
import { withRouter } from "next/router";
import { connect } from "react-redux";
import { userService } from 'services';

// language
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { withTranslation, i18n } from "next-i18next";
import {RouteGuard} from "../components/RouteGuard";

const Dashboard = props => {
    const { t, i18n, isLogin } = props;
    const lan = i18n.language;

    const [user, setUser] = useState(null);

    useEffect(() => {
        userService.getAll().then(user => {
            // console.log(user);  
            setUser(user.data);
        });
    }, []);

    return (
        <RouteGuard>
            <div className="main-page main-page--index">
                <div className="main-page__container container-x">
                    <div className="main-page__layout--full">
                        <div className="card mt-4">
                            <h4 className="card-header">You're logged in with Next.js 11 & JWT!!</h4>
                            <div className="card-body">
                                <h6>Users from secure api end point</h6>
                                {user &&
                                <ul>
                                    <li>{user.username} </li>
                                    <li>{user.email} </li>
                                    <li>permission {user.permission} </li>
                                    <li>phone_number {user.phone_number} </li>
                                    <li>postal_code {user.postal_code} </li>
                                    <li>representative_name {user.representative_name} </li>
                                    <li>type_base {user.type_base} </li>
                                </ul>
                                }
                                {!user && <div className="spinner-border spinner-border-sm"></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RouteGuard>
    );
};

export const getStaticProps = async ({ locale }) => ({
    props: {
        ...(await serverSideTranslations(locale, ["common"])),
    },
});

export default withTranslation()(withRouter((Dashboard)));
