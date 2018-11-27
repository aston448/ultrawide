// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { createContainer }  from 'meteor/react-meteor-data';

// Ultrawide Collections

// Ultrawide GUI Components
import UltrawideItem        from '../../components/item/UltrawideItem.jsx';
import DesignUpdateSummaryContainer from '../summary/UpdateSummaryContainer.jsx';
import ItemList                     from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {DesignVersionStatus, DesignUpdateStatus, RoleType, WorkPackageType, DisplayContext, ItemType, ItemListType, LogLevel, DesignUpdateTab} from '../../../constants/constants.js';
import {AddActionIds} from "../../../constants/ui_context_ids";
import { log } from '../../../common/utils.js';

import { ClientDataServices }           from '../../../apiClient/apiClientDataServices.js';
import { ClientDesignUpdateServices }   from '../../../apiClient/apiClientDesignUpdate.js';
import { ClientWorkPackageServices }    from "../../../apiClient/apiClientWorkPackage";


// Bootstrap
import {Grid, Row, Col, Tabs, Tab} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';


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

        this.state = {
            currentTab: this.props.defaultTab
        }
    }

    componentWillReceiveProps(newProps){

        if(newProps.defaultTab !== this.props.defaultTab){
            this.setState({currentTab: newProps.defaultTab});
        }
    }

    renderDesignUpdatesList(designUpdates){

        if(designUpdates.length > 0) {
            return designUpdates.map((designUpdate) => {
                return (
                    <UltrawideItem
                        key={designUpdate._id}
                        itemType={ItemType.DESIGN_UPDATE}
                        item={designUpdate}
                    />
                );
            });
        }
    }

    renderWorkPackagesList(workPackages){
        if(workPackages.length > 0) {
            return workPackages.map((workPackage) => {
                return (
                    <UltrawideItem
                        key={workPackage._id}
                        itemType={ItemType.WORK_PACKAGE}
                        item={workPackage}
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

    onSelectTab(eventKey){
        this.setState({currentTab: eventKey});
    }

    render() {

        const {incompleteUpdates, assignedUpdates, completeUpdates, updateWorkPackages, designVersionStatus, designUpdateStatus, userRole, userContext, openWpItems} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Design Updates');

        // DU List Header ----------------------------------------------------------------------------------------------

        // A default value...
        let headerText1 = '';
        let headerText2 = '';
        let headerText3 = '';
        let headerText4 = '';

        let tabText1 = '';
        let tabText2 = '';
        let tabText3 = '';

        // DU List Footer ----------------------------------------------------------------------------------------------

        let footerActionFunction = null;
        let hasFooterAction = false;
        let footerAction = '';
        let footerUiContextId = '';

        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE && userRole === RoleType.DESIGNER){

            hasFooterAction = true;
            footerAction = 'Add Design Update';
            footerUiContextId = AddActionIds.UI_CONTEXT_ADD_DESIGN_UPDATE;
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
                footerUiContextId = AddActionIds.UI_CONTEXT_ADD_WORK_PACKAGE;
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

                    tabText1 = 'NEW';
                    headerText1 = 'Updates Needing Work Packages';
                    if(incompleteUpdates.length > 0){

                        bodyDataFunction1 = () => this.renderDesignUpdatesList(incompleteUpdates)

                    } else {

                        bodyDataFunction1 = () => this.displayNote(NO_DESIGN_UPDATES);

                    }

                    tabText2 = 'WORK ASSIGNED';
                    headerText2 = 'Updates With Work Packages';
                    if(assignedUpdates.length > 0){

                        bodyDataFunction2 = () => this.renderDesignUpdatesList(assignedUpdates)

                    } else {

                        bodyDataFunction2 = () => this.displayNote(NO_DESIGN_UPDATES);

                    }

                    tabText3 = 'TEST COMPLETE';
                    headerText3 = 'Updates with Tests Passing';
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
                                    <Col md={4}>
                                        <ItemList
                                            headerText={headerText1}
                                            bodyDataFunction={bodyDataFunction1}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionUiContext={''}
                                            footerActionFunction={null}
                                            listType={ItemListType.ULTRAWIDE_ITEM}
                                        />
                                        <ItemList
                                            headerText={headerText2}
                                            bodyDataFunction={bodyDataFunction2}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionUiContext={''}
                                            footerActionFunction={null}
                                            listType={ItemListType.ULTRAWIDE_ITEM}
                                        />
                                        <ItemList
                                            headerText={headerText3}
                                            bodyDataFunction={bodyDataFunction3}
                                            hasFooterAction={false}
                                            footerAction={''}
                                            footerActionUiContext={''}
                                            footerActionFunction={null}
                                            listType={ItemListType.ULTRAWIDE_ITEM}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <ItemList
                                            headerText={headerText4}
                                            bodyDataFunction={bodyDataFunction4}
                                            hasFooterAction={hasFooterAction}
                                            footerAction={footerAction}
                                            footerActionUiContext={footerUiContextId}
                                            footerActionFunction={footerActionFunction}
                                            listType={ItemListType.ULTRAWIDE_ITEM}
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <DesignUpdateSummaryContainer params={{
                                            userContext: userContext,
                                            displayContext: DisplayContext.WP_SUMMARY
                                        }}/>
                                    </Col>
                                </Row>
                            </Grid>;

                    } else {

                        let activeKey = 2;


                        layout =
                            <Grid>
                                <Row>
                                    <Col md={6}>
                                        <Tabs className="top-tabs" animation={true} unmountOnExit={true} activeKey={this.state.currentTab} id="main_tabs" onSelect={(tab) => this.onSelectTab(tab)}>
                                            <Tab eventKey={DesignUpdateTab.TAB_NEW} title={tabText1}>
                                                <ItemList
                                                    headerText={headerText1}
                                                    bodyDataFunction={bodyDataFunction1}
                                                    hasFooterAction={hasFooterAction}
                                                    footerAction={footerAction}
                                                    footerActionUiContext={footerUiContextId}
                                                    footerActionFunction={footerActionFunction}
                                                    listType={ItemListType.ULTRAWIDE_ITEM}
                                                />
                                            </Tab>
                                            <Tab eventKey={DesignUpdateTab.TAB_ASSIGNED} title={tabText2}>
                                                <ItemList
                                                    headerText={headerText2}
                                                    bodyDataFunction={bodyDataFunction2}
                                                    hasFooterAction={false}
                                                    footerAction={''}
                                                    footerActionUiContext={''}
                                                    footerActionFunction={null}
                                                    listType={ItemListType.ULTRAWIDE_ITEM}
                                                />
                                            </Tab>
                                            <Tab eventKey={DesignUpdateTab.TAB_COMPLETE} title={tabText3}>
                                                <ItemList
                                                    headerText={headerText3}
                                                    bodyDataFunction={bodyDataFunction3}
                                                    hasFooterAction={false}
                                                    footerAction={''}
                                                    footerActionUiContext={''}
                                                    footerActionFunction={null}
                                                    listType={ItemListType.ULTRAWIDE_ITEM}
                                                />
                                            </Tab>
                                        </Tabs>
                                    </Col>
                                    <Col md={6}>
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
    designUpdateStatus:     PropTypes.string.isRequired,
    defaultTab:             PropTypes.string.isRequired
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