import { useState } from "react";
import "./createPost.scss";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Url from "../../../util/url";

const CreatePost = (props) => {
    const [content, setContent] = useState(null);
    const [date, setDate] = useState(new Date());
    const topic = useSelector((state) => state.topics);
    const headerInfo = useSelector((state) => state.headerInfo);
    const dispatch = useDispatch();

    const handleContent = async (e, editor) => {
        const data = editor.getData();
        setContent(data);
    }
    
    const fetchTopicPosts = async () => {
        const res = await axios.get(Url("post/topic/" + topic[0]._id));
        dispatch({ type: "SET_TOPIC_POSTS", data: res?.data?.response });
    }

    const submit = async () => {
        const postData = {
            categoryId: topic[0].categoryId,
            topicId: topic[0]._id,
            userId: headerInfo._id,
            content: content,
            votes: 0,
            date: date,
        }

        const newPost = await axios.post(Url("post"), postData);
        fetchTopicPosts();
        props?.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header style={{ justifyContent: "center" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    CREATE POST
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <div className="handle-content">
                    <CKEditor
                        editor={ClassicEditor}
                        onChange={handleContent}
                    />
                </div>
            </Modal.Body>

            <Modal.Footer style={{justifyContent: "center"}}>
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

export default CreatePost;