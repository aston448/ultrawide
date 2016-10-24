// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';
import DesignDevMashContainer from '../dev/DesignDevMashContainer.jsx';
import DomainDictionaryContainer from './DomainDictionaryContainer.jsx';

// Ultrawide Services
import { ComponentType, ViewType, ViewMode, DisplayContext } from '../../../constants/constants.js';
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design implememtation Editor Container. This contains the part of the design being worked on and its implementation progress
//
// ---------------------------------------------------------------------------------------------------------------------

class DevApplicationsList extends Component {
    constructor(props) {
        super(props);

    }

    getDesignItem(application){
        return ClientWorkPackageServices.getDesignItem(application.componentId, application.workPackageType)
    }

    // A list of top level applications in the work package(s)
    renderApplications(wpApplications, view, context) {
        return wpApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                />
            );

        });
    }


    render() {

        const {wpApplications, featureFiles, userContext, currentItemName, view, mode, domainDictionaryVisible} = this.props;

        let layout = '';

        // Working Design
        let design =
            <Panel header="Work Package Design" className="panel-update panel-update-body">
                {this.renderApplications(wpApplications, view, DisplayContext.DEV_DESIGN)}
            </Panel>;

        // Mash
        let mash =
            <Panel header="Implementation Status" className="panel-update panel-update-body">
                <DesignDevMashContainer params={{
                    userContext: userContext
                }}/>
            </Panel>;

        // Files
        let devFiles =
            <Panel header="Build Feature Files" className="panel-update panel-update-body">

            </Panel>;

        // Domain Dictionary
        let domainDictionary =
            <DomainDictionaryContainer params={{
                designId: userContext.designId,
                designVersionId: userContext.designVersionId
            }}/>;


        // Create the layout depending on the current view...
        if(wpApplications) {

            if(domainDictionaryVisible) {
                // Layout is DESIGN | DESIGN MASH | DEV MASH | DEV FILES | DICTIONARY
                layout =
                    <Grid>
                        <Row>
                            <Col md={2} className="scroll-col">
                                {design}
                            </Col>
                            <Col md={5}>
                                {mash}
                            </Col>
                            <Col md={2} className="scroll-col">
                                {devFiles}
                            </Col>
                            <Col md={3} className="scroll-col">
                                {domainDictionary}
                            </Col>
                        </Row>
                    </Grid>;

            } else {
                // Layout is DESIGN | DESIGN MASH | DEV MASH | DEV FILES
                layout =
                    <Grid>
                        <Row>
                            <Col md={3} className="scroll-col">
                                {design}
                            </Col>
                            <Col md={6}>
                                {mash}
                            </Col>
                            <Col md={3} className="scroll-col">
                                {devFiles}
                            </Col>
                        </Row>
                    </Grid>;

            }

            return (
                <div>
                    {layout}
                </div>
            );

        } else {

            return (
                <div>
                </div>
            );
        }


    }
}


DevApplicationsList.propTypes = {
    wpApplications: PropTypes.array.isRequired,
    featureFiles:   PropTypes.array.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        currentItemName: state.currentDesignComponentName,
        view: state.currentAppView,
        mode: state.currentViewMode,
        domainDictionaryVisible: state.domainDictionaryVisible
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DevApplicationsList = connect(mapStateToProps)(DevApplicationsList);


export default EditDesignImplementationContainer = createContainer(({params}) => {

    // The editor container will start by rendering a list of Applications in the relevant work package
    return ClientContainerServices.getEditorApplicationData(
        params.view,
        params.designVersionId,
        params.designUpdateId,
        params.workPackageId
    );


}, DevApplicationsList);