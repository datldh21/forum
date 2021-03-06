import { useState } from "react";
import "./createPost.scss";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import Url from "../../../util/url";

const CreatePost = (props) => {
    const tag = props?.tag;
    const [content, setContent] = useState(tag);
    const [date, setDate] = useState(new Date());
    const topic = useSelector((state) => state.topics);
    const headerInfo = useSelector((state) => state.headerInfo);
    const topicPosts = useSelector((state) => state.topicPosts);
    const dispatch = useDispatch();
    let noticeId = [];

    if (topicPosts && topicPosts.length > 0) {
        topicPosts.map((post) => {
            if (post.userId != headerInfo._id) {
                noticeId.push(post.userId)
            }
        })
    }

    const handleContent = async (e, editor) => {
        const data = editor.getData();
        setContent(data);
    }
    
    const fetchTopicPosts = async () => {
        const res = await axios.get(Url("post/topic/" + topic[0]._id));
        dispatch({ type: "SET_TOPIC_POSTS", data: res?.data?.response });
    }

    const fetchTopic = async () => {
        const res = await axios.get(Url("topic/" + topic[0]._id));
        dispatch({ type: "SET_TOPICS", data: res?.data?.response });
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

        if (noticeId.length > 0) {
            noticeId.map((userId) => {
                const notificationData = {
                    userId: userId,
                    topicId: topic[0]._id,
                    userCreateId: headerInfo._id,
                    date: date,
                }
                const noticeUserData = {
                    notice: true
                }
                const res = axios.post(Url("notifications"), notificationData);
                const updateNoticeUser = axios.patch(Url("user/info/" + userId), noticeUserData);
            })
        }

        const newPost = await axios.post(Url("post"), postData);
        const updatePostCountTopic = await axios.patch(Url("topic/postCount/inc/" + topic[0]._id));
        const updatePostCountCategory = await axios.patch(Url("category/postCount/inc/" + topic[0].categoryId));
        fetchTopic();
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
                        data={content}
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