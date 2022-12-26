import React from "react";

const PhotoCategoryItems = props => {
    const { items, handleClickPopupImage, handleChecked, isCheck } = props;
    const googleMarkStyle = { 'color': 'black', 'backgroundColor': '#F8FFFF', 'display': 'inline-block', 'position': 'absolute', 'top': '10px', 'left': '10px', 'borderRadius':'3px', 'padding':'3px 10px', 'fontSize':'10px', 'lineHeight':'12px', 'border': '1px solid darkorange' };
    return (
        <div className="photo__item-cards f fw jcs aic">
            {items.map((item, index) => (
                <div className="photo__item-card relative" key={index} data-note={item.note} data-status={item.status}>                    
                    <div className="form-group__checkbox form-group__checkbox--white">
                        <input type="checkbox"
                            onChange={e => handleChecked(e)}
                            id={item._id}
                            name={`photo_${item._id}`}
                            value={item._id}
                            checked={isCheck.includes(item._id)}
                        />
                        <label htmlFor={item._id}></label>
                    </div>
                    <div className="photo__item-card-img relative image--cover ratio" onClick={e => handleClickPopupImage(item, e)} >
                        <img className="image__img" src={item.origin_url} alt={item._id} />
                    </div>
                    {item.google_status?<span style={googleMarkStyle}>Google</span>:""}
                </div>
            ))}
        </div>
    );
}

export default PhotoCategoryItems;