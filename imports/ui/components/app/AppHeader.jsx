 // == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem from '../common/UltrawideMenuItem.jsx';
import UltrawideMenuDropdown from '../common/UltrawideMenuDropdown.jsx';
import HeaderMessage from '../app/HeaderMessage.jsx';

// Ultrawide Services
import {MenuType, MenuDropdown, ViewType, ViewMode, RoleType, LogLevel} from '../../../constants/constants.js';

import TextLookups                      from '../../../common/lookups.js';
import { log }                          from '../../../common/utils.js'

import ClientAppHeaderServices          from '../../../apiClient/apiClientAppHeader.js';
import ClientIdentityServices           from '../../../apiClient/apiIdentity';

 // Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Application Header Component - Main title, context information, menus
//
// ---------------------------------------------------------------------------------------------------------------------

export class AppHeader extends Component {
    constructor(props) {
        super(props);
    }

    handleSelect(eventKey){
        event.preventDefault();

        switch(eventKey){
            case 'KEY_LOGOUT':
                ClientAppHeaderServices.setViewLogin(this.props.userContext);
                break;
        }
    }

    onGoToHome(){
        // Back to Roles Screen
        ClientAppHeaderServices.setViewRoles();
    }

    onGoToSelect(){
        // Back to Roles Screen
        ClientAppHeaderServices.setViewSelection();
    }

    onLogOut(userContext){
        // Back to authorisation view (i.e. log the user out)
        ClientAppHeaderServices.setViewLogin(userContext);
    }

    render() {

        const {mode, view, userRole, userContext, message} = this.props;

        let logo = ClientIdentityServices.getApplicationName();

        let appHeaderMenuContent = <div>Loading</div>;

        // Menu Items
        const homeItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="HOME" actionFunction={() => this.onGoToHome()}/>;
        const selectItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="SELECT" actionFunction={() => this.onGoToSelect()}/>;
        const logoutItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="Logout" actionFunction={() => this.onLogOut(userContext)}/>;

        let roleClass = '';
        let roleStatusClass = '';
        let viewText = TextLookups.viewText(view);

        // Get current status
        let status = '';
        switch(userRole){
            case RoleType.DESIGNER:
                roleClass = 'designer';
                roleStatusClass = 'status-designer';
                status = 'DESIGNER - ' + viewText;
                break;
            case RoleType.DEVELOPER:
                roleClass = 'developer';
                roleStatusClass = 'status-developer';
                status = 'DEVELOPER - ' + viewText;
                break;
            case RoleType.MANAGER:
                roleClass = 'manager';
                roleStatusClass = 'status-manager';
                status = 'MANAGER - ' + viewText;
                break;
            default:
                roleClass = 'no-role';
        }

        // Display the required header for the view
        switch(view){
            case ViewType.AUTHORISE:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                    </div>;
                break;

            case ViewType.ADMIN:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.HOME:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {logoutItem}
                    </div>;
                break;

            case ViewType.CONFIGURE:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.TEST_OUTPUTS:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGNS:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.SELECT:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_VIEW:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        {selectItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        <UltrawideMenuDropdown itemName="View" menuType={MenuDropdown.MENU_DROPDOWN_VIEW}/>
                        <UltrawideMenuDropdown itemName="Refresh" menuType={MenuDropdown.MENU_DROPDOWN_REFRESH}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGN_UPDATE_EDIT:

                if(mode === ViewMode.MODE_VIEW){

                    appHeaderMenuContent =
                        <div className="top-menu-bar">
                            {homeItem}
                            {selectItem}
                            <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                            <UltrawideMenuDropdown itemName="View" menuType={MenuDropdown.MENU_DROPDOWN_VIEW}/>
                            <UltrawideMenuDropdown itemName="Refresh" menuType={MenuDropdown.MENU_DROPDOWN_REFRESH}/>
                            {logoutItem}
                        </div>;

                } else {

                    appHeaderMenuContent =
                        <div className="top-menu-bar">
                            {homeItem}
                            {selectItem}
                            <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                            <UltrawideMenuDropdown itemName="View" menuType={MenuDropdown.MENU_DROPDOWN_VIEW}/>
                            {logoutItem}
                        </div>;
                }
                break;

            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        {selectItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        <UltrawideMenuDropdown itemName="View" menuType={MenuDropdown.MENU_DROPDOWN_VIEW}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {homeItem}
                        {selectItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        <UltrawideMenuDropdown itemName="View" menuType={MenuDropdown.MENU_DROPDOWN_VIEW}/>
                        <UltrawideMenuDropdown itemName="Refresh" menuType={MenuDropdown.MENU_DROPDOWN_REFRESH}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.WAIT:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {logoutItem}
                    </div>;
                break;

            default:
                log((msg) => console.log(msg), LogLevel.ERROR, "Invalid view type: {}", view);
        }

        if (view) {

            return (
                <div className={'ultrawide-header ' + roleClass}>
                    <div className="ultrawide-logo">{logo}</div>
                    <div className={'ultrawide-status ' + roleStatusClass}>{status}</div>
                    <HeaderMessage/>
                    {appHeaderMenuContent}
                </div>
            );
        } else {
            return(
                <div>No Data</div>
            )
        }

    }
}

AppHeader.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {

    return {
        mode:                       state.currentViewMode,
        view:                       state.currentAppView,
        userRole:                   state.currentUserRole,
        userContext:                state.currentUserItemContext,
        message:                    state.currentUserMessage,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(AppHeader);



