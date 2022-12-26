import React from "react";
import $ from "jquery";
import ReactCodeInput from "react-code-input";

class LoginSubmit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyCode: 0
        }
    }

    submit = e => {
        e.preventDefault();
        // console.log(this.state.verifyCode)
        this.props.submit(this.state.verifyCode);
    };

    onChangeVerifyCode = e => {
        this.setState({
            verifyCode: e
        })
    }

    render() {
        const { t } = this.props;

        return (
            <div className="col-12 col-lg-12">
                <div className="the-box box-auth box-active fa-2 form-auth">
                    <form
                        className="form-active text-center"
                        onSubmit={this.submit}
                    >
                        <h4 className="mb-4 title-login">{t("twoFactor2")}</h4>
                        <div className="form-group">
                            <p className="c-muted mb-0">
                                {t("enter6Digit")}
                            </p>
                        </div>
                        <div className="form-group input-code">
                             <ReactCodeInput type='number' autoFocus
                                            value={this.state.verifyCode}
                                            fields={6} inputStyle={{ borderColor: 'black' }}
                                            onChange={this.onChangeVerifyCode}
                                            
                                        />
                        </div>
                        <div className="action-bottom">
                            <button className="button--submit" type="submit">
                                <div className="btn__wrapper">
                                    <div className="btn__el">{t("title.next")}</div>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default LoginSubmit;
