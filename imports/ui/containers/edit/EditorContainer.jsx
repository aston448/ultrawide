// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignEditorHeader           from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter           from '../../components/common/DesignEditorFooter.jsx';
import DesignComponentTarget        from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd           from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer    from './DomainDictionaryContainer.jsx';
import DesignUpdateSummaryContainer from '../summary/UpdateSummaryContainer.jsx';
import MashSelectedItemContainer    from '../mash/MashSelectedItemContainer.jsx';
import ScenarioFinder               from '../../components/search/ScenarioFinder.jsx';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext, ComponentType, LogLevel } from '../../../constants/constants.js';
import {AddActionIds}                       from "../../../constants/ui_context_ids.js";
import { log }                              from '../../../common/utils.js';

import ClientDesignUpdateComponentServices  from '../../../apiClient/apiClientDesignUpdateComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'
import ClientDataServices                   from '../../../apiClient/apiClientDataServices.js';
import ClientUserSettingsServices           from '../../../apiClient/apiClientUserSettings.js';
import EditorContainerUiModules             from '../../../ui_modules/editor_container.js'

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {RoleType} from "../../../constants/constants";


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Editor Container. Contains various editing and view components depending on the view context
//
// ---------------------------------------------------------------------------------------------------------------------

// Export for unit testing
export class EditingWindow extends Component {
    constructor(props) {
        super(props);

    }

    getEditorClass(){
        return ClientUserSettingsServices.getWindowSizeClassForDesignEditor();
    }


    render() {

        const {baseApplications, updateApplications, wpApplications, workingApplications, designSummaryData, userContext, userRole, view, mode, viewOptions} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Editor Container');

        // Items -------------------------------------------------------------------------------------------------------

        // Get correct window height
        const editorClass = this.getEditorClass();


        // Main Editors
        const editors = EditorContainerUiModules.getMainEditors(baseApplications, workingApplications, updateApplications, wpApplications, designSummaryData, userContext, view, mode, viewOptions, editorClass);


        // Layout ------------------------------------------------------------------------------------------------------

        let colWidths = EditorContainerUiModules.calculateColumnWidths(view, mode, viewOptions);

        let layout = EditorContainerUiModules.getLayout(view, userRole, viewOptions, colWidths, editors, userContext);

        return (
            <div>
                {layout}
            </div>
        );


    }
}


EditingWindow.propTypes = {
    baseApplications:       PropTypes.array.isRequired,
    updateApplications:     PropTypes.array.isRequired,
    wpApplications:         PropTypes.array.isRequired,
    workingApplications:    PropTypes.array.isRequired,
    designSummaryData:      PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        viewOptions:            state.currentUserViewOptions,
        testDataFlag:           state.testDataFlag,
        updateScopeFlag:        state.currentUpdateScopeFlag,
        workPackageScopeFlag:   state.currentWorkPackageScopeFlag,
        currentViewDataValue:   state.currentViewOptionsDataValue
    }
}

// Default export with REDUX
export default EditContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the Design Update
    return ClientDataServices.getEditorApplicationData(
        params.userContext,
        params.view
    );

}, connect(mapStateToProps)(EditingWindow));