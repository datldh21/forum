import axios from "axios";
import { useState } from "react";
import { Button, Dropdown, DropdownButton, Form, FormControl, Modal } from "react-bootstrap";
import Url from "../../util/url";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";
import IsLoading from "../IsLoading";

const ChangePointModal = (props) => {
    const action = props?.action;
    const userInfoState = useSelector((state) => state.myProfile.userInfo);
    const dataPoint = userInfoState && userInfoState?.point;
    const dataCredit = userInfoState && userInfoState?.credit;
    const dataTotalScore = userInfoState && userInfoState?.totalScore;
    const creditPoolState = useSelector((state) => state.credit);
    const surplusPoolCredit = creditPoolState && creditPoolState.surplusPoolCredit;
    const type = props?.type;
    const userId = props?.userId;
    let userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const currentId = userInfo?._id;
    const defaultPoint = props?.defaultPoint;
    const [point, setPoint] = useState("");
    const [credit, setCredit] = useState("");
    const [reason, setReason] = useState("");
    const [badge, setBadge] = useState("");
    const [statusPoint, setStatusPoint] = useState(false);
    const [statusBadge, setStatusBadge] = useState(false);
    const [error, setError] = useState(false);
    const [hide, setHide] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const onchange = (e) => {
        const value = e.target.value;
        if (value === "diem") {
            setStatusPoint(true);
            setStatusBadge(false);
        } else {
            setStatusPoint(false);
            setStatusBadge(true);
        }
    };

    const handleChangePoint = async (e) => {
        const value = e.target.value;
        if (type) {
            setPoint(value);
            setCredit(value);
        } else {
            setPoint(-value);
            setCredit(0);
        }
    };
    const handleChangeReason = async (e) => {
        const value = e.target.value;
        setReason(value);
    };
    const handleChangeHide = () => {
        setHide(!hide);
    };

    const submitSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let newPoint = 0;
        let newCredit = 0;
        let newSurplusPoolCredit = 0;
        let newTotalScore;
        newPoint = Number(dataPoint) + Number(point);
        newCredit = Number(dataCredit) + Number(credit);
        newTotalScore = Number(dataTotalScore) + Number(point);
        newSurplusPoolCredit = Number(surplusPoolCredit) - Number(credit);

        if (!point || !reason || statusPoint == null) {
            setError(true);
        } else {
            const history_point = {
                point: Number(point),
                credit: Number(credit),
                userId: userId,
                authorId: currentId,
                edit_date: moment(new Date()).format("YYYY-MM-DD h:mm:ss"),
                reason: reason,
                hide: hide,
            };
            const change = {
                point: newPoint,
                credit: newCredit,
                totalScore: newTotalScore,
                badge: badge,
            };
            const updateUser = await axios.patch(Url(`user/info/${userId}`), change);
            const updateSurplusPoolCredit = await axios.patch(Url(`credit`), {
                surplusPoolCredit: newSurplusPoolCredit,
            });
            
            const addHistoryPoint = await axios.post(Url(`point`), history_point);
            if (updateUser.data.success && addHistoryPoint.data.success) {
                dispatch({ type: "UPDATE_POINT", data: change.point });
                dispatch({ type: "UPDATE_CREDIT_USER", data: change.credit });
                dispatch({ type: "UPDATE_SURPLUS_POOL_CREDIT", data: newSurplusPoolCredit });

                const bonusState = {
                    point: Number(point),
                    credit: Number(credit),
                    name: props?.data[0]?.firstName + " " + props?.data[0]?.lastName,
                    reason: reason,
                    avatar: props?.data[0]?.avatar,
                    date: moment(new Date()).format("DD/MM"),
                };

                dispatch({ type: "UPDATE_BONUS_BY_USER", data: bonusState });
                setIsLoading(false);
                props?.onHide();
                setStatusPoint(false);
                setHide(true);
                setPoint("");
                setReason("");
                setError(false);
            } else {
                alert("Thuong/Phat khong thanh cong");
            }
        }
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
        if (!point || !reason) {
            setError(true);
        } else {
            const dataUpdate = props?.dataUpdate;
            const oldPoint = dataUpdate?.oldPoint;
            const oldBonus = dataUpdate?.oldBonus;
            const oldReason = dataUpdate?.oldReason;
            const oldHide = dataUpdate?.oldHide;
            const pointId = dataUpdate?.pointId;
            const userId = dataUpdate?.userId;
            const userChange = {
                point: Number(oldPoint) - Number(oldBonus) + Number(point),
            };
            const pointUpdate = {
                userId,
                reason,
                hide,
                point: point,
            };

            let updateUserSuccess;
            setIsLoading(true);
            if (oldBonus != point) {
                const updateUser = await axios.patch(Url(`user/info/${userId}`), userChange);
                updateUser?.data?.success
                    ? (updateUserSuccess = true)
                    : (updateUserSuccess = false);
            } else {
                updateUserSuccess = true;
            }
            const updatePoint = await axios.patch(Url(`point/update/${pointId}`), pointUpdate);

            if (!updatePoint.data.success || !updateUserSuccess) {
                alert("Update fail");
            }
            setIsLoading(false);
            dispatch({
                type: "UPDATE_POINT_HISTORY_BONUS",
                data: { id: pointId, point: Number(point), reason: reason },
            });
            dispatch({
                type: "UPDATE_POINT_USER",
                data: { userId, point: Number(oldPoint) - Number(oldBonus) + Number(point) },
            });
            props?.onHide();
            setStatusPoint(false);
            setPoint("");
            setReason("");
        }
    };
    return (
        <>
            {" "}
            <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                {isLoading && <IsLoading />}

                <Modal.Header style={{ justifyContent: "flex-end" }}>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <Button
                            className="close"
                            aria-label="Close"
                            onClick={() => {
                                props.onHide();
                                setStatusPoint(false);
                                setError(false);
                            }}
                        >
                            {" "}
                            <span aria-hidden="true">&times;</span>
                        </Button>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {["diem", "huy hieu"].map((item) => {
                            return (
                                <div className="modal-action">
                                    <input
                                        type="radio"
                                        value={item}
                                        name="gender"
                                        onChange={onchange}
                                    />
                                    {type ? " + " : " - "}{" "}
                                    {item == "diem" ? <>Điểm</> : <>Huy hiệu</>}
                                    {statusPoint && item === "diem" ? (
                                        <div className="modal-action point">
                                            {error && <p>Điền đầy đủ thông tin</p>}
                                            <div className="point">
                                                <FormControl
                                                    placeholder="Nhập điểm"
                                                    type="number"
                                                    name="point"
                                                    onChange={handleChangePoint}
                                                    defaultValue={defaultPoint}
                                                />
                                            </div>
                                            <div className="reason">
                                                <FormControl
                                                    placeholder="Nhập lí do"
                                                    type="text"
                                                    name="reason"
                                                    onChange={handleChangeReason}
                                                />
                                            </div>
                                            <Form.Check
                                                type="checkbox"
                                                label="Hien thi"
                                                value={hide}
                                                onChange={handleChangeHide}
                                            />
                                        </div>
                                    ) : null}
                                    {statusBadge && item === "huy hieu" ? (
                                        <div className="modal-action badge">
                                            {error && <p>Điền đầy đủ thông tin</p>}
                                            <DropdownButton
                                                id="dropdown-basic-button"
                                                title="Chọn huy hiệu"
                                            >
                                                <Dropdown.Item href="#/action-1">
                                                    Nhân viên 5 tốt
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-2">
                                                    Nhân viên chăm chỉ
                                                </Dropdown.Item>
                                                <Dropdown.Item href="#/action-3">
                                                    Nhân viên làm việc tốt
                                                </Dropdown.Item>
                                            </DropdownButton>
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {action ? (
                        <Button type="submit" onClick={submitSave}>
                            Xác nhận
                        </Button>
                    ) : (
                        <Button type="submit" onClick={submitUpdate}>
                            Cập nhật
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ChangePointModal;
