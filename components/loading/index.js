import React from "react";

const Loading = (props) => {
    const {loading} = props;
    return (
        <div className={loading ? "loading-container active" : "loading-container"}>
            <div className="loading-spin" />
        </div>
    );
}

export default Loading;
