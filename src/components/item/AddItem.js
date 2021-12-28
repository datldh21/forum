import axios from "axios";
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Url from "../../util/url";
import IsLoading from "../IsLoading";
const AddItem = (props) => {
    const dispatch = useDispatch();
    const [item, setItem] = useState();
    const [descript, setDescript] = useState();
    const [price, setPrice] = useState();
    const [quantity, setQuantity] = useState();
    const [limited, setLimited] = useState(false);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const itemState = useSelector((state) => state.item);

    const handleAddItem = async () => {
        let bodyFormData = new FormData();
        
        bodyFormData.append("file", item);
        bodyFormData.append("price", price);
        bodyFormData.append("description", descript);
        bodyFormData.append("limited", limited);
        quantity && bodyFormData.append("quantity", quantity);

        if (!item || !descript || !price) {
            setError("Vui lòng điền đầy đủ thông tin");
        } else {
            setIsLoading(true);
            const res = await axios.post(Url("item"), bodyFormData, 
                {
                    headers: {
                    Accept: "application/json",
                    "Content-Type":
                        "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
                    },
                }
            );
            console.log("res data: ", res);
            if (res.data.success) {
                setIsLoading(false);
                const data = res.data.response;
                const newItemState = {
                    id: data[0]._id,
                    item: data[0].item,
                    description: data[0].description,
                    limited: data[0].limited,
                    price: data[0].price,
                    quantity: data[0]?.quantity,
                };
                const item = [...itemState].unshift(newItemState);
                dispatch({ type: "SET_ITEM", data: [newItemState, ...itemState] });
                props.onHide();
            }
        }
    };

    const handleItem = (e) => {
        setItem(e.target.files[0]);
    };

    const handleDescript = (e) => {
        setDescript(e.target.value);
    };

    const handlePrice = (e) => {
        setPrice(e.target.value);
    };

    const handleQuantity = (e) => {
        setQuantity(e.target.value);
    };

    const handleLimited = () => {
        setLimited(true);
    };

    return (
        <Modal {...props} show={props.show}>
            {isLoading && <IsLoading />}

            <Modal.Dialog>
                <Modal.Body>
                    {error && error}
                    <Form>
                        <Form.Group controlId="formBasicImage">
                            <Form.Label>Ảnh:</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleItem}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="formBasicDescript">
                            <Form.Label>Tên sản phẩm:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Tên sản phẩm"
                                onChange={handleDescript}
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group controlId="formBasicPrice">
                            <Form.Label>Giá:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Giá"
                                onChange={handlePrice}
                                min="1"
                            />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Giới hạn:</Form.Label>
                            <Form.Check type="checkbox" onChange={handleLimited} />
                        </Form.Group>
                        <br></br>
                        <Form.Group>
                            <Form.Label>Số lượng giới hạn:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Số lượng"
                                onChange={handleQuantity}
                                min="0"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={props.onHide}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddItem}>
                        Lưu
                    </Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
};
export default AddItem;