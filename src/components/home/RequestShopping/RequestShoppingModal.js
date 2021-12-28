import { useState } from "react";
import Url from "../../../util/url";
import IsLoading from "../../IsLoading";
import moment from "moment";
import axios from "axios";
import "./style.scss";
import { Button, Form, FormControl, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";

const RequestShoppingModal = (props) => {
    const [content, setContent] = useState("");
    const [price, setPrice] = useState("");
    const [project, setProject] = useState("");
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const projectValue = useSelector((state) => state.credit.project);

    const changeContent = async (e) => {
        const value = e.target.value;
        setContent(value);
    };

    const changePrice = async (e) => {
        const value = e.target.value;
        setPrice(value);
    };

    const changeProject = async (e) => {
        const value = e.target.value;
        setProject(value);
    }

    const submit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        if (!content) {
            setError(true);
        } else {
            const request_shopping = {
                content: content,
                price: price,
                project: project,
                date: moment(new Date()).format("YYYY-MM-DD hh:mm:ss"),
            };
            const addRequestShopping = await axios.post(Url(`request-shopping`), request_shopping);
            if (addRequestShopping.data.success) {
                setIsLoading(false);
                props?.onHide();
                setContent("");
                setPrice("");
                setProject("");
                setError(false);
            } else {
                alert("Yêu cầu không thành công!");
            }
        }
    }

    return (
        <>
            <Modal 
                {...props} 
                aria-labelledby="contained-modal-title-vcenter"
                className="request-shopping-modal" 
                centered>
                {isLoading && <IsLoading />}

                <Modal.Header style={{ justifyContent: "center" }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        YÊU CẦU MUA SẮM
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <div className="change-project">
                            <Form.Select onChange={changeProject}>
                                <option value="1">Chọn dự án</option>
                                {projectValue && (
                                    projectValue.map((item) => {
                                        return (
                                            <option value={item}>{item}</option>
                                        )
                                    })
                                )}
                            </Form.Select>
                        </div>
                        <br></br>
                        <div className="change-content">
                            <Form.Label>Nội dung:</Form.Label>
                            <div className="content">
                                <FormControl
                                    type='string'
                                    name='content'
                                    onChange={changeContent}
                                />
                            </div>
                        </div>
                        <br></br>
                        <div className="change-price">
                            <Form.Label>Giá tiền:</Form.Label>
                            <div className="price">
                                <FormControl
                                    type='number'
                                    name='price'
                                    onChange={changePrice}
                                />
                            </div>
                        </div>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" className="cancel-btn" onClick={() => props.onHide()}>
                        Hủy bỏ
                    </Button>
                    <Button type="submit" className="confirm-btn" onClick={submit}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RequestShoppingModal;