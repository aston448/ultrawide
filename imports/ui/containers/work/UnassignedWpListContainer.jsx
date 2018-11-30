// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import WorkItem             from '../../components/work/WorkItem.jsx';
import ItemList             from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {ClientDataServices}         from "../../../apiClient/apiClientDataServices";
import {ClientWorkItemServices}    from "../../../apiClient/apiClientWorkItem";

import {
    WorkItemType,
    ItemListType,
    LogLevel,
    RoleType,
    ItemType,
    WorkPackageType,
    DisplayContext
} from "../../../constants/constants";
import {AddActionIds} from "../../../constants/ui_context_ids";

// REDUX services
import {connect} from 'react-redux';
import {log} from "../../../common/utils";
import {ClientWorkPackageServices} from "../../../apiClient/apiClientWorkPackage";
import {ClientDesignUpdateServices} from "../../../apiClient/apiClientDesignUpdate";



// React component
export class UnassignedWpList extends Component {

    renderWpList(wps, workItemType){
        return wps.map((wp) => {

            return (
                <WorkItem
                    key={wp._id}
                    workItem={wp}
                    workItemType={workItemType}
                    displayContext={this.props.displayContext}
                />
            );
        });
    }

    noWp(){
        return (
            <div className="design-item-note"></div>
        );
    }

    addNewWorkPackage(userContext, userRole, workPackageType, openWpItems, parentId){

        // Set the User Context to the DU for which a new WP is being added
        let newUserContext = userContext;

        if(parentId !== 'NONE'){
            newUserContext = ClientDesignUpdateServices.setDesignUpdate(userContext, parentId, this.props.displayContext);
        }

        ClientWorkPackageServices.addNewWorkPackage(userRole, newUserContext, workPackageType, openWpItems)
    }



    render(){
        const {workPackages, displayContext, parentId, userContext, userRole, openWpItems} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Iterations');
        //console.log('Iterations with role %s, %i', userRole, listLevel);

        let hasFooterAction = false;
        let footerAction = '';
        let footerActionFunction = null;
        let bodyDataFunction = null;
        let headerText = '';
        let uiContext = '';
        let itemListType = '';
        let workPackageType = '';
        let workItemType = '';

        if(displayContext === DisplayContext.WORK_ITEM_DU_LIST){
            itemListType = ItemListType.WORK_ITEM_DU_WP;
            workPackageType = WorkPackageType.WP_UPDATE;
            workItemType = WorkItemType.UPDATE_WORK_PACKAGE;
        } else {
            headerText = 'Unassigned Work Packages';
            itemListType = ItemListType.ULTRAWIDE_ITEM;
            workPackageType = WorkPackageType.WP_BASE;
            workItemType = WorkItemType.BASE_WORK_PACKAGE;
        }

        if(userRole === RoleType.MANAGER){
            hasFooterAction = true;
            footerAction = 'Add New Work Package';
            footerActionFunction = () => this.addNewWorkPackage(userContext, userRole, workPackageType, openWpItems, parentId);
            uiContext = AddActionIds.UI_CONTEXT_ADD_WORK_PACKAGE
        }


        if(workPackages && workPackages.length > 0) {
            bodyDataFunction = () => this.renderWpList(workPackages, workItemType)
        } else {
            bodyDataFunction = () => this.noWp()
        }

        return(
            <div>
                <ItemList
                    headerText={headerText}
                    bodyDataFunction={bodyDataFunction}
                    hasFooterAction={hasFooterAction}
                    footerAction={footerAction}
                    footerActionFunction={footerActionFunction}
                    footerActionUiContext={AddActionIds.UI_CONTEXT_ADD_ITERATION}
                    listType={itemListType}
                />
            </div>
        )
    }

}

UnassignedWpList.propTypes = {
    workPackages: PropTypes.array.isRequired,
    displayContext: PropTypes.string.isRequired,
    parentId:   PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole,
        openWpItems:            state.currentUserOpenWorkPackageItems
    }
}

export default UnassignedWpListContainer = createContainer(({params}) => {

    const workPackages = ClientDataServices.getUnassignedWorkPackages(
        params.userContext,
        params.displayContext,
        params.parentId
    );

    return{
        workPackages: workPackages,
        displayContext: params.displayContext,
        parentId: params.parentId
    }

}, connect(mapStateToProps)(UnassignedWpList));


