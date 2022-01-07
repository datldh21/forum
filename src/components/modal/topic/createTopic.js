import "./createTopic.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { Form, FormControl, Modal, Button } from "react-bootstrap";
import axios from "axios";
import Url from "../../../util/url";

const CreateTopic = (props) => {
    const [categoryId, setCategoryId] = useState(null);
    const [name, setName] = useState(null);
    const [startDate, setStartDate] = useState(new Date());
    const userId = useSelector((state) => state.headerInfo?._id);
    const categories = useSelector((state) => state.categories);

    console.log(userId);
    
    const handleCategory = async (e) => {
        const value = e.target.value;
        setCategoryId(value);
    }

    const handleName = async (e) => {
        const value = e.target.value;
        setName(value);
    }

    const submit = async (e) => {
        e.preventDefault();
        const topicData = {
            categoryId: categoryId,
            name: name,
            startDate: startDate,
            userCreate: userId,
            voteCount: 0,
            postCount: 0,
            viewCount: 0,
        }
        const res = await axios.post(Url("topic"), topicData);
        console.log(topicData);
        props?.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header style={{ justifyContent: "center" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    CREATE TOPIC
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <div className="change-project">
                        <Form.Select onChange={handleCategory}>
                            <option value="1">Category: </option>
                            {categories && categories.length > 0 && (
                                categories.map((category, index) => {
                                    return (
                                        <option value={category._id} key={index}>{category.name}</option>
                                    )
                                })
                            )}
                        </Form.Select>
                    </div>
                    <br></br>
                    <div className="handle-name">
                        <Form.Label>Topic Name:</Form.Label>
                        <div className="content">
                            <FormControl
                                type='string'
                                name='name'
                                onChange={handleName}
                            />
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" className="cancel-btn" onClick={() => props.onHide()}>
                    Cancel
                </Button>
                <Button type="submit" className="confirm-btn" onClick={submit}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreateTopic;