import Edit from "./EditPoint";
import Error from "../Error";
import bonusImage from "../../assets/images/Bonus.svg";
import punishImage from "../../assets/images/Punish.svg";
import diamond from "../../assets/images/diamond.svg";
import energy from "../../assets/images/energy.svg";

const HistoryPointTable = (props) => {
    const bonus = props?.bonus;
    const role = props.role;
    const actionShow = props.actionShow;

    const groups =
        bonus &&
        bonus?.reduce((groups, data) => {
            const date = data?.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            const dataGroups = {
                id: data?.id,
                point: data?.point,
                reason: data?.reason,
                name: data?.name,
                position: data?.position,
                role: data?.role,
                userId: data?.userId,
                avatar: data?.avatar,
                imgItem: data?.imgItem,
                hide: data?.hide,
                date: data?.date,
                seen: data?.seen,
            };
            if (dataGroups.bonus != 0) {
                groups[date].push(dataGroups);
            }
            return groups;
        }, {});

    const group =
        groups &&
        Object.keys(groups)?.map((date) => {
            return {
                date,
                groupByDate: groups[date],
            };
        });

    const ActionItem = (props) => {
        return (
            <>
                {role == 1 ? (
                    <Edit
                        id={props.id}
                        reason={props.reason}
                        bonus={props.bonus}
                        userId={props.userId}
                        hide={props.hide}
                    />
                ) : null}
            </>
        );
    };
    return (
        <div className="history-point-table">
            <div className="tab-lists">
                {bonus == null || bonus.length == 0 ? (
                    <Error />
                ) : (
                    group &&
                    group.map((item, index) => {
                        return (
                            <div className="items">
                                {item.groupByDate &&
                                    item.groupByDate?.map((item, index) => {
                                        const point = item?.point;
                                        const reason = item?.reason;
                                        const id = item?.id;
                                        const userId = item?.userId;
                                        const hide = item?.hide;
                                        const date = item?.date;
                                        const seen = item?.seen;
                                        return (
                                            <div className="tab-items">
                                                {reason && (
                                                    <>
                                                        {point > 0 ? (
                                                            <div className="tab-items bonus">
                                                                {!seen && (
                                                                    <div className="dot-notification"></div>
                                                                )}
                                                                <img
                                                                    className="bonus-image"
                                                                    src={bonusImage}
                                                                />
                                                                <div className="bonus-text">
                                                                    <div className="bonus-title">
                                                                        <p>Bạn là nhất, nhất bạn rồi</p>
                                                                    </div>
                                                                    <div className="bonus-reason">
                                                                        {reason}
                                                                    </div>
                                                                </div>
                                                                <div className="bonus-date">
                                                                    {date}
                                                                </div>
                                                                <div className="credit">
                                                                    <img
                                                                        className="diamond"
                                                                        src={diamond}
                                                                    />
                                                                    <div className="bonus-credit">
                                                                        {point}
                                                                    </div>
                                                                </div>
                                                                <div className="point">
                                                                    <img
                                                                        className="energy"
                                                                        src={energy}
                                                                    />
                                                                    <div className="bonus-point">
                                                                        {point}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="tab-items punish">
                                                                {!seen && (
                                                                    <div className="dot-notification"></div>
                                                                )}
                                                                <img
                                                                    className="punish-image"
                                                                    src={punishImage}
                                                                />
                                                                <div className="punish-text">
                                                                    <div className="punish-title">
                                                                        <p>Lần sau cố gắng hơn nhé</p>
                                                                    </div>
                                                                    <div className="punish-reason">
                                                                        {reason}
                                                                    </div>
                                                                </div>
                                                                <div className="punish-date">
                                                                    {date}
                                                                </div>
                                                                <div className="point">
                                                                    <img
                                                                        className="energy"
                                                                        src={energy}
                                                                    />
                                                                    <div className="punish-point">
                                                                        {point}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}

                                                {actionShow && (
                                                    <ActionItem
                                                        id={id}
                                                        bonus={point}
                                                        reason={reason}
                                                        userId={userId}
                                                        hide={hide}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default HistoryPointTable;