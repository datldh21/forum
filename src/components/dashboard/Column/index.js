import "./style.scss";
import axios from "axios";
import Url from "../../../util/url";
import { useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

const Column = ({columnId, children}) => {

    const dispatch = useDispatch();
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "TASK",
        drop: (item) => handleDrop(item.id),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        })
    }));

    const handleDrop = async (id) => {
        const dataBody = {
            id: id,
            status: columnId
        }
        dispatch({ type: "UPDATE_TASK_STATUS", data: dataBody });
        const res = await axios.patch(Url("task/" + id), dataBody);
    }

    return (
        <div 
            className="column"
            ref={drop}
        >
            {children}
        </div>
    )
}

export default Column;