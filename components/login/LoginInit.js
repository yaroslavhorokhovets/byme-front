import React from "react";
import axios from "axios";
import { i18n } from "next-i18next";
import { withRouter } from "next/router";
import Link from "next/link";
import $ from "jquery";
import { LoginButton } from "react-facebook";
import * as Configs from "../../modules/Configs";
import { parseQuery } from "../../modules/Utils";

class LoginInit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            queryString: null
        };
    }

    componentDidMount() {
        this.setState({
            queryString: parseQuery()
        });

        $(".toggle-password").click(function () {
            $(this).toggleClass("fa-eye fa-eye-slash");
            let input = $($(this).attr("toggle"));
            if (input.attr("type") === "password") {
                input.attr("type", "text");
            } else {
                input.attr("type", "password");
            }
        });
    }

    handleLogin = e => {
        e.preventDefault();

        const email = this.email.value.trim();
        const password = this.password.value.trim();

        this.props.submit(email, password);
    };

    routing(url) {
        const callbackUrl = this.props.queryString["callback_url"];
        if (callbackUrl) {
            url += "?callback_url=" + callbackUrl;
        }
        this.props.router.push(url);
    }

    handleFacebookResponse = data => {
        // console.log(data);
        this.props.handleLoginFacebook(data.tokenDetail.accessToken);
    };

    handleFacebookError = error => {
        // console.log(error);
    };

    handleLoginLine() {
        const lineLoginUrl =
            "https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=" +
            Configs.LINE_APP_CLIENT_ID +
            "&redirect_uri=" +
            Configs.LINE_LOGIN_CALLBACK_URL(i18n.language) +
            "&state=" +
            Configs.LINE_LOGIN_STATE;
        window.location.href = lineLoginUrl;
    }

    handleLoginTwitter = () => {
        axios
            .post(Configs.TWITTER_REQUEST_TOKEN_API_URL, {
                callback_url: Configs.TWITTER_LOGIN_CALLBACK_URL(i18n.language)
            })
            .then(response => {
                const loginUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${response.data.oauth_token}`;
                window.location.href = loginUrl;
            });
    };

    render() {
        const { t } = this.props;
        return (
            <>
                <div className="login__form">
                    <form className="login__form-inner" onSubmit={this.handleLogin}>
                        <div className="login__tab relative f jcc aic">
                            <div
                                className="login__tab-item h2 align-c active"
                                onClick={() => this.routing("/login")}
                            >
                                {t("login")}
                            </div>
                            <div
                                className="login__tab-item h2 align-c"
                                onClick={() => this.routing("/signup")}
                            >
                                {t("signUp")}
                            </div>
                            <div className="login__tab-item--slider"></div>
                        </div>
                        <div className="form-group">
                            <input
                                placeholder={t("email")}
                                type="email"
                                className="form-control input-text"
                                ref={email => (this.email = email)}
                            />
                        </div>
                        <div className="form-group input-pass">
                            <input
                                placeholder={t("password")}
                                type="password"
                                className="form-control input-text"
                                id="password-field"
                                ref={password => (this.password = password)}
                            />
                            <div toggle="#password-field" className="toggle-password">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" fill="#757575"/><path d="M19.3375 9.7875C18.6024 7.88603 17.3263 6.24164 15.6668 5.05755C14.0073 3.87347 12.0372 3.20161 10 3.125C7.96286 3.20161 5.99278 3.87347 4.33329 5.05755C2.6738 6.24164 1.39764 7.88603 0.662539 9.7875C0.612894 9.92482 0.612894 10.0752 0.662539 10.2125C1.39764 12.114 2.6738 13.7584 4.33329 14.9424C5.99278 16.1265 7.96286 16.7984 10 16.875C12.0372 16.7984 14.0073 16.1265 15.6668 14.9424C17.3263 13.7584 18.6024 12.114 19.3375 10.2125C19.3872 10.0752 19.3872 9.92482 19.3375 9.7875V9.7875ZM10 14.0625C9.19655 14.0625 8.41111 13.8242 7.74304 13.3778C7.07496 12.9315 6.55426 12.297 6.24678 11.5547C5.9393 10.8123 5.85885 9.99549 6.0156 9.20745C6.17235 8.4194 6.55927 7.69553 7.12742 7.12738C7.69557 6.55923 8.41944 6.17231 9.20748 6.01556C9.99553 5.85881 10.8124 5.93926 11.5547 6.24674C12.297 6.55422 12.9315 7.07492 13.3779 7.743C13.8243 8.41107 14.0625 9.19651 14.0625 10C14.0609 11.0769 13.6323 12.1093 12.8708 12.8708C12.1093 13.6323 11.077 14.0608 10 14.0625V14.0625Z" fill="#757575"/></svg>
                            </div>
                        </div>
                        <Link href="/forgot-password">
                            <a className="forgot-pass p-x-small">{t("forgotPassword")}</a>
                        </Link>
                        <div className="login__action mb-5">
                            <button type="submit" className="button--submit button--radius mw-100">
                                <div className="btn__wrapper">
                                    <div className="btn__el">{t("login")}</div>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
                <div className="login__socials">
                    <div className="middle-or-line">
                        <p className="middle-or-text p-small align-c">{t("or")}</p>
                    </div>
                    <ul className="login__social">
                        <li>
                            <LoginButton
                                scope="email"
                                onCompleted={this.handleFacebookResponse}
                                onError={this.handleFacebookError}
                                className="login-social-btn"
                            >
                                <a>
                                    <svg
                                        width="28"
                                        height="28"
                                        viewBox="0 0 28 28"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M28 14.0852C28 6.30426 21.7339 0 14 0C6.26613 0 0 6.30426 0 14.0852C0 21.1153 5.1196 26.9425 11.8125 28V18.1568H8.25605V14.0852H11.8125V10.9819C11.8125 7.45209 13.9012 5.50231 17.1003 5.50231C18.6324 5.50231 20.2345 5.7772 20.2345 5.7772V9.2417H18.4687C16.73 9.2417 16.1875 10.3276 16.1875 11.4414V14.0852H20.0702L19.4493 18.1568H16.1875V28C22.8804 26.9425 28 21.1153 28 14.0852Z"
                                            fill="#395185"
                                        />
                                    </svg>
                                </a>
                            </LoginButton>
                        </li>
                        <li>
                            <a onClick={this.handleLoginTwitter}>
                                <svg
                                    width="28"
                                    height="24"
                                    viewBox="0 0 28 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M28 2.82164C26.9697 3.28476 25.8626 3.59775 24.7006 3.73856C25.8868 3.01788 26.7975 1.87667 27.2264 0.516927C26.0988 1.19523 24.8651 1.67314 23.5786 1.93C22.5307 0.798322 21.0378 0.0910645 19.3855 0.0910645C16.213 0.0910645 13.6408 2.69835 13.6408 5.9141C13.6408 6.37057 13.6917 6.81495 13.7896 7.24125C9.01534 6.99833 4.78253 4.68009 1.94917 1.157C1.4548 2.01704 1.17152 3.01744 1.17152 4.08448C1.17152 6.1048 2.18575 7.88709 3.72706 8.9314C2.81482 8.90244 1.92265 8.65267 1.12503 8.20296C1.1247 8.22735 1.1247 8.25175 1.1247 8.27625C1.1247 11.0976 3.10483 13.4512 5.73267 13.9862C4.88675 14.2194 3.99944 14.2535 3.13852 14.086C3.86947 16.3995 5.99102 18.0829 8.50467 18.1301C6.53866 19.6918 4.06164 20.6228 1.37036 20.6228C0.906609 20.6228 0.449422 20.5952 0 20.5414C2.5422 22.1937 5.56172 23.1577 8.80578 23.1577C19.3722 23.1577 25.1501 14.2844 25.1501 6.58943C25.1501 6.33686 25.1447 6.08574 25.1335 5.83605C26.2581 5.01191 27.2288 3.99114 28 2.82164Z"
                                        fill="#55ACEE"
                                    />
                                </svg>
                            </a>
                        </li>
                        <li>
                            <a onClick={() => this.handleLoginLine()}>
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M22.5899 11.5072C22.6887 11.5038 22.7872 11.5203 22.8795 11.5557C22.9718 11.5912 23.056 11.6449 23.1272 11.7136C23.1983 11.7823 23.2548 11.8646 23.2935 11.9557C23.3321 12.0467 23.352 12.1446 23.352 12.2435C23.352 12.3424 23.3321 12.4402 23.2935 12.5313C23.2548 12.6223 23.1983 12.7046 23.1272 12.7733C23.056 12.842 22.9718 12.8957 22.8795 12.9312C22.7872 12.9667 22.6887 12.9832 22.5899 12.9798H20.5433V14.2923H22.5899C22.6893 14.2874 22.7887 14.3028 22.882 14.3375C22.9753 14.3722 23.0605 14.4255 23.1326 14.4942C23.2047 14.5628 23.2621 14.6454 23.3013 14.7369C23.3405 14.8284 23.3607 14.9269 23.3607 15.0264C23.3607 15.126 23.3405 15.2245 23.3013 15.316C23.2621 15.4074 23.2047 15.49 23.1326 15.5587C23.0605 15.6273 22.9753 15.6806 22.882 15.7153C22.7887 15.75 22.6893 15.7654 22.5899 15.7605H19.81C19.6157 15.7598 19.4295 15.6822 19.2923 15.5446C19.155 15.4071 19.0779 15.2207 19.0776 15.0264V9.46141C19.0776 9.05629 19.4058 8.72379 19.81 8.72379H22.5951C22.7841 8.73355 22.962 8.81563 23.0921 8.95301C23.2222 9.09039 23.2944 9.27255 23.2939 9.46175C23.2933 9.65094 23.22 9.83267 23.0891 9.96928C22.9582 10.1059 22.7797 10.1869 22.5908 10.1955H20.5441V11.508L22.5899 11.5072ZM18.0976 15.0255C18.096 15.2204 18.0175 15.4068 17.8792 15.5441C17.7409 15.6814 17.554 15.7586 17.3591 15.7588C17.2437 15.7599 17.1297 15.7342 17.0259 15.6836C16.9222 15.633 16.8317 15.559 16.7615 15.4674L13.9134 11.5938V15.0247C13.9134 15.2194 13.836 15.4061 13.6984 15.5438C13.5607 15.6814 13.374 15.7588 13.1793 15.7588C12.9845 15.7588 12.7978 15.6814 12.6601 15.5438C12.5225 15.4061 12.4451 15.2194 12.4451 15.0247V9.45966C12.4451 9.14554 12.6507 8.86379 12.9465 8.76316C13.0195 8.73736 13.0965 8.72463 13.174 8.72554C13.4015 8.72554 13.6115 8.84891 13.7524 9.02216L16.6232 12.9045V9.45966C16.6232 9.05454 16.9514 8.72204 17.3574 8.72204C17.7634 8.72204 18.0959 9.05454 18.0959 9.45966L18.0976 15.0255ZM11.3986 15.0255C11.3977 15.2207 11.3195 15.4076 11.181 15.5452C11.0426 15.6828 10.8553 15.7599 10.6601 15.7597C10.4664 15.758 10.2812 15.68 10.1447 15.5425C10.0082 15.4051 9.93147 15.2193 9.93125 15.0255V9.46054C9.93125 9.05541 10.2594 8.72291 10.6654 8.72291C11.0705 8.72291 11.3995 9.05541 11.3995 9.46054L11.3986 15.0255ZM8.5225 15.7597H5.73738C5.54241 15.7592 5.35549 15.6819 5.21722 15.5444C5.07895 15.407 5.00049 15.2205 4.99887 15.0255V9.46054C4.99887 9.05541 5.33138 8.72291 5.73738 8.72291C6.14337 8.72291 6.4715 9.05541 6.4715 9.46054V14.2914H8.5225C8.7172 14.2914 8.90393 14.3688 9.0416 14.5064C9.17928 14.6441 9.25663 14.8308 9.25663 15.0255C9.25663 15.2202 9.17928 15.407 9.0416 15.5446C8.90393 15.6823 8.7172 15.7597 8.5225 15.7597ZM28 12.0304C28 5.76454 21.7149 0.665039 14 0.665039C6.28512 0.665039 0 5.76454 0 12.0304C0 17.6453 4.98138 22.3484 11.7075 23.2418C12.1634 23.3372 12.7829 23.5428 12.943 23.9304C13.0839 24.2804 13.034 24.8229 12.9885 25.193L12.7969 26.3822C12.7417 26.733 12.5142 27.7638 14.0184 27.1347C15.5269 26.5055 22.0894 22.3773 25.0285 18.9945C27.0384 16.7939 28 14.5329 28 12.0304Z"
                                        fill="#03B92B"
                                    />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </>
        );
    }
}

export default withRouter(LoginInit);
