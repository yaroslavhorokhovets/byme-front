import React from "react";
import { connect } from "react-redux";
import { withRouter } from "next/router";

class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header id="header">
                <nav className="header-desktop f jcs aic">
                    <div className="header-desktop__container">
                        <div className="header-desktop__inner f jcb ais">
                            <div className="header-desktop__content f jcs aic">
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;
