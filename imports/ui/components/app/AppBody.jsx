// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component} from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import AppLoginContainer                    from  '../../containers/app/AppLoginContainer.jsx';
import UltrawideAdmin                       from  '../../components/admin/UltrawideAdmin.jsx';
import MainSelectionPage                    from  '../../components/select/MainSelectionPage.jsx';
import EditorContainer                      from  '../../containers/edit/EditorContainer.jsx';
import WaitMessage                          from  './Wait.jsx';

// Ultrawide Services
import {log} from "../../../common/utils";
import {ViewType, LogLevel} from '../../../constants/constants.js'

// Bootstrap

// REDUX services
import {connect} from 'react-redux';

import ConfigurationSettings from "../configure/ConfigurationSettings";


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

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        if(
            nextProps.view !== this.props.view ||
            nextProps.mode !== this.props.mode ||
                nextProps.userViewOptions.devUnitTestsVisible !== this.props.userViewOptions.devUnitTestsVisible
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
    }

    render() {
        const {view, mode, userContext, currentUserMessage} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render App Body for view {}', view);

        // The body rendered depends on the current view
        let bodyHtml = '';

        switch(view){
            case ViewType.AUTHORISE:
                // This is the default when the app starts...
                bodyHtml =
                    <AppLoginContainer params={{
                    }}/>;
                break;
            case ViewType.ADMIN:
                // Go to the User Admin screen
                bodyHtml =
                    <UltrawideAdmin/>;
                break;
            case ViewType.CONFIGURE:
                bodyHtml =
                    <ConfigurationSettings
                        userContext={userContext}
                    />;
                break;
            case ViewType.SELECT:
                bodyHtml =
                    <MainSelectionPage/>;
                break;
            case ViewType.DESIGN_NEW:
            case ViewType.DESIGN_PUBLISHED:
            case ViewType.DESIGN_UPDATABLE:
            case ViewType.DESIGN_UPDATE_EDIT:
            case ViewType.DESIGN_UPDATE_VIEW:
            case ViewType.WORK_PACKAGE_BASE_EDIT:
            case ViewType.WORK_PACKAGE_UPDATE_EDIT:
            case ViewType.WORK_PACKAGE_BASE_VIEW:
            case ViewType.WORK_PACKAGE_UPDATE_VIEW:
             case ViewType.DEVELOP_BASE_WP:
            case ViewType.DEVELOP_UPDATE_WP:
                // Editing Views
                bodyHtml =
                    <EditorContainer params={{
                        userContext: userContext,
                        view: view,
                    }}/>;
                break;
            case ViewType.WAIT:
                // While data is loading
                bodyHtml = <WaitMessage
                    userMessage={currentUserMessage}
                 />
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
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        userViewOptions:        state.currentUserViewOptions,
        currentViewDataValue:   state.currentViewOptionsDataValue,
        currentUserMessage:     state.currentUserMessage,
        testDataFlag:           state.testDataFlag,
        updateScopeFlag:        state.currentUpdateScopeFlag,
        workPackageScopeFlag:   state.currentWorkPackageScopeFlag
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
AppBody = connect(mapStateToProps)(AppBody);

export default AppBody;

