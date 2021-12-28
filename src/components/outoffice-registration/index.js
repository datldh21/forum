import {useState, useEffect, useRef} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Calendar from 'react-calendar';
import axios from 'axios';
import Url from '../../util/url';
import Button from 'react-bootstrap/Button';
import { useSelector } from 'react-redux';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Constant from '../../constant';

const OutOfficeRegistration = ({type, hideDialog}) => {
    const [selectSlotPopoverVisible, setSelectSlotPopoverVisible] = useState(false);
    const [selectingDate, setSelectingDate] = useState(null);
    const [selectSlotPopoverPosition, setSelectSlotPopoverPosition] = useState(false);
    const [preRegisteredDates, setPreRegisteredDates] = useState([]);
    const [disabledDates, setDisabledDates] = useState([]);
    const [reason, setReason] = useState('');
    const user = useSelector((state) => state.headerInfo.user);
    const modalRef = useRef(null);
    const [allSavedDates, setAllSavedDates] = useState([]); // all approved dates registered by you or other teammates
    const label = type === 'wfhs' ? 'làm online' : 'nghỉ phép';

    useEffect(() => {
        const fetchAllOutOfficeRegistrations = async() => {
            const res = await axios.get(Url(type));
            setAllSavedDates(res.data);
            console.log(res.data);
            if (res.data.filter(d => d.userId === user._id).length > 0) {
                setPreRegisteredDates(res.data.filter(d => d.userId === user._id).map(d => ({...d, date: new Date(d.date)})));
            }
        }
        fetchAllOutOfficeRegistrations();
    }, []);

    const isNonWorkDay = date => {
        if (date.getDay() === 0) {
            // exclude every sundays
            return true;
        } else if (date.getDay() === 6) {
            // exclude every non-working saturdays
            return daysDiff(new Date(Constant.FIRST_SATURDAY_WORKDAY), date) % 14 != 0;
        }
        return false;
    }

    const daysDiff = (d1, d2) => {
        const diff = d2.getTime() - d1.getTime();
        return diff / 1000 / 3600 / 24;
    }

    const setTileDisabled = date => {
        let isDisabled = false;
        if (isNonWorkDay(date.date)) {
            // exclude every sundays
            isDisabled = true;
        } else if (daysDiff(new Date(), date.date) < -1) {
            // exclude days before today
            isDisabled = true;
        } else if (type === 'wfhs' && !dateIsAvailableForWFH(date.date)) {
            isDisabled = true;
        }

        if (isDisabled) {
            if (disabledDates.find(d => areSameDate(d.date, date.date)) === undefined) {
                setDisabledDates(disabledDates.concat({
                    date: date.date,
                    reason: 'non-workday'
                }));
            }
            return true;
        }
        return false;
    }

    const setTileClassName = date => {
        if (!isNonWorkDay(date.date) &&
            (
                (type === 'wfhs' && daysDiff(new Date(), date.date) > 0) ||
                type === 'dayoffs'
            )) {
            // if (nbHoursFromNow(date.date) < DAYOFFS_NB_HOURS_BEFORE_CLOSED) {
            //     return 'invalid';
            // }
            if (type === 'wfhs' && !dateIsAvailableForWFH(date.date)) {
                return 'invalid';
            }
            const preRegisteredDate = preRegisteredDates.find(d => areSameDate(d.date, date.date));
            if (preRegisteredDate) {
                return preRegisteredDate.slot + (preRegisteredDate.approved !== undefined ? (preRegisteredDate.approved ? ' approved' : ' declined') : '');
            }
        }

        return '';
    }

    const setTileContent = ({ activeStartDate, date, view }) => {
        const approvedDate = preRegisteredDates.find(d => areSameDate(d.date, date) && d.approved === true);
        const declinedDate = preRegisteredDates.find(d => areSameDate(d.date, date) && d.approved === false);
        if (view === 'month' && !isNonWorkDay(date) && (
            (type === 'wfhs' && daysDiff(new Date(), date) > 0) || type === 'dayoffs')) {
            if (approvedDate) {
                return <FontAwesomeIcon icon={faCheckCircle} />;
            } else if (declinedDate) {
                return (
                    <>
                        <FontAwesomeIcon icon={faTimesCircle} />
                        <span className='declined-reason'>{declinedDate.declinedReason}</span>
                    </>
                );
            } else if (type === 'wfhs' && !dateIsAvailableForWFH(date)) {
                return <span className='declined-reason'>Phải đăng ký trước thứ 3 của tuần</span>
            }
        }
        return null;
    }

    const dateIsAvailableForWFH = date => {
        // can not register wfhs if now > monday and tuesday of this week
        const now = new Date();
        let nextTuesday = new Date();
        if (now.getDay() >= 3 && now.getDay() <= 6) {
            nextTuesday.setDate(nextTuesday.getDate() + 8 - (nextTuesday.getDay() - 1));
            return date.getTime() >= nextTuesday.getTime();
        } else if (now.getDay() === 0) {
            nextTuesday.setDate(nextTuesday.getDate() + 2);
            return date.getTime() >= nextTuesday.getTime();
        }
        nextTuesday.setDate(nextTuesday.getDate() + (2 - nextTuesday.getDay()));
        return date.getTime() >= nextTuesday.getTime();
    }

    const areSameDate = (date1, date2) => {
        return date1.getDate() === date2.getDate()
            && date1.getMonth() === date2.getMonth()
            && date1.getYear() === date2.getYear();
    }

    const bookADate = (date, event) => {
        if (preRegisteredDates.find(d => areSameDate(d.date, date)) === undefined || preRegisteredDates.find(d => areSameDate(d.date, date)).approved === undefined) {
            setSelectSlotPopoverVisible(true);
            setSelectSlotPopoverPosition([event.target.offsetLeft + 20, event.target.offsetTop + 20]);
            setSelectingDate(date);
        }
    }

    const onSelectRegistrationDetail = slot => {
        if (selectingDate) {
            if (preRegisteredDates.find(d => areSameDate(d.date, selectingDate)) === undefined) {
                if (slot !== 'cancel') {
                    setPreRegisteredDates(preRegisteredDates.concat({
                        date: selectingDate,
                        slot
                    }));
                }
            } else if (slot !== 'cancel') {
                setPreRegisteredDates(preRegisteredDates.map(d => {
                    if (areSameDate(d.date, selectingDate)) {
                        return {...d, slot};
                    }

                    return d;
                }));
            } else {
                setPreRegisteredDates(preRegisteredDates.filter(d => !areSameDate(d.date, selectingDate)));
            }
        }
        setTimeout(() => {
            setSelectSlotPopoverVisible(false);
        }, 300);
    }

    const confirmRegistration = async() => {
        if (reason === null || reason === undefined || reason.length === 0) {
            alert('Bạn cần phải nhập lý do');
        } else {
            if (preRegisteredDates.length > 0) {
                hideDialog();
                await axios.post(Url(type), preRegisteredDates.map(date => ({
                    ...date,
                    userId: user._id,
                    reason: date.reason ? date.reason : reason,
                })));
                alert('Thông tin đăng ký của bạn đã được gửi đến quản lý.');
            } else {
                alert('Bạn cần đăng ký ít nhất một ngày');
            }
        }
    }

    const getCurrentMonthRemainingDayoff = () => {
        return 1 - allSavedDates.filter(d => d.userId === user._id && (d.approved === undefined || d.approved === true)).length;
    }

    return (
        <Modal show={true} onHide={hideDialog}
            className="outoffice-registration-dialog"
            backdropClassName="outoffice-registration-backdrop"
            onClick={(event) => {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    setSelectSlotPopoverVisible(false);
                }
            }}>
            <Modal.Header className={type}>
                <Modal.Title>Đăng ký {label}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Calendar
                    tileDisabled={setTileDisabled}
                    tileClassName={setTileClassName}
                    tileContent={setTileContent}
                    onClickDay={(value, event) => bookADate(value, event)} />

                {selectSlotPopoverVisible && (
                    <div className="registration-detail-dialog"
                        ref={modalRef}
                        style={{top: selectSlotPopoverPosition[1], left: selectSlotPopoverPosition[0]}}>
                        {[
                            {
                                label: 'Đăng ký Buổi sáng',
                                value: 'morning'
                            },
                            {
                                label: 'Đăng ký Buổi chiều',
                                value: 'afternoon',
                            },
                            {
                                label: 'Đăng ký Cả ngày',
                                value: 'allday'
                            },
                            {
                                label: 'Bỏ đăng ký',
                                value: 'cancel'
                            }
                        ].map((option, index) => (
                            <Form.Check
                                type="radio"
                                key={index}
                                label={option.label}
                                id={'registration-' + option.value}
                                name="registration-detail"
                                onChange={() => onSelectRegistrationDetail(option.value)}
                            />
                        ))}
                        {type === 'dayoffs' && (
                            <Alert variant='warning'>
                                <FontAwesomeIcon icon={faExclamationCircle} />
                                {getCurrentMonthRemainingDayoff() === 1 && (
                                    <span>Bạn còn 1 ngày phép trong tháng này.</span>
                                )}
                                {getCurrentMonthRemainingDayoff() < 1 && (
                                    <span>Bạn đã sử dụng hết số ngày nghỉ phép trong tháng này, nếu bạn vẫn muốn tiếp tục xin nghỉ sẽ <u>không được tính lương</u>.</span>
                                )}
                            </Alert>
                        )}
                    </div>
                )}
                <div className="indices">
                    <div>
                        <div className="indice morning">
                            <span></span>{label} buổi sáng
                        </div>
                        <div className="indice afternoon">
                            <span></span>{label} buổi chiều
                        </div>
                    </div>
                    <div>
                        <div className="indice forbidden">
                            <span></span>Không thể {label}
                        </div>
                        <div className="indice allday">
                            <span></span>{label} cả ngày
                        </div>
                    </div>
                </div>
                <Form.Control
                    as="textarea"
                    placeholder="Lý do (bắt buộc)"
                    onChange={event => setReason(event.target.value)}
                />
            </Modal.Body>

            <Modal.Footer>
                <Button variant="primary" className="cancel-btn" onClick={hideDialog}>
                    Hủy bỏ
                </Button>
                <Button variant="success" className="confirm-btn" onClick={confirmRegistration}>
                    Xác nhận
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default OutOfficeRegistration;