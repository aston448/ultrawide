// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignComponentTarget from '../../components/edit/DesignComponentTarget.jsx';
import DesignDevMashContainer from '../dev/DesignDevFeatureMashContainer.jsx';
import DomainDictionaryContainer from './DomainDictionaryContainer.jsx';
import DevFilesContainer from '../dev/DevFilesContainer.jsx';

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
    renderApplications(wpApplications, view, mode, context) {
        return wpApplications.map((application) => {
            return (
                <DesignComponentTarget
                    key={application._id}
                    currentItem={application}
                    designItem={this.getDesignItem(application)}
                    displayContext={context}
                    view={view}
                    mode={mode}
                />
            );

        });
    }


    render() {

        const {wpApplications, featureFiles, userContext, currentItemName, view, mode, viewOptions} = this.props;

        let layout = '';

        // Get the correct display context
        let displayContext = DisplayContext.BASE_VIEW;
        switch(view){
            case ViewType.DEVELOP_BASE_WP:
                displayContext = DisplayContext.BASE_VIEW;
                break;
            case ViewType.DEVELOP_UPDATE_WP:
                displayContext = DisplayContext.UPDATE_VIEW;
                break;
        }

        let designDetails = '';
        let featureTests = '';
        let unitTests = '';
        let devFiles = '';
        let domainDictionary = '';
        let displayedItems = 1;

        // WHAT COMPONENTS ARE VISIBLE (Besides Design)

        // Start by assuming only 2 cols
        let col1width = 6;
        let col2width = 6;
        let col3width = 6;
        let col4width = 6;
        let col5width = 6;
        let col6width = 6;

        // Working Design
        let design =
            <Panel header="Work Package Design" className="panel-update panel-update-body">
                {this.renderApplications(wpApplications, view, mode, DisplayContext.DEV_DESIGN)}
            </Panel>;

        // Details
        if(viewOptions.devDetailsVisible){
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
        if(viewOptions.devAccTestsVisible){
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
                col6width = 4;
            }

            displayedItems++;
        }

        // Unit Tests
        if(viewOptions.devUnitTestsVisible){
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
                    col6width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    break;
            }
            displayedItems++;
        }

        // Feature Files
        if(viewOptions.devFeatureFilesVisible){
            devFiles =
                <Panel header="Build Feature Files" className="panel-update panel-update-body">
                    <DevFilesContainer params={{
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
                    col6width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 3;
                    col4width = 3;
                    col5width = 2;
                    col6width = 3;
            }
            displayedItems++;
        }

        // Domain Dictionary
        if(viewOptions.devDomainDictVisible) {
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
                    col6width = 4;
                    break;
                case 3:
                    // There are now 4 cols so change widths
                    col1width = 3;
                    col2width = 3;
                    col3width = 3;
                    col4width = 3;
                    col5width = 3;
                    col6width = 3;
                    break;
                case 4:
                    // There are now 5 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 3;
                    col4width = 3;
                    col5width = 2;
                    col6width = 2;
                    break;
                case 5:
                    // There are now 6 cols so change widths
                    col1width = 2;
                    col2width = 2;
                    col3width = 2;
                    col4width = 2;
                    col5width = 2;
                    col6width = 2;
                    break;
            }
            displayedItems++;
        }





        // Mash
        // let mash =
        //     <Panel header="Implementation Status" className="panel-update panel-update-body">
        //         <DesignDevMashContainer params={{
        //             userContext: userContext
        //         }}/>
        //     </Panel>;
        //
        // // Files
        // let
        //
        // // Domain Dictionary
        // let domainDictionary =
        //     <DomainDictionaryContainer params={{
        //         designId: userContext.designId,
        //         designVersionId: userContext.designVersionId
        //     }}/>;


        // Create the layout depending on the current view...
        if(wpApplications) {

            let col1 =
                <Col md={col1width} className="scroll-col">
                    {design}
                </Col>;

            let col2 = '';
            if(viewOptions.devDetailsVisible){
                col2 =
                    <Col md={col2width} className="scroll-col">
                        {designDetails}
                    </Col>;
            }

            let col3 = '';
            if(viewOptions.devAccTestsVisible){
                col3 =
                    <Col md={col3width} className="scroll-col">
                        {featureTests}
                    </Col>;
            }

            let col4 = '';
            if(viewOptions.devUnitTestsVisible){
                col4 =
                    <Col md={col4width} className="scroll-col">
                        {unitTests}
                    </Col>;
            }

            let col5 = '';
            if(viewOptions.devFeatureFilesVisible){
                col5 =
                    <Col md={col5width} className="scroll-col">
                        {devFiles}
                    </Col>;
            }

            let col6 = '';
            if(viewOptions.devDomainDictVisible){
                col6 =
                    <Col md={col6width} className="scroll-col">
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
                        {col6}
                    </Row>
                </Grid>;

            return (
                <div>
                    {layout}
                </div>
            );

        } else {

            return (
                <div>
                    No Data
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
        userContext:        state.currentUserItemContext,
        currentItemName:    state.currentDesignComponentName,
        view:               state.currentAppView,
        mode:               state.currentViewMode,
        viewOptions:        state.currentUserViewOptions
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