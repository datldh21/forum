import Error from '../Error';
import "./style.scss";
import diamond from "../../assets/images/diamond.svg";

const Request = (props) => {
    const request = props?.request;

    return (
        <>
            {request == null || request.length == 0 ? (
                <Error /> 
            ) : (
                request && request.map((item, index) => {
                    const avatar = item?.avatar;
                    const name = item?.name;
                    const imgItem = item?.imgItem;
                    const price = item?.price;
                    const date = item?.date;
                    const seen = item?.seen;
                    return (
                        <div className="tab-request">
                            {!seen && (
                                <div className="dot-notification"></div>
                            )}
                            <img
                                className="avatar-user"
                                src={avatar}
                            />
                            <div className="name-user">{name}</div>
                            <img
                                className="image-item"
                                src={imgItem}
                            />
                            <div className="date">{date}</div>
                            <div className="price">
                                <img
                                    className="diamond"
                                    src={diamond}
                                    style={{width: "25px"}}
                                />
                                <div className="credit">-{price}</div>
                            </div>
                        </div>
                    )
                })
            )}
        </>
    )
}

export default Request;
