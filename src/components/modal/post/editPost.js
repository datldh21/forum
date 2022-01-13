import axios from "axios";
import { useEffect, useState } from "react";
import Url from "../../../util/url";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Modal, Button } from "react-bootstrap";
import "./editPost.scss";
import { useDispatch } from "react-redux";

const EditPost = (props) => {
    const id = props?.id;
    const dispatch = useDispatch();
    const [postData, setPostData] = useState("");
    const [categoryId, setCategoryId] = useState(undefined);
    const [topicId, setTopicId] = useState(undefined);
    const [userId, setUserId] = useState(undefined);
    const [content, setContent] = useState(undefined);
    const [votes, setVotes] = useState(undefined);
    const [date, setDate] = useState(undefined);

    const fetchPostData = async () => {
        const res = await axios.get(Url("post/" + id));
        if (res.data.success) {
            const data = res?.data?.response.map((item) => {
                return {
                    id: item._id,
                    categoryId: item.categoryId,
                    topicId: item.topicId,
                    userId: item.userId,
                    content: item.content,
                    votes: item.votes,
                    date: item.date,
                }
            });
            setPostData(data);
            setCategoryId(data[0].categoryId);
            setTopicId(data[0].topicId);
            setUserId(data[0].userId);
            setContent(data[0].content);
            setVotes(data[0].votes);
            setDate(data[0].date);
            return data;
        }
    }

    useEffect(() => {
        fetchPostData();
    }, []);

    const handleContent = async (e, editor) => {
        const data = editor.getData();
        setContent(data);
    }

    const fetchTopicPosts = async () => {
        const res = await axios.get(Url("post/topic/" + topicId));
        dispatch({ type: "SET_TOPIC_POSTS", data: res?.data?.response });
    }

    const fetchTopic = async () => {
        const res = await axios.get(Url("topic/" + topicId));
        dispatch({ type: "SET_TOPICS", data: res?.data?.response });
    }

    const edit = async (e) => {
        e.preventDefault();
        const dataUpdate = {
            categoryId: categoryId,
            topicId: topicId,
            userId: userId,
            content: content,
            votes: votes,
            date: new Date()
        }
        const res = await axios.patch(Url("post/" + id), dataUpdate);
        fetchTopicPosts();
        props?.onHide();
    }

    const deletePost = async () => {
        const res = await axios.delete(Url("post/" + id));
        const updatePostCountTopic = await axios.patch(Url("topic/postCount/dec/" + topicId));
        const updatePostCountCategory = await axios.patch(Url("category/postCount/dec/" + categoryId));
        fetchTopic();
        fetchTopicPosts();
        props?.onHide();
    }

    return (
        <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
            <Modal.Header style={{ justifyContent: "center" }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    EDIT POST
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
                <Button type="submit" className="confirm-btn" onClick={edit}>
                    Edit
                </Button>
                <Button type="submit" className="delete-btn" onClick={deletePost}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditPost;