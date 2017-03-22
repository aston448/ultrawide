// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignEditorHeader               from '../../components/common/DesignEditorHeader.jsx';
import DesignEditorFooter               from '../../components/common/DesignEditorFooter.jsx';
import DesignComponentTarget            from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd               from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer     from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer        from './DomainDictionaryContainer.jsx';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';

import ClientDesignComponentServices        from '../../../apiClient/apiClientDesignComponent.js';
import ClientContainerServices              from '../../../apiClient/apiClientContainerServices.js';
import ClientWorkPackageComponentServices   from '../../../apiClient/apiClientWorkPackageComponent.js';
import ClientDesignVersionServices          from '../../../apiClient/apiClientDesignVersion.js'

// Bootstrap
import {Grid, Row, Col, Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Editor Container. Starts by rendering a list of Applications in the Design plus the text view and domain dictionary
//
// ---------------------------------------------------------------------------------------------------------------------

// Design Applications Container
// Export this for Unit Tests
export class DesignApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    onAddApplication(view, mode, designVersionId){

        // Add a new application to the design
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersionId);

    }

    getDesignItem(application, displayContext){
        // Design Item needed only in WP context (otherwise we already have it as the current item)
        if(displayContext === DisplayContext.WP_SCOPE || displayContext === DisplayContext.WP_VIEW || displayContext === DisplayContext.DEV_DESIGN) {
            return ClientWorkPackageComponentServices.getDesignItem(application.componentId, application.workPackageType);
        } else {
            return application;
        }
    }

    getDesignUpdateItem(application, displayContext){
        if(displayContext === DisplayContext.UPDATABLE_VIEW){
            return ClientDesignVersionServices.getDesignUpdateItem(application);
        } else {
            return null;
        }
    }

    // A list of top level applications in the design / design update
    renderApplications(applications, displayContext, view, mode, testSummary) {
        return applications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application, displayContext)}
                    updateItem={this.getDesignUpdateItem(application, displayContext)}
                    displayContext={displayContext}
                    view={view}
                    mode={mode}
                    testSummary={testSummary}
                />
            );

        });
    }

    componentWillReceiveProps(newProps){
        //console.log("DESIGN CONTAINER: NEW PROPS")
    }


    render() {

        const {baseApplications, designSummaryData, userContext, view, mode, viewOptions} = this.props;

        let layout = '';

        let addComponent = '';
        let designDetails = '';
        let domainDictionary = '';
        let displayedItems = 1;

        // Get the correct display context
        let displayContext = DisplayContext.BASE_VIEW;
        switch(view){
            case ViewType.DESIGN_NEW_EDIT:
                displayContext = DisplayContext.BASE_EDIT;
                break;
            case ViewType.DESIGN_PUBLISHED_VIEW:
                displayContext = DisplayContext.BASE_VIEW;
                break;
            case ViewType.DESIGN_UPDATABLE_VIEW:
                displayContext = DisplayContext.UPDATABLE_VIEW;
                break;
        }

        // Items ------------------------------------------------------------------------------------------------------

        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application control
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td id="addApplication" className="control-table-data-app">
                            <DesignComponentAdd
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, userContext.designVersionId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        let designEditor =
            <div className="design-editor-container">
                <DesignEditorHeader
                    displayContext={displayContext}
                />
                <div className="design-editor">
                    {this.renderApplications(baseApplications, displayContext, view, mode, viewOptions.designTestSummaryVisible)}
                    {addComponent}
                </div>
                <DesignEditorFooter
                    hasDesignSummary={true}
                    designSummaryData={designSummaryData}
                />
            </div>;

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // Start by assuming only 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;

        // Details
        if(viewOptions.designDetailsVisible){
            designDetails =
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    view: view,
                    displayContext: displayContext
                }}/>;

            displayedItems++;
        }

        // Domain Dictionary
        if(viewOptions.designDomainDictVisible) {
            domainDictionary =
                <DomainDictionaryContainer params={{
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId
                }}/>;

            if(displayedItems == 2){
                // There are now 3 cols so change widths
                col1width = 4;
                col2width = 4;
                col3width = 4;
            }

            displayedItems++;
        }

        // Test Summary - this actually just makes col 1 wider
        if(viewOptions.designTestSummaryVisible){

            switch(displayedItems){
                case 1:
                    // Col 1 gets bigger
                    col1width = 12;
                    col2width = 0;
                    col3width = 0;
                    break;
                case 2:
                    // Col 1 gets bigger
                    col1width = 8;
                    col2width = 4;
                    col3width = 4;
                    break;
                case 3:
                    // Col 1 gets bigger
                    col1width = 6;
                    col2width = 3;
                    col3width = 3;
                    break;
            }
        }

        // Layout ------------------------------------------------------------------------------------------------------

        // Create the layout depending on the current view...
        if(baseApplications) {

            // Root of New Design Editor
            // let baseEditorComponent =
            //     <div className="design-editor">
            //         {this.renderApplications(baseApplications, displayContext, view, mode, viewOptions.designTestSummaryVisible)}
            //         {addComponent}
            //     </div>;


            let col1 =
                <Col id="column1" md={col1width} className="close-col">
                    {designEditor}
                </Col>;


            // Optional display columns
            let col2 = '';
            if(viewOptions.designDetailsVisible){
                col2 =
                    <Col id="column2" md={col2width} className="close-col">
                        {designDetails}
                    </Col>;
            }


            let col3 = '';
            if(viewOptions.designDomainDictVisible){
                col3 =
                    <Col id="column3" md={col3width} className="close-col">
                        {domainDictionary}
                    </Col>;
            }


            // Make up the layout based on the view options
            layout =
                <Grid >
                    {/*<Row>*/}
                        {/*{designSummary}*/}
                    {/*</Row>*/}
                    <Row>
                        {col1}
                        {col2}
                        {col3}
                    </Row>
                </Grid>;

            return (
                <div>
                    {layout}
                </div>
            );

        } else {
            // No apps yet so just return the add new item (if there is one)
            return (
                <div>
                    {addComponent}
                </div>
            );
        }


    }
}


DesignApplicationsList.propTypes = {
    baseApplications: PropTypes.array.isRequired,
    designSummaryData: PropTypes.object
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        viewOptions:            state.currentUserViewOptions,
        currentViewDataValue:   state.currentViewDataValue
    }
}

// Export the full wrapped Redux Container as default
export default EditDesignContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the design
    return ClientContainerServices.getEditorApplicationData(
        params.userContext,
        params.view,
    );

}, connect(mapStateToProps)(DesignApplicationsList));