import React, {useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import CSVReader from 'react-csv-reader';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Url from '../../util/url';
import './styles.scss';

const UpdateWorkingTimeModal = ({hideModal}) => {
    const [data, setData] = useState([]);

    const uploadNewInfo = async() => {
        await axios.post(Url('update-working-time'), data);
        alert('Data uploaded successfully');
    }

    return (
        <Modal show={true} onHide={hideModal} className="update-working-time-modal">
            <Modal.Header>
                <Modal.Title>Cập nhật máy chấm công</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <CSVReader onFileLoaded={(data, fileInfo, originalFile) => setData(data.slice(1, data.length).map(item => ({
                    name: item[3],
                    date: new Date(item[5]),
                    checkin: item[9],
                    checkout: item[10],
                })))} />
                <Button variant="primary" onClick={uploadNewInfo}>Cập nhật</Button>
            </Modal.Body>
        </Modal>
    )
}

export default UpdateWorkingTimeModal;