import iconProfile from '../../assets/icon/Profile.svg';

const UserAvatar = ({avatar, teams}) => {
    return (
        <div className='user-avatar'>
            <img src={avatar ? avatar : iconProfile} />
            {teams && teams.length > 0 && (
                <div className='user-teams-icon' title={'team ' + teams[0]}>
                    <img src={teams[0] + '_team.png'} />
                </div>
            )}
        </div>
    )
}

export default UserAvatar;