import {
    DesignUpdateStatus,
    DesignVersionStatus,
    ItemType,
    LogLevel,
    WorkPackageStatus,
    WorkPackageTestStatus
} from "../constants/constants";

import { UI }           from "../constants/ui_context_ids";

import Design           from '../ui/components/select/Design.jsx';
import DesignVersion    from '../ui/components/select/DesignVersion.jsx';
import DesignUpdate     from '../ui/components/select/DesignUpdate.jsx';
import WorkPackage      from "../ui/components/select/WorkPackage.jsx";

import {ItemStatusUiModules}            from "./item_status";
import {ClientWorkPackageServices}      from "../apiClient/apiClientWorkPackage";
import {ClientDesignServices}           from "../apiClient/apiClientDesign";
import {ClientDesignUpdateServices}     from "../apiClient/apiClientDesignUpdate";
import {ClientDesignVersionServices}    from "../apiClient/apiClientDesignVersion";

import { TextLookups } from '../common/lookups.js';
import {log, getContextID, replaceAll} from "../common/utils";

import React from 'react';

// Bootstrap
import {Grid, Row, Col, Glyphicon, InputGroup} from 'react-bootstrap';


class UltrawideItemUiModulesClass {

    // MAIN API --------------------------------------------------------------------------------------------------------

    // This function is fully module testable with enzyme render().  It has no REDUX sub-components.
    getComponentLayout(uwItemType, itemData, userContext, userRole, isSelectable){

        let uiName = '';

        switch(uwItemType){
            case ItemType.DESIGN:
                uiName = getContextID(UI.ITEM_DESIGN, itemData.designName);
                break;
            case ItemType.DESIGN_VERSION:
                uiName = getContextID(UI.ITEM_DESIGN_VERSION, itemData.designVersionName);
                break;
            case ItemType.DESIGN_UPDATE:
                uiName = getContextID(UI.ITEM_DESIGN_UPDATE, itemData.updateName);
                break;
            case ItemType.WORK_PACKAGE:
                uiName = getContextID(UI.ITEM_WORK_PACKAGE, itemData.workPackageName);
                break;
        }

        // Return a generically named item
        return (
            <div id={uiName}>
                {this.getSelectedUnselectedLayout(uwItemType, itemData, userContext, userRole, isSelectable)}
            </div>
        );

    }

    getSelectedUnselectedLayout(uwItemType, itemData, userContext, userRole, isSelectable){

        // Get the visualisation data required for this component in its current state
        const viewData = this.getVisualisationData(uwItemType, itemData, userContext, userRole);

        // Get the action required when this item is selected
        const selectFunction =  this.getSelectionAction(uwItemType, itemData, userContext, userRole);

        // And return ether selected or unselected HTML
        if(viewData.selected){

            return(
                <div id={getContextID(UI.UW_ITEM_SELECTED, viewData.uiName)}>
                    {this.selectedLayout(uwItemType, selectFunction, viewData.statusClass, viewData.itemName, itemData, userContext, userRole, viewData.uiName)}
                </div>
            );

        } else {

            return(
                <div id={getContextID(UI.UW_ITEM_UNSELECTED, viewData.uiName)}>
                    {this.unselectedLayout(uwItemType, selectFunction, viewData.statusClass, viewData.itemName, itemData, viewData.uiName, isSelectable)}
                </div>
            )
        }
    }

    updateRequired(nextProps, props, nextState, state){

        let shouldUpdate = false;

        let itemStatusNew = '';
        let itemStatusOld = '';
        let itemNameNew = '';
        let itemNameOld = '';
        let itemRefNew = '';
        let itemRefOld = '';

        if(nextState.isSelectable !== state.isSelectable){
            return true;
        }

        switch(props.itemType){
            case ItemType.DESIGN:
                itemStatusNew = nextProps.item.designStatus;
                itemStatusOld = props.item.designStatus;
                itemNameNew = nextProps.item.designName;
                itemNameOld = props.item.designName;
                break;
            case ItemType.DESIGN_VERSION:
                itemStatusNew = nextProps.item.designVersionStatus;
                itemStatusOld = props.item.designVersionStatus;
                itemNameNew = nextProps.item.designVersionName;
                itemNameOld = props.item.designVersionName;
                itemRefNew = nextProps.item.designVersionNumber;
                itemRefOld = props.item.designVersionNumber;
                break;
            case ItemType.DESIGN_UPDATE:
                itemStatusNew = nextProps.item.updateStatus;
                itemStatusOld = props.item.updateStatus;
                itemNameNew = nextProps.item.updateName;
                itemNameOld = props.item.updateName;
                itemRefNew = nextProps.item.updateReference;
                itemRefOld = props.item.updateReference;
                break;
            case ItemType.WORK_PACKAGE:
                itemStatusNew = nextProps.item.workPackageStatus;
                itemStatusOld = props.item.workPackageStatus;
                itemNameNew = nextProps.item.workPackageName;
                itemNameOld = props.item.workPackageName;
                itemRefNew = nextProps.item.workPackageLink;
                itemRefOld = props.item.workPackageLink;
                break;
        }

        if(
            itemStatusNew !== itemStatusOld ||
            itemNameNew !== itemNameOld ||
            itemRefNew !== itemRefOld ||
            nextProps.userContext.designId !== props.userContext.designId ||
            nextProps.userContext.designVersionId !== props.userContext.designVersionId ||
            nextProps.userContext.designUpdateId !== props.userContext.designUpdateId ||
            nextProps.userContext.workPackageId !== props.userContext.workPackageId
        ){

            shouldUpdate = true;
        }

        log((msg) => console.log(msg), LogLevel.PERF, 'Ultrawide Item {} should update {}', props.itemType, shouldUpdate);

        return shouldUpdate;
    }

    // ACTION FUNCTIONS ------------------------------------------------------------------------------------------------

    onSelectDesign(userContext, newDesignId){

        ClientDesignServices.setDesign(userContext, newDesignId);
    };

    onSelectDesignVersion(userRole, userContext, dv){

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

    // DATA HELPER FUNCTIONS -------------------------------------------------------------------------------------------

    getVisualisationData(uwItemType, itemData, userContext, userRole){

        // Type Selection ----------------------------------------------------------------------------------------------
        let itemName = '';
        let itemStatus = '';
        let statusClass = 'item-status-available';
        let selected = false;
        let statusIcons = '';
        let uiName = '';

        switch (uwItemType) {

            case ItemType.DESIGN:
                uiName = replaceAll(itemData.designName, ' ', '_');
                itemName = itemData.designName;
                itemStatus = itemData.designStatus;
                if (itemData.isRemovable) {
                    statusClass = 'componentData-status-removable';
                }
                selected = itemData._id === userContext.designId;
                break;

            case ItemType.DESIGN_VERSION:
                uiName = replaceAll(itemData.designVersionName, ' ', '_');
                itemName = itemData.designVersionNumber + ' - ' + itemData.designVersionName;
                itemStatus = itemData.designVersionStatus;
                switch (itemData.designVersionStatus) {
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
                selected = itemData._id === userContext.designVersionId;
                break;

            case ItemType.DESIGN_UPDATE:
                uiName = replaceAll(itemData.updateName, ' ', '_');
                itemName = itemData.updateReference + ' - ' + itemData.updateName;
                itemStatus = itemData.updateStatus;
                switch (itemData.updateStatus) {
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
                selected = itemData._id === userContext.designUpdateId;
                statusIcons =
                    <InputGroup>
                        <InputGroup.Addon>
                            <div id="updateWpSummary" className={itemData.updateWpStatus}><Glyphicon glyph='tasks'/>
                            </div>
                        </InputGroup.Addon>
                        <InputGroup.Addon>
                            <div id="updateTestSummary" className={itemData.updateTestStatus}><Glyphicon
                                glyph='th-large'/></div>
                        </InputGroup.Addon>
                        <div></div>
                    </InputGroup>;
                break;

            case ItemType.WORK_PACKAGE:
                uiName = replaceAll(itemData.workPackageName, ' ', '_');
                itemName = itemData.workPackageName;
                itemStatus = itemData.workPackageStatus;
                switch (itemData.workPackageStatus) {
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
                if (itemData.workPackageTestStatus === WorkPackageTestStatus.WP_TESTS_COMPLETE) {
                    statusClass = 'componentData-status-complete';
                }

                selected = itemData._id === userContext.workPackageId;
                break;
        }

        return{
            itemName: itemName,
            itemStatus: itemStatus,
            statusClass: statusClass,
            selected: selected,
            statusIcons: statusIcons,
            uiName: uiName
        }
    }

    getSelectionAction(uwItemType, itemData, userContext, userRole){

        let onClickFunction = null;

        switch (uwItemType) {

            case ItemType.DESIGN:

                onClickFunction = () => this.onSelectDesign(userContext, itemData._id);
                break;

            case ItemType.DESIGN_VERSION:

                onClickFunction = () => this.onSelectDesignVersion(userRole, userContext, itemData);
                break;

            case ItemType.DESIGN_UPDATE:

                onClickFunction = () => this.onSelectDesignUpdate(userContext, itemData);
                break;

            case ItemType.WORK_PACKAGE:

                onClickFunction = () => this.onSelectWorkPackage(userRole, userContext, itemData);
                break;
        }

        return onClickFunction;
    }

    getAdopterName(userId){
        return ClientWorkPackageServices.getAdopterName(userId)
    }


    // LAYOUT MODULES --------------------------------------------------------------------------------------------------

    selectedLayout(itemType, onClickFunction, statusClass, itemName, uwItem, userContext, userRole, uiName){

        return(
            <Grid className="item-grid" onClick={onClickFunction}>
                <Row className={statusClass}>
                    <Col className="item-top-left" md={11}>
                        <div>
                            {this.itemStatusLayout(itemType)}
                        </div>
                    </Col>
                    <Col className="item-top-right" md={1}>
                        <div className={'design-item-header header-arrow'}><Glyphicon glyph="hand-right"/>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col className="item-body" md={11}>
                        {this.itemBodyLayout(itemType, uwItem, statusClass, userContext, userRole, uiName)}
                    </Col>
                </Row>
            </Grid>
        );
    }


    unselectedLayout(itemType, onClickFunction, statusClass, itemName, uwItem, uiName, isSelectable){

        let itemClass = 'item-grid';

        return(
            <Grid className={itemClass} onClick={onClickFunction}>
                <Row>
                    <Col className={'design-item-name ' + statusClass} md={11}>
                        {this.unselectedItemLayout(itemType, itemName, uwItem, uiName, isSelectable)}
                    </Col>
                </Row>
            </Grid>
        );

    }

    itemStatusLayout(itemType, itemStatus, itemStatusClass, wpTestStatus, adoptingUserId){

        const statusString = ItemStatusUiModules.getStatusString(itemType, itemStatus, wpTestStatus, this.getAdopterName(adoptingUserId));

        return (
            <div className={'design-item-status ' + itemStatusClass}>
                {statusString}
            </div>
        );
    }


    unselectedItemLayout(itemType, itemName, uwItem, uiName, isSelectable){

        let itemClass = 'item-name';
        if(isSelectable){
            itemClass = 'item-name-selectable';
        }

        switch(itemType){

            case ItemType.DESIGN:
            case ItemType.DESIGN_VERSION:
            case ItemType.WORK_PACKAGE:

                return (
                    <div className={itemClass} id={getContextID(UI.ITEM_SUMMARY, uiName) + '-' + itemType}>
                        {itemName}
                    </div>
                );

            case ItemType.DESIGN_UPDATE:

                return(
                    <div className={itemClass} id={getContextID(UI.ITEM_SUMMARY, uiName) + '-' + itemType}>
                        <InputGroup>
                            <InputGroup.Addon>
                                <div id="updateWpSummary" className={uwItem.updateWpStatus}><Glyphicon
                                    glyph='tasks'/></div>
                            </InputGroup.Addon>
                            <InputGroup.Addon>
                                <div id="updateTestSummary" className={uwItem.updateTestStatus}><Glyphicon
                                    glyph='th-large'/></div>
                            </InputGroup.Addon>
                            <div>{itemName}</div>
                        </InputGroup>
                    </div>
                );

            default:

                return(
                    <div>{'Unknown Item Type: ' + itemType}</div>
                )

        }
    }

    itemBodyLayout(itemType, itemData, statusClass, userContext, userRole, uiName){

        switch(itemType){

            case ItemType.DESIGN:

                return(
                    <div>
                        <Design
                            design={itemData}
                            statusClass={statusClass}
                            userContext={userContext}
                            userRole={userRole}
                            uiName={uiName}
                        />
                    </div>
                );

            case ItemType.DESIGN_VERSION:

                return(
                    <div>
                        <DesignVersion
                            designVersion={itemData}
                            statusClass={statusClass}
                            userContext={userContext}
                            userRole={userRole}
                            uiName={uiName}
                        />
                    </div>
                );

            case ItemType.DESIGN_UPDATE:

                return(
                    <div>
                        <DesignUpdate
                            designUpdate={itemData}
                            statusClass={statusClass}
                            userContext={userContext}
                            userRole={userRole}
                            uiName={uiName}
                        />
                    </div>
                );

            case ItemType.WORK_PACKAGE:

                return(
                    <div>
                        <WorkPackage
                            workPackage={itemData}
                            statusClass={statusClass}
                            userContext={userContext}
                            userRole={userRole}
                            uiName={uiName}
                        />
                    </div>
                );

            default:
        }
    }

}

export const UltrawideItemUiModules = new UltrawideItemUiModulesClass();