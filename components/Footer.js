import React from "react";
import { i18n } from "next-i18next";

function Footer(props) {
    const { t } = props;

    return (
        <footer className="footer">
            <div className="container-x">
                <div className="footer--v2__license text-center">
                    © {new Date().getFullYear()} Byme, LLC. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;
