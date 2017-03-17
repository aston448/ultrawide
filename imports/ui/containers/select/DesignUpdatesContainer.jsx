// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignUpdate                 from '../../components/select/DesignUpdate.jsx';
import DesignComponentAdd           from '../../components/common/DesignComponentAdd.jsx';
import UpdateSummaryContainer       from './UpdateSummaryContainer.jsx';
import WorkPackagesContainer        from './WorkPackagesContainer.jsx';
import ItemContainer                from '../../components/common/ItemContainer.jsx';

// Ultrawide Services
import {DesignVersionStatus, RoleType, WorkPackageType, LogLevel} from '../../../constants/constants.js';
import ClientContainerServices from '../../../apiClient/apiClientContainerServices.js';
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import { log } from '../../../common/utils.js';

// Bootstrap
import {Grid, Row, Col, Button, ButtonGroup} from 'react-bootstrap';
import {Panel} from 'react-bootstrap';

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

    renderAllDesignUpdateLists(){

        return [
            this.renderDesignUpdatesList(this.props.newUpdates),
            this.renderDesignUpdatesList(this.props.draftUpdates),
            this.renderDesignUpdatesList(this.props.mergedUpdates),
            this.renderDesignUpdatesList(this.props.ignoredUpdates)
        ]
    }

    displayNote(noteText){
        return <div className="design-item-note">{noteText}</div>;
    }

    onAddDesignUpdate(userRole, designVersionId){
        // Adds a new update and populates a set of design update components for editing
        ClientDesignUpdateServices.addNewDesignUpdate(userRole, designVersionId)
    }

    render() {

        const {newUpdates, draftUpdates, mergedUpdates, ignoredUpdates, designVersionStatus, userRole, userContext} = this.props;

        // Elements ----------------------------------------------------------------------------------------------------

        // Initial Design Work Packages List
        const baseWorkPackages =
            <div id="baseWps">
                <WorkPackagesContainer params={{
                    wpType: WorkPackageType.WP_BASE,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId
                }}/>
            </div>;

        // Design Update Work Packages List
        const updateWorkPackages =
            <div id="updateWps">
                <WorkPackagesContainer params={{
                    wpType: WorkPackageType.WP_UPDATE,
                    designVersionId: userContext.designVersionId,
                    designUpdateId: userContext.designUpdateId
                }}/>
            </div>;

        // Design Update Summary
        const updateSummary =
              <div id="updateSummary">
                  <UpdateSummaryContainer params={{
                      designUpdateId: userContext.designUpdateId
                  }}/>
              </div>;

        // DU List Header ----------------------------------------------------------------------------------------------

        // A default value...
        let headerText = 'Design Version Data';

        // DU List Footer ----------------------------------------------------------------------------------------------

        let footerActionFunction = null;
        let hasFooterAction = false;
        const footerAction = 'Add Design Update';

        if(designVersionStatus === DesignVersionStatus.VERSION_UPDATABLE && userRole === RoleType.DESIGNER){

            hasFooterAction = true;
            footerActionFunction = () => this.onAddDesignUpdate(userRole, userContext.designVersionId);
        }


        // DU List Body ------------------------------------------------------------------------------------------------

        const NO_DESIGN_UPDATES = 'No Design Updates';
        const SELECT_DESIGN_VERSION = 'Select a Design Version';

        let bodyDataFunction = () => this.displayNote(SELECT_DESIGN_VERSION);

        // Layout ------------------------------------------------------------------------------------------------------

        // Default layout if no data
        let layout =
            <Grid>
                <Row>
                    <Col md={6}>
                        <ItemContainer
                            headerText={headerText}
                            bodyDataFunction={bodyDataFunction}
                            hasFooterAction={hasFooterAction}
                            footerAction={footerAction}
                            footerActionFunction={footerActionFunction}
                        />
                    </Col>
                </Row>
            </Grid>;

        // The content depends on what sort of Design Version has been selected
        if(designVersionStatus) {

            switch (designVersionStatus) {
                case DesignVersionStatus.VERSION_NEW:
                case DesignVersionStatus.VERSION_DRAFT:
                case DesignVersionStatus.VERSION_DRAFT_COMPLETE:

                    // No Updates.  Just show the Work Packages
                    layout =
                        <Grid>
                            <Row>
                                <Col md={6}>
                                    {baseWorkPackages}
                                </Col>
                            </Row>
                        </Grid>;
                    break;

                case DesignVersionStatus.VERSION_UPDATABLE:
                case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:

                    if(newUpdates.length === 0 && draftUpdates.length === 0 && mergedUpdates.length === 0 && ignoredUpdates.length === 0){

                        bodyDataFunction = () => this.displayNote(NO_DESIGN_UPDATES);

                    } else {

                        headerText = 'Design Updates';
                        bodyDataFunction = () => this.renderAllDesignUpdateLists()

                    }

                    layout =
                        <Grid>
                            <Row>
                                <Col md={3}>
                                    <ItemContainer
                                        headerText={headerText}
                                        bodyDataFunction={bodyDataFunction}
                                        hasFooterAction={hasFooterAction}
                                        footerAction={footerAction}
                                        footerActionFunction={footerActionFunction}
                                    />
                                </Col>
                                <Col md={3}>
                                    {updateWorkPackages}
                                </Col>
                                <Col md={6}>
                                    {updateSummary}
                                </Col>
                            </Row>
                        </Grid>;

                    break;

                default:
                    log((msg) => console.log(msg), LogLevel.ERROR, "Unknown Design Version Status: {}", designVersionStatus);
            }
        }

        return (
            layout
        );
    }
}

DesignUpdatesList.propTypes = {
    newUpdates:             PropTypes.array.isRequired,
    draftUpdates:           PropTypes.array.isRequired,
    mergedUpdates:          PropTypes.array.isRequired,
    ignoredUpdates:         PropTypes.array.isRequired,
    designVersionStatus:    PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:       state.currentUserRole,
        userContext:    state.currentUserItemContext
    }
}

// Default export including REDUX
export default DesignUpdatesContainer = createContainer(({params}) => {

    return ClientContainerServices.getDesignUpdatesForCurrentDesignVersion(params.currentDesignVersionId);

}, connect(mapStateToProps)(DesignUpdatesList));