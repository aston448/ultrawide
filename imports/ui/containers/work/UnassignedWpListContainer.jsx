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

import {WorkItemType, ItemListType, LogLevel, RoleType, ItemType, WorkPackageType} from "../../../constants/constants";
import {AddActionIds} from "../../../constants/ui_context_ids";

// REDUX services
import {connect} from 'react-redux';
import {log} from "../../../common/utils";
import {ClientWorkPackageServices} from "../../../apiClient/apiClientWorkPackage";



// React component
export class UnassignedWpList extends Component {

    renderWpList(wps){
        return wps.map((wp) => {

            return (
                <WorkItem
                    key={wp._id}
                    workItem={wp}
                    workItemType={WorkItemType.BASE_WORK_PACKAGE}
                />
            );
        });
    }

    noWp(){
        return (
            <div className="design-item-note">No Work Packages</div>
        );
    }

    addNewWorkPackage(userContext, userRole, workPackageType, openWpItems){

        ClientWorkPackageServices.addNewWorkPackage(userRole, userContext, workPackageType, openWpItems)
    }



    render(){
        const {workPackages, userContext, userRole, openWpItems} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Iterations');
        //console.log('Iterations with role %s, %i', userRole, listLevel);

        let hasFooterAction = false;
        let footerAction = '';
        let footerActionFunction = null;
        let bodyDataFunction = null;
        let headerText = '';
        let uiContext = '';
        let itemListType = '';



        if(userRole === RoleType.MANAGER){
            hasFooterAction = true;
            footerAction = 'Add New Work Package';
            footerActionFunction = () => this.addNewWorkPackage(userContext, userRole, WorkPackageType.WP_BASE, openWpItems);
            uiContext = AddActionIds.UI_CONTEXT_ADD_WORK_PACKAGE
        }
        headerText = 'Unassigned Work Packages';
        itemListType = ItemListType.ULTRAWIDE_ITEM;

        if(workPackages && workPackages.length > 0) {
            bodyDataFunction = () => this.renderWpList(workPackages)
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
    workPackages: PropTypes.array.isRequired
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
        params.userContext
    );

    return{
        workPackages: workPackages
    }

}, connect(mapStateToProps)(UnassignedWpList));


