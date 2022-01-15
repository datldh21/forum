import { useHistory, Redirect } from "react-router-dom";
import "./style.scss";

const Notifications = (props) => {
    const notifications = props.notifications;
    const history = useHistory();

    const clickNotification = (topicId) => {
        history.push({ pathname: '/topic/' + topicId });
        <Redirect to='/topic' />
    }

    return (
        <div className="notifications">
            {notifications.map((notification, index) => {
                return (
                    <div className="notification" key={index} onClick={() => clickNotification(notification.topic[0]?._id)}>
                        <div className="user-create-avatar">
                            <img src={notification.userCreate[0]?.avatar} />
                        </div>
                        <div className="content">
                            {notification.userCreate[0]?.fullName} has posted in your following topic: {notification.topic[0]?.name}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Notifications;