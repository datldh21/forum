import "./style.scss";

const Status = (props) => {
    const status = props?.status;
    const title = status?.title;
    const color = status?.color;
    
    return (
        <>
            <div style={{borderTopColor: `${color}`}} className="status">
                {title.toUpperCase()}
            </div>
        </>
    )
}

export default Status;