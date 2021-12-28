import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Url from "../../util/url";
import Error from "../Error";
import IsLoading from "../IsLoading";
import moment from "moment";
import diamond from "../../assets/images/diamond.svg";

const ListItems = () => {
    const dispatch = useDispatch();
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentId = userInfo._id;
    const role = userInfo.role;
    const [show, setShow] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [newRequest, setNewRequest] = useState("");
    const itemState = useSelector((state) => state.item);
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [itemId, setItemId] = useState("");
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [errorNotEnough, setErrorNotEnough] = useState(false);
    const [errorLimited, setErrorLimited] = useState(false);
    const [errorNoData, setErrorNoData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    let myProfileState = useSelector((state) => state.headerInfo.user);
    const dataPoint = myProfileState && myProfileState.credit;

    useEffect(async () => {
        fetchItem();
    }, []);

    const fetchInfoUser = async () => {
        const res = await axios.get(Url("user/info/" + currentId));
        if (res.data?.success) {
            const data = res.data?.response.map((item, index) => {
                return {
                    
                }
            })
        }
    }

    const fetchItem = async () => {
        const res = await axios.get(Url("item/limit"));
        if (res.data?.success) {
            const data = res.data?.response.map((item, index) => {
                return {
                    id: item._id,
                    index: index + 1,
                    item: item.item,
                    description: item.description,
                    price: item.price,
                    limited: item.limited,
                    quantity: item.quantity,
                };
            });
            dispatch({ type: "SET_ITEM", data });
        } else {
            setErrorNoData(true);
        }
    };

    const handleConfirmYes = async () => {
        const newReq = newRequest;
        const newItemState = {
            id: itemId,
            item: itemName,
            description: description,
            quantity: quantity,
            price: price,
            date: moment(new Date()).format('DD/MM/YYYY')
        };
        if (dataPoint >= price) {
            setIsLoading(true);
            if (quantity < 1) {
                setIsLoading(false);
                setErrorLimited(true);
            } else {
                const res = await axios.post(Url("request"), newReq);
                if (res.data?.success) {
                    setIsLoading(false);
                    axios.patch(Url(`user/info/${currentId}`), { credit: dataPoint - price });
                    axios.patch(Url(`item/${newItemState.id}`), {quantity: quantity - 1});
                    dispatch({ type: "UPDATE_CREDIT", data: dataPoint - price });

                    dispatch({ type: "UPDATE_MY_ITEM", data: newItemState });

                    if (res.data.success) {
                        setShow(false);

                        setTimeout(() => {
                            setShowAlert(false);
                        }, 1000);
                    }
                }
            }
        } else {
            setErrorNotEnough(true);
        }
    };

    const handleConfirmNo = () => {
        setShow(false);
    };

    const clickBuy = (id, price, item, description, quantity, date) => {
        setShow(true);
        const itemId = id;
        setItemId(itemId);
        setPrice(price);
        setDescription(description);
        setQuantity(quantity);
        setItemName(item);
        setDate(date);
        setNewRequest({
            itemId: itemId,
            userId: currentId,
            status: 1,
            date: new Date(),
        });
    };

    return (
        <>  
            <div className="list-items ">
                {itemState.length == 0 ? (
                    <Error />
                ) : (
                    <>
                        <div className="cards">
                            {itemState &&
                                itemState?.map((item, index) => {
                                    return (
                                        <>
                                            <div className="card-item">
                                                <img className="item-image" src={item.item} />
                                                <div
                                                    className="button-buy"
                                                    onClick={() =>
                                                        clickBuy(
                                                            item.id,
                                                            item.price,
                                                            item.item,
                                                            item.description,
                                                            item.quantity,
                                                            item.date
                                                        )
                                                    }
                                                >
                                                    <img className="diamond-icon" src={diamond} />
                                                    <p>{item.price}</p>
                                                </div>
                                                <div className="card-description">
                                                    <div className="quantity">
                                                        <p>Số lượng: </p>
                                                        <p>{item.quantity}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>
                        <Modal
                            className="change-item-modal" 
                            show={show}
                            centered
                        >
                            {isLoading && <IsLoading />}

                                <Modal.Body>
                                    <img src={itemName} />
                                    {errorLimited && (
                                        <p style={{ textAlign: "center", marginTop: "25px" }}>Phần quà đã hết lượt đổi</p>
                                    )}
                                    {errorNotEnough && (
                                        <p style={{ textAlign: "center", marginTop: "25px" }}>Không đủ điểm</p>
                                    )}
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="primary" className="cancel-btn" onClick={handleConfirmNo}>
                                        Huỷ bỏ
                                    </Button>
                                    <Button variant="primary" className="confirm-btn" onClick={handleConfirmYes}>
                                        <div className="diamond-icon"><img src={diamond} /></div>
                                        <div className="item-price">{price}</div>
                                    </Button>
                                </Modal.Footer>
                            
                        </Modal>
                    </>
                )}
            </div>
        </>
    );
};

export default ListItems;
