// import './DesktopNavigation.css';
// import {ReactComponent as Logo} from './svg/logo.svg';
// import DesktopNavigationLink from '../components/DesktopNavigationLink';
// import CrudButton from '../components/CrudButton';
// import ProfileInfo from '../components/ProfileInfo';

// export default function DesktopNavigation(props) {

//   let button;
//   let profile;
//   let notificationsLink;
//   let messagesLink;
//   let profileLink;
//   if (props.user) {
//     button = <CrudButton setPopped={props.setPopped} />;
//     profile = <ProfileInfo user={props.user} />;
//     notificationsLink = <DesktopNavigationLink 
//       url="/notifications" 
//       name="Notifications" 
//       handle="notifications" 
//       active={props.active} />;
//     messagesLink = <DesktopNavigationLink 
//       url="/messages"
//       name="Messages"
//       handle="messages" 
//       active={props.active} />
//     profileLink = <DesktopNavigationLink 
//       url="/@andrewbrown" 
//       name="Profile"
//       handle="profile"
//       active={props.active} />
//   }

//   return (
//     <nav>
//       <Logo className='logo' />
//       <DesktopNavigationLink url="/" 
//         name="Home"
//         handle="home"
//         active={props.active} />
//       {notificationsLink}
//       {messagesLink}
//       {profileLink}
//       <DesktopNavigationLink url="/#" 
//         name="More" 
//         handle="more"
//         active={props.active} />
//       {button}
//       {profile}
//     </nav>
//   );
// }
import './DesktopNavigation.css';
import { ReactComponent as Logo } from './svg/logo.svg';
import DesktopNavigationLink from '../components/DesktopNavigationLink';
import AddExpenseButton from '../components/AddExpenseButton';
import ProfileInfo from '../components/ProfileInfo';

export default function DesktopNavigation(props) {
  let button;
  let profile;
  let groupsLink;
  let friendsLink;
  let activityLink;
  let accountLink;
  
  // Only show these if user is authenticated
  if (props.user) {
    button = <AddExpenseButton setPopped={props.setPopped} />;
    profile = <ProfileInfo user={props.user} />;
    
    // Always show these links regardless of authentication
    groupsLink = <DesktopNavigationLink 
      url="/groups" 
      name="Groups" 
      handle="groups" 
      active={props.active} />;
    
    friendsLink = <DesktopNavigationLink 
      url="/friends"
      name="Friends"
      handle="friends" 
      active={props.active} />;
    
    activityLink = <DesktopNavigationLink 
      url="/activity" 
      name="Activity"
      handle="activity"
      active={props.active} />;
    
    accountLink = <DesktopNavigationLink 
      url="/account" 
      name="Account"
      handle="account"
      active={props.active} />;
  }

  return (
    <nav>
      <Logo className='logo' />
      <DesktopNavigationLink 
        url="/" 
        name="Home"
        handle="home"
        active={props.active} />
      {groupsLink}
      {friendsLink}
      {activityLink}
      {accountLink}
      {button}
      {profile}
    </nav>
  );
}