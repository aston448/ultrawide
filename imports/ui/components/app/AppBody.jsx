// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppLoginContainer                    from  '../../containers/app/AppLoginContainer.jsx';
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
        const {view, mode, currentUserItemContext} = this.props;

        if(currentUserItemContext) {
            console.log("Rendering App Body.  Current DV = " + currentUserItemContext.designVersionId);
        }

        // The body rendered depends on the current view
        let bodyHtml = '';

        switch(view){
            case ViewType.AUTHORISE:
                // This is the default when the app starts...
                bodyHtml =
                    <AppLoginContainer/>;
                break;
            case ViewType.DESIGNS:
                bodyHtml =
                    <DesignsContainer/>;
                break;
            case ViewType.SELECT:
                bodyHtml =
                    <DesignVersionsContainer params={{
                        currentDesignId: currentUserItemContext.designId
                    }}/>;
                break;
            case ViewType.DESIGN_NEW_EDIT:
            case ViewType.DESIGN_PUBLISHED_VIEW:
                bodyHtml =
                    <EditDesignContainer params={{
                        designVersionId: currentUserItemContext.designVersionId,
                        mode: mode,
                        view: view
                    }}/>;
                break;
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
                // And when user chooses a new design to edit, a published design to view or to edit a design update...
                bodyHtml =
                    <EditDesignUpdateContainer params={{
                        designVersionId: currentUserItemContext.designVersionId,
                        designUpdateId: currentUserItemContext.designUpdateId,
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
                        designVersionId: currentUserItemContext.designVersionId,
                        designUpdateId: currentUserItemContext.designUpdateId,
                        workPackageId: currentUserItemContext.workPackageId,
                        mode: mode,
                        view: view,
                    }}/>;
                break;
            case ViewType.WORK_PACKAGE_WORK:
                // When a Developer decides to work on a Work Package
                bodyHtml =
                    <EditDesignImplementationContainer params={{
                        designVersionId: currentUserItemContext.designVersionId,
                        designUpdateId: currentUserItemContext.designUpdateId,
                        workPackageId: currentUserItemContext.workPackageId,
                        mode: mode,
                        view: view,
                    }}/>;
                break;
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
        currentUserItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AppBody = connect(mapStateToProps)(AppBody);

export default AppBody;

