// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppLoginContainer                    from  '../../containers/app/AppLoginContainer.jsx';
import AppRolesContainer                    from  '../../containers/app/AppRolesContainer.jsx';
import TestOutputsConfigureContainer        from  '../../containers/configure/TestOutputsConfigureContainer.jsx';
import TestOutputsContainer                 from  '../../containers/configure/TestOutputsContainer.jsx';
import DesignsContainer                     from  '../../containers/select/DesignsContainer.jsx';
import DesignVersionsContainer              from  '../../containers/select/DesignVersionsContainer.jsx';
import EditDesignContainer                  from  '../../containers/edit/EditDesignContainer.jsx';
import EditDesignUpdateContainer            from  '../../containers/edit/EditDesignUpdateContainer.jsx';
import EditWorkPackageContainer             from  '../../containers/edit/EditWorkPackageContainer.jsx';
import EditDesignImplementationContainer    from  '../../containers/edit/EditDesignImplementationContainer.jsx';

// Ultrawide Services
import {ViewType} from '../../../constants/constants.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Application Body Component - All the different views go in here
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
class AppBody extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const {view, mode, userContext, userRole} = this.props;

        if(userContext) {
            //console.log("Rendering App Body.  Current DV = " + userContext.designVersionId);
        }

        // The body rendered depends on the current view
        let bodyHtml = '';

        switch(view){
            case ViewType.AUTHORISE:
                // This is the default when the app starts...
                bodyHtml =
                    <AppLoginContainer params={{
                    }}/>;
                break;
            case ViewType.ROLES:
                bodyHtml =
                    <AppRolesContainer params={{
                        userId: userContext.userId
                    }}/>;
                break;
            case ViewType.CONFIGURE:
                bodyHtml =
                    <TestOutputsConfigureContainer params={{
                        userContext: userContext,
                        userRole: userRole
                    }}/>;
                break;
            case ViewType.TEST_OUTPUTS:
                bodyHtml =
                    <TestOutputsContainer params={{
                        userContext: userContext
                    }}/>;
                break;
            case ViewType.DESIGNS:
                bodyHtml =
                    <DesignsContainer/>;
                break;
            case ViewType.SELECT:
                bodyHtml =
                    <DesignVersionsContainer params={{
                        currentDesignId: userContext.designId
                    }}/>;
                break;
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
            case ViewType.DESIGN_UPDATABLE_VIEW:
                bodyHtml =
                    <EditDesignContainer params={{
                        designVersionId: userContext.designVersionId,
                        mode: mode,
                        view: view
                    }}/>;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // And when user chooses a new design to edit, a published design to view or to edit a design update...
                bodyHtml =
                    <EditDesignUpdateContainer params={{
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        mode: mode,
                        view: view
                    }}/>;
                break;
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
                // When manager user decides to edit or view a work package
                bodyHtml =
                    <EditWorkPackageContainer params={{
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        workPackageId: userContext.workPackageId,
                        mode: mode,
                        view: view,
                    }}/>;
                break;
            case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                // When a Developer decides to work on a Work Package
                bodyHtml =
                    <EditDesignImplementationContainer params={{
                        designVersionId: userContext.designVersionId,
                        designUpdateId: userContext.designUpdateId,
                        workPackageId: userContext.workPackageId,
                        mode: mode,
                        view: view,
                    }}/>;
                break;
            case ViewType.WAIT:
                // While data is loading
                bodyHtml = <div></div>
        }

        return (
            <div>
                {bodyHtml}
            </div>
        );

    }
}

AppBody.propTypes = {

};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        view: state.currentAppView,
        mode: state.currentViewMode,
        userContext: state.currentUserItemContext,
        userRole: state.currentUserRole,
        userViewOptions: state.currentUserViewOptions,
        currentViewDataValue: state.currentViewOptionsDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AppBody = connect(mapStateToProps)(AppBody);

export default AppBody;

