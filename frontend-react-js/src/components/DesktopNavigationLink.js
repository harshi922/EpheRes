// import { Link } from "react-router-dom";
// import {ReactComponent as HomeIcon} from './svg/home.svg';
// import {ReactComponent as NotificationsIcon} from './svg/notifications.svg';
// import {ReactComponent as ProfileIcon} from './svg/profile.svg';
// import {ReactComponent as MoreIcon} from './svg/more.svg';
// import {ReactComponent as MessagesIcon} from './svg/messages.svg';

// export default function DesktopNavigationLink(props) {
//   const classes = ()=> {
//     const classes = ['primary']
//     if (props.handle === props.active) {
//       classes.push('active')
//     }
//     return classes.join(' ')
//   }

//   const icon = ()=> {
//     switch(props.handle){
//       case 'home':
//         return <HomeIcon className='icon' />
//         break;
//       case 'notifications':
//         return <NotificationsIcon className='icon' />
//         break;
//       case 'profile':
//         return <ProfileIcon className='icon' />
//         break;
//       case 'more':
//         return <MoreIcon className='icon' />
//         break;
//       case 'messages':
//         return <MessagesIcon className='icon' />
//         break;
//     }
//   }

//   return (
//     <Link to={props.url} className={classes()} href="#">
//       {icon()}
//       <span>{props.name}</span>
//     </Link>
//   );
// }

import { Link } from "react-router-dom";
import {ReactComponent as HomeIcon} from './svg/home.svg';
import {ReactComponent as GroupsIcon} from './svg/notifications.svg';
import {ReactComponent as FriendsIcon} from './svg/messages.svg';
import {ReactComponent as ActivityIcon} from './svg/more.svg';
import {ReactComponent as AccountIcon} from './svg/profile.svg';
// import {ReactComponent as NotificationsIcon} from './svg/notifications.svg';
// import {ReactComponent as ProfileIcon} from './svg/profile.svg';
// import {ReactComponent as MoreIcon} from './svg/more.svg';
// import {ReactComponent as MessagesIcon} from './svg/messages.svg';

export default function DesktopNavigationLink(props) {
  const classes = ()=> {
    const classes = ['primary']
    if (props.handle === props.active) {
      classes.push('active')
    }
    return classes.join(' ')
  }

  const icon = ()=> {
    switch(props.handle){
      case 'home':
        return <HomeIcon className='icon' />
      case 'groups':
        return <GroupsIcon className='icon' />
      case 'friends':
        return <FriendsIcon className='icon' />
      case 'activity':
        return <ActivityIcon className='icon' />
      case 'account':
        return <AccountIcon className='icon' />
      default:
        return null
    }
  }

  return (
    <Link to={props.url} className={classes()} href="#">
      {icon()}
      <span>{props.name}</span>
    </Link>
  );
}