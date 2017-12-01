// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import DesignUpdate                 from '../../components/select/DesignUpdate.jsx';
import WorkPackage                  from '../../components/select/WorkPackage.jsx';
import DesignUpdateSummaryContainer from '../../containers/summary/UpdateSummaryContainer.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, RoleType, WorkPackageType, DisplayContext, LogLevel} from '../../../constants/constants.js';

import ClientDataServices      from '../../../apiClient/apiClientDataServices.js';
import ClientDesignUpdateServices   from '../../../apiClient/apiClientDesignUpdate.js';
import { log } from '../../../common/utils.js';

// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import ClientWorkPackageServices from "../../../apiClient/apiClientWorkPackage";

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Data Container - gets data for Design Updates in a Design Version
//
// ---------------------------------------------------------------------------------------------------------------------


// Unit test export
export class DesignUpdatesList extends Component {
    constructor(props) {
        super(props);

    }

    renderDesignUpdatesList(designUpdates){

        if(designUpdates.length > 0) {
            return designUpdates.map((designUpdate) => {
                return (
                    <DesignUpdate
                        key={designUpdate._id}
                        designUpdate={designUpdate}
                    />
                );
            });
        }
    }

    renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <WorkPackage
                        key={workPackage._id}
                        workPackage={workPackage}
                    />
                );
            });
        }
    }

    displayNote(noteText){
        return <div className="design-item-note">{noteText}</div>;
    }

    onAddDesignUpdate(userRole, designVersionId){
        // Adds a new update and populates a set of design update components for editing
        ClientDesignUpdateServices.addNewDesignUpdate(userRole, designVersionId)
    }

    onAddWorkPackage(userRole, userContext, wpType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, wpType, openWpItems);

    }

    getDesignUpdateRef(designUpdateId){

        return ClientDesignUpdateServices.getDesignUpdateRef(designUpdateId);
    }


    render() {

        const {incompleteUpdates, assignedUpdates, completeUpdates, updateWorkPackages, designVersionStatus, designUpdateStatus, userRole, userContext, openWpItems} = this.props;


        // DU List Header ----------------------------------------------------------------------------------------------

        // A default value...
        let headerText1 = '';
        let headerText2 = '';
        let headerText3 = '';
        let headerText4 = '';

        // DU List Footer ----------------------------------------------------------------------------------------------

        let footerActionFunction = null;
        let hasFooterAction = false;
        let footerAction = '';

        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE && userRole === RoleType.DESIGNER){

            hasFooterAction = true;
            footerAction = 'Add Design Update';
            footerActionFunction = () => this.onAddDesignUpdate(userRole, userContext.designVersionId);
        }

        if((designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE ||  designVersionStatus === DesignVersionStatus.VERSION_DRAFT)
            && userRole === RoleType.MANAGER
            && userContext.designUpdateId !== 'NONE'
        ){
            // Only can add WPs to published DUs
            if(designUpdateStatus === DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT) {
                hasFooterAction = true;
                footerAction = 'Add Work Package';
                footerActionFunction = () => this.onAddWorkPackage(userRole, userContext, WorkPackageType.WP_UPDATE, openWpItems);
            }
        }


        // DU List Body ------------------------------------------------------------------------------------------------

        const NO_DESIGN_UPDATES = 'No Design Updates';
        const NO_WORK_PACKAGES = 'No Work Packages for this Update';
        const SELECT_DESIGN_VERSION = 'Select a Design Version';
        const SELECT_DESIGN_UPDATE = 'Select a Design Update';

        let bodyDataFunction1 = () => this.displayNote(SELECT_DESIGN_VERSION);
        let bodyDataFunction2 = () => this.displayNote('');
        let bodyDataFunction3 = () => this.displayNote('');
        let bodyDataFunction4 = () => this.displayNote(SELECT_DESIGN_UPDATE);


        // Layout ------------------------------------------------------------------------------------------------------
        let layout = <div></div>;

        // The content depends on what sort of Design Version has been selected
        if(designVersionStatus) {

            switch (designVersionStatus) {

                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    headerText1 = 'Updates Needing Work Packages';
                    if(incompleteUpdates.length > 0){

                        bodyDataFunction1 = () => this.renderDesignUpdatesList(incompleteUpdates)

                    } else {

                        bodyDataFunction1 = () => this.displayNote(NO_DESIGN_UPDATES);

                    }

                    headerText2 = 'Updates With Work Packages';
                    if(assignedUpdates.length > 0){

                        bodyDataFunction2 = () => this.renderDesignUpdatesList(assignedUpdates)

                    } else {

                        bodyDataFunction2 = () => this.displayNote(NO_DESIGN_UPDATES);

                    }

                    headerText3 = 'Updates Completed';
                    if(completeUpdates.length > 0){

                        bodyDataFunction3 = () => this.renderDesignUpdatesList(completeUpdates)

                    } else {

                        bodyDataFunction3 = () => this.displayNote(NO_DESIGN_UPDATES);

                    }

                    if(userRole === RoleType.MANAGER){

                        headerText4 = 'Work Packages for ' + this.getDesignUpdateRef(userContext.designUpdateId);
                        if(updateWorkPackages.length > 0){

                            bodyDataFunction4 = () => this.renderWorkPackagesList(updateWorkPackages)

                        } else {
                            if(userContext.designUpdateId === 'NONE'){
                                bodyDataFunction4 = () => this.displayNote(SELECT_DESIGN_UPDATE);
                            } else {
                                bodyDataFunction4 = () => this.displayNote(NO_WORK_PACKAGES);
                            }


                        }

                        layout =
                            <Grid>
                                <Row>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText1}
                                            bodyDataFunction={bodyDataFunction1}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionFunction={null}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText2}
                                            bodyDataFunction={bodyDataFunction2}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionFunction={null}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText3}
                                            bodyDataFunction={bodyDataFunction3}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionFunction={null}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText4}
                                            bodyDataFunction={bodyDataFunction4}
                                            hasFooterAction={hasFooterAction}
                                            footerAction={footerAction}
                                            footerActionFunction={footerActionFunction}
                                        />
                                    </Col>
                                </Row>
                            </Grid>;

                    } else {

                        layout =
                            <Grid>
                                <Row>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText1}
                                            bodyDataFunction={bodyDataFunction1}
                                            hasFooterAction={hasFooterAction}
                                            footerAction={footerAction}
                                            footerActionFunction={footerActionFunction}
                                        />
                                    </Col>
                                    <Col md={3}>
                                        <ItemContainer
                                            headerText={headerText2}
                                            bodyDataFunction={bodyDataFunction2}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionFunction={null}
                                        />
                                    </Col>
                                    <Col md={2}>
                                        <ItemContainer
                                            headerText={headerText3}
                                            bodyDataFunction={bodyDataFunction3}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionFunction={null}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <DesignUpdateSummaryContainer params={{
                                            userContext: userContext,
                                            displayContext: DisplayContext.UPDATE_SUMMARY
                                        }}/>
                                    </Col>
                                </Row>
                            </Grid>;
                    }

                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        }

        return (
            <div>
                {layout}
            </div>
        );
    }
}

DesignUpdatesList.propTypes = {
    incompleteUpdates:      PropTypes.array.isRequired,
    assignedUpdates:        PropTypes.array.isRequired,
    completeUpdates:        PropTypes.array.isRequired,
    updateWorkPackages:     PropTypes.array.isRequired,
    designVersionStatus:    PropTypes.string.isRequired,
    designUpdateStatus:     PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext,
        openWpItems:    state.currentUserOpenWorkPackageItems
    }
}

// Default export including REDUX
export default DesignUpdatesContainer = createContainer(({params}) => {

    return ClientDataServices.getDesignUpdatesForCurrentDesignVersion(params.designVersionId);

}, connect(mapStateToProps)(DesignUpdatesList));