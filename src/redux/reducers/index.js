import { combineReducers } from "redux";
import Item from "./item.reducer";
import Request from "./request.reducer";
import Point from "./point.reducer";
import Page from "./page.reducer";
import User from "./user.reducer";
import MyItem from "./myitem.reducer";
import UserInfo from "./infoUser.reducer";
import MyProfile from "./myProfile.reducer";
import HeaderInfo from "./headerInfo.reducer";
import Credit from "./credit.reducer";
import Notifications from "./notification.reducer";
import Feedback from "./feedback.reducer";
import Status from "./status.reducer";
import Task from "./task.reducer";
import AllTask from "./allTask.reducer";
import Sprint from "./sprint.reducer";
import NextSprintTask from "./nextSprintTask.reducer";
import SprintTask from "./activeSprintTask.reducer";

export default combineReducers({
    setPoint: Point,
    item: Item,
    request: Request,
    notifications: Notifications,
    page: Page,
    userbonus: User,
    myitem: MyItem,
    user: UserInfo,
    userInfo: User,
    myProfile: MyProfile,
    headerInfo: HeaderInfo,
    credit: Credit,
    feedback: Feedback,
    status: Status,
    task: Task,
    allTask: AllTask,
    sprintTask: SprintTask,
    nextSprintTask: NextSprintTask,
    sprint: Sprint,
});
