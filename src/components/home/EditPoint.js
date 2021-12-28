import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import action from "../../assets/icon/more_vert_24px.svg";
import Url from "../../util/url";
import ChangePointModal from "./ChangePointModal";

const Edit = (props) => {
    const id = props?.id;
    const bonus = props?.bonus;
    const reason = props?.reason;
    const userId = props?.userId;
    const hide = props?.hide;
    const ref = useRef();
    const [show, setShow] = useState(false);
    const [modalShow, setModalShow] = useState(false);
    const [type, setType] = useState(true);
    const point = props.point;
    const [dataUserUpdate, setDataUserUpdate] = useState([]);
    const dataUserInfoState = useSelector((state) => state.user);
    useEffect(async () => {
        if (bonus > 0) {
            setType(true);
        } else {
            setType(false);
        }
    }, []);
    const dispatch = useDispatch();

    const editItem = async (id, bonus, reason, userId, hide) => {
        const userInfo = dataUserInfoState.filter((user) => user._id == userId);
        const oldPoint = userInfo[0]?.point;
        const oldBonus = bonus;
        const oldReason = reason;
        const oldHide = hide;
        const dataUpdate = {
            oldPoint,
            oldReason,
            oldHide,
            oldBonus,
            pointId: id,
            userId,
        };
        setDataUserUpdate(dataUpdate);
        setModalShow(!modalShow);
    };

    const deleteItem = async (id, bonus, userId) => {
        const res = await axios.delete(Url("point/" + id));
        if (res.data.success) {
            dispatch({ type: "DELETE_BONUS", data: id });
            const userInfo = dataUserInfoState.filter((user) => user._id == userId);
            const oldPoint = userInfo[0]?.point;

            dispatch({
                type: "UPDATE_POINT_USER",
                data: { userId, point: Number(oldPoint) - Number(bonus) },
            });

            axios.patch(Url(`user/info/${userId}`), { point: Number(oldPoint) - Number(bonus) });
        }
    };

    useEffect(() => {
        const checkIfClickedOutside = (e) => {
            if (show && ref.current && !ref.current.contains(e.target)) {
                setShow(false);
            }
        };

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [show]);

    return (
        <div className="item item-action">
            <div
                className="icon-more_vert_24px"
                onClick={() => {
                    setShow(true);
                }}
            >
                <img src={action} />
            </div>
            {show && (
                <div className="action-menu" ref={ref}>
                    <div className="action-edit">
                        <p
                            onClick={() => {
                                editItem(id, bonus, reason, userId, hide);
                            }}
                        >
                            Edit
                        </p>
                    </div>

                    <div className="action-delete">
                        <p
                            onClick={() => {
                                deleteItem(id, bonus, userId);
                                setShow(!show);
                            }}
                        >
                            Delete
                        </p>
                    </div>
                </div>
            )}
            <ChangePointModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                action={false}
                type={type}
                dataUpdate={dataUserUpdate}
            />
        </div>
    );
};
export default Edit;
