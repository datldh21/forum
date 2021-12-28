import "./style.scss";
import split from "../../assets/images/SplitFeedback.svg";
import { Carousel } from "react-bootstrap";

const Feedback = (props) => {
    const userId = props?.userId;
    const feedback = props?.feedback;

    const groups = feedback.length > 0 && feedback?.reduce((groups, data) => {
        const userId = data.userId;
        if (!groups[userId]) {
            groups[userId] = [];
        }
        const dataGroups = {
            id: data?._id,
            userId: data?.userId,
            strength: data?.strength,
            weakness: data?.weakness,
            target: data?.target,
            month: data?.month,
            year: data?.year
        }
        if (dataGroups.id != 0) {
            groups[userId].unshift(dataGroups);
        }
        return groups;
    }, {});

    const group2021 = [];
    const group2022 = [];

    for (let x in groups[userId]) {
        if (groups[userId][x].year == 2021) {
            group2021.push(groups[userId][x]);
        }
    }

    for (let x in groups[userId]) {
        if (groups[userId][x].year == 2022) {
            group2022.push(groups[userId][x]);
        }
    }

    const group2021ByMonth = group2021 && group2021.sort((a, b) => b?.month - a?.month);
    const group2022ByMonth = group2022 && group2022.sort((a, b) => b?.month - a?.month);

    const groupSorted = group2022ByMonth.concat(group2021ByMonth);
    
    const group = groups && Object.keys(groups)?.map((userId) => {
        return {
            userId,
            groupByUserId: groupSorted,
        };
    });

    return (
        <>
            {userId == null || userId == undefined ? null : (
                group && group.map((item, index) => {
                    return (
                        <div className="boxes" key={index}>
                            <Carousel>
                                {item.groupByUserId && item.groupByUserId?.map((item) => {
                                    const strength = item?.strength;
                                    const weakness = item?.weakness;
                                    const target = item?.target;
                                    const month = item?.month;
                                    return (
                                        <Carousel.Item interval={1000000000} >
                                            <div className="box-feedback">
                                                <div className="month">
                                                    <p>Tháng</p>
                                                    <p>{month}</p>
                                                </div>
                                                <div className="feedback">
                                                    <div className="strength">
                                                        <p>Điểm mạnh</p>
                                                        <div>
                                                            {strength.split('\n').map((p, index) => <p key={index}>{p}</p>)}
                                                        </div>
                                                    </div>
                                                    <img className="split" src={split} />
                                                    <div className="weakness">
                                                        <p>Điểm yếu</p>
                                                        <div>
                                                            {weakness.split('\n').map((p, index) => <p key={index}>{p}</p>)}
                                                        </div>
                                                    </div>
                                                    <img className="split" src={split} />
                                                    <div className="target">
                                                        <p>Mục tiêu của tháng</p>
                                                        <div>
                                                            {target.split('\n').map((p, index) => <p key={index}>{p}</p>)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                        </div>
                    )
                })
            )}
        </>
    )
}

export default Feedback;
