// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide GUI Components
import Design           from './Design.jsx';
import DesignVersion    from './DesignVersion.jsx';
import DesignUpdate     from './DesignUpdate.jsx';
import ItemStatus       from './ItemStatus.jsx';
import WorkPackage      from "./WorkPackage.jsx";

// Ultrawide Services
import { ItemType, DesignUpdateStatus, DesignVersionStatus, WorkPackageStatus, WorkPackageTestStatus } from '../../../constants/constants.js';

import ClientDesignVersionServices      from "../../../apiClient/apiClientDesignVersion";
import ClientDesignUpdateServices       from "../../../apiClient/apiClientDesignUpdate";
import ClientWorkPackageServices        from "../../../apiClient/apiClientWorkPackage";
import ClientDesignServices             from '../../../apiClient/apiClientDesign.js';

// Bootstrap
import {Grid, Row, Col, Glyphicon, InputGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';



// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Item Wrapper - The holder for Designs, Design Versions, Design Updates and Work Packages
//
// ---------------------------------------------------------------------------------------------------------------------

export class ItemWrapper extends Component {
    constructor(props) {
        super(props);
    }

    onSelectDesign(userContext, newDesignId){
        ClientDesignServices.setDesign(userContext, newDesignId);
    };

    onSelectDesignVersion(userRole, userContext, dv){

        // Changing the design version updates the user context
        ClientDesignVersionServices.setDesignVersion(
            userContext,
            userRole,
            dv._id,
            false
        );
    }

    onSelectDesignUpdate(userContext, du){

        ClientDesignUpdateServices.setDesignUpdate(
            userContext,
            du._id
        );
    };

    onSelectWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.selectWorkPackage(
            userRole,
            userContext,
            wp
        );
    };


    render() {
        const {itemType, item, userContext, userRole} = this.props;

        if(!item){
            return(<div></div>);
        }

        // Type Selection ----------------------------------------------------------------------------------------------
        let itemName = '';
        let itemStatus = '';
        let statusClass = 'item-status-available';
        let selected = false;
        let itemBody = '';
        let statusIcons = '';
        let onClickFunction = null;
        let uiName = '';

        switch(itemType){

            case ItemType.DESIGN:
                uiName = item.designName;
                itemName = item.designName;
                itemStatus = item.designStatus;
                if(item.isRemovable){
                    statusClass = 'item-status-removable';
                }
                selected = item._id === userContext.designId;
                onClickFunction = () => this.onSelectDesign(userContext, item._id);
                itemBody =
                    <div>
                        <Design
                            design={item}
                            statusClass={statusClass}
                        />
                    </div>;
                break;
            case ItemType.DESIGN_VERSION:
                uiName = item.designVersionName;
                itemName = item.designVersionNumber + ' - ' + item.designVersionName;
                itemStatus = item.designVersionStatus;
                switch(item.designVersionStatus){
                    case DesignVersionStatus.VERSION_NEW:
                        statusClass = 'item-status-new';
                        break;
                    case DesignVersionStatus.VERSION_DRAFT:
                        statusClass = 'item-status-draft';
                        break;
                    case DesignVersionStatus.VERSION_DRAFT_COMPLETE:
                    case DesignVersionStatus.VERSION_UPDATABLE_COMPLETE:
                        statusClass = 'item-status-complete';
                        break;
                    case DesignVersionStatus.VERSION_UPDATABLE:
                        statusClass = 'item-status-updatable';
                        break;
                }
                selected = item._id === userContext.designVersionId;
                onClickFunction = () => this.onSelectDesignVersion(userRole, userContext, item);
                itemBody =
                    <div>
                        <DesignVersion
                            designVersion={item}
                            statusClass={statusClass}
                        />
                    </div>;
                break;
            case ItemType.DESIGN_UPDATE:
                uiName = item.updateName;
                itemName = item.updateReference + ' - ' + item.updateName;
                itemStatus = item.updateStatus;
                switch(item.updateStatus){
                    case DesignUpdateStatus.UPDATE_NEW:
                        statusClass = 'item-status-new';
                        break;
                    case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                        statusClass = 'item-status-draft';
                        break;
                    case DesignUpdateStatus.UPDATE_MERGED:
                        statusClass = 'item-status-complete';
                        break;
                    case DesignUpdateStatus.UPDATE_IGNORED:
                        statusClass = 'item-status-ignored';
                        break;
                }
                selected = item._id === userContext.designUpdateId;
                onClickFunction = () => this.onSelectDesignUpdate(userContext, item);
                itemBody =
                    <div>
                        <DesignUpdate
                            designUpdate={item}
                            statusClass={statusClass}
                        />
                    </div>;

                statusIcons =
                    <InputGroup>
                        <InputGroup.Addon >
                            <div id="updateWpSummary" className={item.updateWpStatus}><Glyphicon glyph='tasks'/></div>
                        </InputGroup.Addon>
                        <InputGroup.Addon >
                            <div id="updateTestSummary" className={item.updateTestStatus}><Glyphicon glyph='th-large'/></div>
                        </InputGroup.Addon>
                        <div></div>
                    </InputGroup>  ;
                break;
            case ItemType.WORK_PACKAGE:
                uiName = item.workPackageName;
                itemName = item.workPackageName;
                itemStatus = item.workPackageStatus;
                switch(item.workPackageStatus){
                    case WorkPackageStatus.WP_NEW:
                        statusClass = 'item-status-new';
                        break;
                    case WorkPackageStatus.WP_AVAILABLE:
                        statusClass = 'item-status-available';
                        break;
                    case WorkPackageStatus.WP_ADOPTED:
                        statusClass = 'item-status-adopted';
                        break;
                }

                // Highlight tests complete WPs
                if(item.workPackageTestStatus === WorkPackageTestStatus.WP_TESTS_COMPLETE){
                    statusClass = 'item-status-complete';
                }

                selected = item._id === userContext.workPackageId;
                onClickFunction = () => this.onSelectWorkPackage(userRole, userContext, item);
                itemBody =
                    <div>
                        <WorkPackage
                            workPackage={item}
                            statusClass={statusClass}
                        />
                    </div>;
                break;
        }

        // Components --------------------------------------------------------------------------------------------------

        let selectedItem = '';
        let unselectedItem = '';

        switch(itemType){
            case ItemType.DESIGN:
            case ItemType.DESIGN_VERSION:
                unselectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row>
                            <Col className={'design-item-name ' + statusClass} md={11}>
                                <div id="designSummary">
                                    {itemName}
                                </div>
                            </Col>
                        </Row>
                    </Grid>;

                selectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row className={statusClass}>
                            <Col className="item-top-left" md={11}>
                                <div>
                                    <ItemStatus
                                        currentItemStatus={itemStatus}
                                        currentItemType={itemType}
                                        itemStatusClass={statusClass}
                                    />
                                </div>
                            </Col>
                            <Col className="item-top-right" md={1}>
                                <div className={'design-item-header header-arrow'}><Glyphicon glyph="hand-right"/></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="item-body" md={11}>
                                {itemBody}
                            </Col>
                        </Row>
                    </Grid>;

                    break;

            case ItemType.DESIGN_UPDATE:

                unselectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row>
                            <Col  className={'design-item-name ' + statusClass} md={11}>
                                <div id="designSummary">
                                    <InputGroup>
                                        <InputGroup.Addon >
                                            <div id="updateWpSummary" className={item.updateWpStatus}><Glyphicon glyph='tasks'/></div>
                                        </InputGroup.Addon>
                                        <InputGroup.Addon >
                                            <div id="updateTestSummary" className={item.updateTestStatus}><Glyphicon glyph='th-large'/></div>
                                        </InputGroup.Addon>
                                        <div>{itemName}</div>
                                    </InputGroup>
                                </div>
                            </Col>
                        </Row>
                    </Grid>;


                selectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row className={statusClass}>
                            <Col className="item-top-left" md={11}>
                                <InputGroup>
                                    <InputGroup.Addon >
                                        <div id="updateWpSummary" className={item.updateWpStatus}><Glyphicon glyph='tasks'/></div>
                                    </InputGroup.Addon>
                                    <InputGroup.Addon >
                                        <div id="updateTestSummary" className={item.updateTestStatus}><Glyphicon glyph='th-large'/></div>
                                    </InputGroup.Addon>
                                    <div>
                                        <ItemStatus
                                            currentItemStatus={itemStatus}
                                            currentItemType={itemType}
                                            itemStatusClass={statusClass}
                                        />
                                    </div>
                                </InputGroup>
                            </Col>
                            <Col className="item-top-right" md={1}>
                                <div className={'design-item-header header-arrow'}><Glyphicon glyph="hand-right"/></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="item-body" md={11}>
                                {itemBody}
                            </Col>
                        </Row>
                    </Grid>;

                    break;

            case ItemType.WORK_PACKAGE:

                unselectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row>
                            <Col className={'design-item-name ' + statusClass} md={11}>
                                <div id="designSummary">
                                    {itemName}
                                </div>
                            </Col>
                        </Row>
                    </Grid>;

                selectedItem =
                    <Grid className="item-grid" onClick={onClickFunction}>
                        <Row className={statusClass}>
                            <Col className="item-top-left" md={11}>
                                <div>
                                    <ItemStatus
                                        currentItemStatus={itemStatus}
                                        currentItemType={itemType}
                                        itemStatusClass={statusClass}
                                        adoptingUserId={item.adoptingUserId}
                                        wpTestStatus={item.workPackageTestStatus}
                                    />
                                </div>
                            </Col>
                            <Col className="item-top-right" md={1}>
                                <div className={'design-item-header header-arrow'}><Glyphicon glyph="hand-right"/></div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="item-body" md={11}>
                                {itemBody}
                            </Col>
                        </Row>
                    </Grid>;

                break;
        }


        // Design Updates have additional status icons
        if(itemType === ItemType.DESIGN_UPDATE){


        }



        // Layout ------------------------------------------------------------------------------------------------------

        if(item) {
            if (selected) {

                return (
                    <div id={uiName}>{selectedItem}</div>
                );

            } else {

                return (
                    <div id={uiName}>{unselectedItem}</div>
                );

            }
        } else {
            return <div></div>;
        }

   }
}

ItemWrapper.propTypes = {
    itemType: PropTypes.string.isRequired,
    item: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext,
        userRole: state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(ItemWrapper);



