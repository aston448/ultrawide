// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';
import DesignComponentAdd from '../../components/common/DesignComponentAdd.jsx';
import DesignComponentTextContainer from './DesignComponentTextContainer.jsx';
import DomainDictionaryContainer from './DomainDictionaryContainer.jsx';

// Ultrawide Services
import { ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';
import ClientDesignComponentServices from '../../../apiClient/apiClientDesignComponent.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';

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
    renderApplications(applications, context) {
        return applications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    displayContext={context}
                />
            );

        });
    }


    render() {

        const {baseApplications, currentUserItemContext, currentItemName, view, mode, domainDictionaryVisible} = this.props;

        let layout = '';

        console.log("Rendering applications list with view mode " + mode + " and current item name " + currentItemName);

        let addComponent = '';

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
                                onClick={ () => this.onAddApplication(view, mode, currentUserItemContext.designVersionId)}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>
        }

        // Domain Dictionary
        let domainDictionary =
            <DomainDictionaryContainer params={{
                designId: currentUserItemContext.designId,
                designVersionId: currentUserItemContext.designVersionId
            }}/>;

        // Create the layout depending on the current view...
        if(baseApplications) {

            // Root of New Design Editor
            let baseEditorComponent =
                <div className="design-editor">
                    {this.renderApplications(baseApplications, displayContext)}
                    {addComponent}
                </div>;

            // Text and Scenario Steps for new design edit
            let textContainer =
                <DesignComponentTextContainer params={{
                    currentContext: currentUserItemContext,
                    currentItemName: currentItemName,
                    mode: mode,
                    view: view,
                    displayContext: displayContext
                }}/>;

            if(domainDictionaryVisible){
                // Layout is DESIGN | TEXT | DICTIONARY
                layout =
                    <Grid >
                        <Row>
                            <Col md={4} className="scroll-col">
                                {baseEditorComponent}
                            </Col>
                            <Col md={4}>
                                {textContainer}
                            </Col>
                            <Col md={4}>
                                {domainDictionary}
                            </Col>
                        </Row>
                    </Grid>;
            } else {
                // Layout is DESIGN | TEXT
                layout =
                    <Grid>
                        <Row>
                            <Col md={6} className="scroll-col">
                                {baseEditorComponent}
                            </Col>
                            <Col md={6}>
                                {textContainer}
                            </Col>
                        </Row>
                    </Grid>;
            }

            // Return the list + add new item
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
        currentUserItemContext: state.currentUserItemContext,
        currentItemName: state.currentDesignComponentName,
        view: state.currentAppView,
        mode: state.currentViewMode,
        domainDictionaryVisible: state.domainDictionaryVisible
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