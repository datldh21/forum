import "./style.scss";
import split from "../../assets/images/split.svg";

const Category = (props) => {
    const category = props?.category;
    const name = category?.name;
    const description = category?.description;
    const icon = category?.icon;
    const topicCount = category?.topicCount;
    const postCount = category?.postCount;

    return (
        <div className="category">
            <div className="column-1">
                <div className="icon">
                    <img src={icon} />
                </div>
                <div className="text">
                    <div className="name">{name}</div>
                    <div className="description">{description}</div>
                </div>
            </div>
            <div className="column-2">
                <div className="topic-count">
                    <div className="quantity">{topicCount}</div>
                    <div className="topics">TOPICS</div>
                </div>
                <div className="post-count">
                    <div className="quantity">{postCount}</div>
                    <div className="posts">POSTS</div>
                </div>
                <img className="split" src={split} />
            </div>
        </div>
    )
}

export default Category;