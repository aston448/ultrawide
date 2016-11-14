// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget            from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd               from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer     from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer        from './DomainDictionaryContainer.jsx';
import DesignDevFeatureMashContainer    from '../dev/DesignDevFeatureMashContainer.jsx';
import DesignDevUnitMashContainer       from '../dev/DesignDevUnitMashContainer.jsx'

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';

import ClientDesignComponentServices    from '../../../apiClient/apiClientDesignComponent.js';
import ClientContainerServices          from '../../../apiClient/apiClientContainerServices.js';

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
class DesignApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    onAddApplication(view, mode, designVersionId){

        // Add a new application to the design
        ClientDesignComponentServices.addApplicationToDesignVersion(view, mode, designVersionId);

    }

    // A list of top level applications in the design / design update
    renderApplications(applications, context, view, mode) {
        return applications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={application}
                    displayContext={context}
                    view={view}
                    mode={mode}
                />
            );

        });
    }

    componentWillReceiveProps(newProps){
        console.log("DESIGN CONTAINER: NEW PROPS")
    }


    render() {

        const {baseApplications, userContext, currentItemName, view, mode, viewOptions} = this.props;

        let layout = '';

        console.log("Rendering applications list with view mode " + mode + " and current item name " + currentItemName);

        let addComponent = '';
        let designDetails = '';
        let featureTests = '';
        let unitTests = '';
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
        }


        if (mode === ViewMode.MODE_EDIT) {
            // Editing so include the Add Application control
            addComponent =
                <table>
                    <tbody>
                    <tr>
                        <td className="control-table-data-app">
                            <DesignComponentAdd
                                addText="Add Application"
                                onClick={ () => this.onAddApplication(view, mode, userContext.designVersionId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // Start by assuming only 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;

        // Details
        if(viewOptions.designDetailsVisible){
            designDetails =
                <DesignComponentTextContainer params={{
                    currentContext: userContext,
                    currentItemName: currentItemName,
                    mode: mode,
                    view: view,
                    displayContext: displayContext
                }}/>;

            displayedItems++;
        }

        // Feature Tests
        if(viewOptions.designAccTestsVisible){
            featureTests =
                <Panel header="Feature Test Implementation" className="panel-update panel-update-body">
                    <DesignDevFeatureMashContainer params={{
                        userContext: userContext
                    }}/>
                </Panel>;

            if(displayedItems == 2){
                // There are now 3 cols so change widths
                col1width = 4;
                col2width = 4;
                col3width = 4;
                col4width = 4;
                col5width = 4;
            }

            displayedItems++;
        }

        // Unit Tests
        if(viewOptions.designUnitTestsVisible){
            unitTests =
                <Panel header="Module Test Implementation" className="panel-update panel-update-body">
                    <DesignDevUnitMashContainer params={{
                        userContext: userContext
                    }}/>
                </Panel>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    break;
            }
            displayedItems++;
        }

        // Domain Dictionary
        if(viewOptions.designDomainDictVisible) {
            domainDictionary =
                <DomainDictionaryContainer params={{
                    designId: userContext.designId,
                    designVersionId: userContext.designVersionId
                }}/>;

            switch(displayedItems){
                case 2:
                    // There are now 3 cols so change widths
                    col1width = 4;
                    col2width = 4;
                    col3width = 4;
                    col4width = 4;
                    col5width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 3;
                    col4width = 3;
                    col5width = 2;
                    break;
            }
            displayedItems++;
        }

        // Create the layout depending on the current view...
        if(baseApplications) {

            // Root of New Design Editor
            let baseEditorComponent =
                <div className="design-editor">
                    {this.renderApplications(baseApplications, displayContext, view, mode)}
                    {addComponent}
                </div>;


            let col1 =
                <Col md={col1width} className="scroll-col">
                    {baseEditorComponent}
                </Col>;

            let col2 = '';
            if(viewOptions.designDetailsVisible){
                col2 =
                    <Col md={col2width} className="scroll-col">
                        {designDetails}
                    </Col>;
            }

            let col3 = '';
            if(viewOptions.designAccTestsVisible){
                col3 =
                    <Col md={col3width} className="scroll-col">
                        {featureTests}
                    </Col>;
            }

            let col4 = '';
            if(viewOptions.designUnitTestsVisible){
                col4 =
                    <Col md={col4width} className="scroll-col">
                        {unitTests}
                    </Col>;
            }

            let col5 = '';
            if(viewOptions.designDomainDictVisible){
                col5 =
                    <Col md={col5width} className="scroll-col">
                        {domainDictionary}
                    </Col>;
            }


            // Make up the layout based on the view options
            layout =
                <Grid >
                    <Row>
                        {col1}
                        {col2}
                        {col3}
                        {col4}
                        {col5}
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
    baseApplications: PropTypes.array.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        currentItemName:        state.currentDesignComponentName,
        view:                   state.currentAppView,
        mode:                   state.currentViewMode,
        viewOptions:            state.currentUserViewOptions,
        currentViewDataValue:   state.currentViewDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignApplicationsList = connect(mapStateToProps)(DesignApplicationsList);


export default EditDesignContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the design
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        null,                       // No design update
        null                        // No work package
    );

}, DesignApplicationsList);