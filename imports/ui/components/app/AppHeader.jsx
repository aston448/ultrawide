 // == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideMenuItem        from '../common/UltrawideMenuItem.jsx';
import UltrawideMenuDropdown    from '../common/UltrawideMenuDropdown.jsx';
import HeaderMessage            from '../app/HeaderMessage.jsx';

// Ultrawide Services
import {MenuType, MenuDropdown, ViewType, RoleType, LogLevel} from '../../../constants/constants.js';

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

    onGoToRoles(){
        // Back to Roles Screen
        ClientAppHeaderServices.setViewRoles();
    }

    onGoToSelect(){
        // Back to Selection Screen
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
        const rolesItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="ROLES" actionFunction={() => this.onGoToRoles()}/>;
        const selectItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="HOME" actionFunction={() => this.onGoToSelect()}/>;
        const logoutItem = <UltrawideMenuItem menuType={MenuType.MENU_TOP} itemName="Logout" actionFunction={() => this.onLogOut(userContext)}/>;

        let roleClass = '';
        let roleStatusClass = '';
        let viewText = TextLookups.viewText(view);



        // Get current status
        let roleDisplay = userRole;
        let viewDisplay = TextLookups.viewText(view);
        let extra = '';
        let joiner = ' - ';

        if(view === ViewType.SELECT){
            extra = ClientAppHeaderServices.getCurrentDesign(userContext);
        }

        switch(userRole){
            case RoleType.DESIGNER:
                roleClass = 'designer';
                roleStatusClass = 'status-designer';
                break;
            case RoleType.DEVELOPER:
                roleClass = 'developer';
                roleStatusClass = 'status-developer';
                break;
            case RoleType.MANAGER:
                roleClass = 'manager';
                roleStatusClass = 'status-manager';
                break;
            default:
                // Admin user
                roleClass = 'no-role';
                roleDisplay = '';
                joiner = '';
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
                        {rolesItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.ROLES:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {logoutItem}
                    </div>;
                break;

            case ViewType.CONFIGURE:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {rolesItem}
                        {selectItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            // case ViewType.TEST_OUTPUTS:
            //
            //     appHeaderMenuContent =
            //         <div className="top-menu-bar">
            //             {rolesItem}
            //             <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
            //             {logoutItem}
            //         </div>;
            //     break;

            case ViewType.DESIGNS:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {rolesItem}
                        {selectItem}
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.SELECT:

                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {rolesItem}
                        <UltrawideMenuDropdown itemName="Refresh" menuType={MenuDropdown.MENU_DROPDOWN_REFRESH}/>
                        <UltrawideMenuDropdown itemName="Go To" menuType={MenuDropdown.MENU_DROPDOWN_GOTO}/>
                        {logoutItem}
                    </div>;
                break;

            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                appHeaderMenuContent =
                    <div className="top-menu-bar">
                        {rolesItem}
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
                    <div className={'ultrawide-status ' + roleStatusClass}>
                        <span id="headerRole">{roleDisplay}</span>
                        <span>{joiner}</span>
                        <span id="headerView">{viewDisplay}</span>
                        <span>{extra}</span>
                    </div>
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



