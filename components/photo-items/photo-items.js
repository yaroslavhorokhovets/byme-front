import React from "react";

const PhotoItems = props => {
    const { items, handleClickPopupImage, handleChecked, isCheck } = props;
    return (
        <div className="photo__item-cards f fw jcs aic">
            {items.map((item, index) => (
                <div className="photo__item-card relative" key={index} data-note={item.note} data-status={item.image_id}>
                    <div className="form-group__checkbox form-group__checkbox--white">
                        <input type="checkbox"
                               onChange={e => handleChecked(e)}
                               id={item._id}
                               name={`photo_${item._id}`}
                               value={item.image_id}
                               checked={isCheck.includes(item._id)}
                        />
                        <label htmlFor={item._id}></label>
                    </div>
                    <div className="photo__item-card-img relative image--cover ratio" onClick={e => handleClickPopupImage(item, e)} >
                        <img className="image__img" src={item.url} alt={item._id} />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PhotoItems;