// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import WorkItemTarget       from '../../components/work/WorkItemTarget.jsx';
import WorkItem             from '../../components/work/WorkItem.jsx';
import ItemList             from '../../components/item/ItemList.jsx';

// Ultrawide Services
import {ClientDataServices}         from "../../../apiClient/apiClientDataServices";
import {ClientWorkItemServices}    from "../../../apiClient/apiClientWorkItem";

import {WorkItemType, ItemListType, LogLevel, RoleType, DisplayContext} from "../../../constants/constants";
import {AddActionIds} from "../../../constants/ui_context_ids";

// REDUX services
import {connect} from 'react-redux';
import {log} from "../../../common/utils";



// React component
export class WorkItemList extends Component {

    renderItemList(items, itemType){
        return items.map((item) => {

            // Anything other than a WP can be a target for dropping other things into
            // No targets if in the summary display context
            if(
                (item.wiType !== WorkItemType.BASE_WORK_PACKAGE) &&
                (item.wiType !== WorkItemType.UPDATE_WORK_PACKAGE) &&
                (this.props.displayContext === DisplayContext.WORK_ITEM_EDIT)
            ){
                return (
                    <WorkItemTarget
                        key={item._id}
                        workItem={item}
                        workItemType={itemType}
                        displayContext={this.props.displayContext}
                    />
                );
            } else {
                return (
                    <WorkItem
                        key={item._id}
                        workItem={item}
                        workItemType={itemType}
                        displayContext={this.props.displayContext}
                    />
                );
            }

        });
    }

    noItem(){
        return (
            <div className="design-item-note">No Items</div>
        );
    }

    noWp(){
        return (
            <div className="design-item-note">No Work Packages</div>
        );
    }

    addNewIncrement(userContext, userRole){

        ClientWorkItemServices.addNewIncrement(userContext.designVersionId, userRole);
    }

    addNewIteration(userContext, parentRef, userRole){

        ClientWorkItemServices.addNewIteration(userContext.designVersionId, parentRef, userRole)
    }

    render(){
        const {workItems, parentItemRef, workItemType, displayContext, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render CONTAINER Iterations');
        //console.log('Iterations with role %s, %i', userRole, listLevel);

        let hasFooterAction = false;
        let footerAction = '';
        let footerActionFunction = null;
        let bodyDataFunction = null;
        let headerText = '';
        let uiContext = '';
        let itemListType = '';
        let layout = <div></div>;

        switch(workItemType){
            case WorkItemType.INCREMENT:

                if(userRole === RoleType.MANAGER && displayContext === DisplayContext.WORK_ITEM_EDIT){
                    hasFooterAction = true;
                    footerAction = 'Add Increment';
                    footerActionFunction = () => this.addNewIncrement(userContext, userRole);
                    uiContext = AddActionIds.UI_CONTEXT_ADD_ITERATION;

                }

                if(displayContext === DisplayContext.WORK_ITEM_EDIT){
                    headerText = 'Design Version Work Plan';
                    itemListType = ItemListType.WORK_ITEM_IN;
                } else {
                    itemListType = ItemListType.WORK_ITEM_SUMM;
                }

                break;

            case WorkItemType.ITERATION:

                if(userRole === RoleType.MANAGER && displayContext === DisplayContext.WORK_ITEM_EDIT){
                    hasFooterAction = true;
                    footerAction = 'Add Iteration';
                    footerActionFunction = () => this.addNewIteration(userContext, parentItemRef, userRole);
                    uiContext = AddActionIds.UI_CONTEXT_ADD_ITERATION
                }

                if(displayContext === DisplayContext.WORK_ITEM_EDIT){
                    headerText = 'Iterations';
                    itemListType = ItemListType.WORK_ITEM_IT;
                } else {
                    itemListType = ItemListType.WORK_ITEM_SUMM;
                }

                break;

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                // These are actual WPs
                if(displayContext === DisplayContext.WORK_ITEM_EDIT){
                    itemListType = ItemListType.WORK_ITEM_WP;
                } else {
                    itemListType = ItemListType.WORK_ITEM_SUMM;
                }
                break;
        }


        if(workItems && workItems.length > 0) {
            bodyDataFunction = () => this.renderItemList(workItems, workItemType)
        } else {
            if(workItemType === WorkItemType.BASE_WORK_PACKAGE || workItemType === WorkItemType.UPDATE_WORK_PACKAGE){
                bodyDataFunction = () => this.noWp()
            } else {
                bodyDataFunction = () => this.noItem()
            }
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

WorkItemList.propTypes = {
    workItems: PropTypes.array.isRequired,
    parentItemRef: PropTypes.string.isRequired,
    workItemType: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired
};

function mapStateToProps(state) {
    return {
        userContext:            state.currentUserItemContext,
        userRole:               state.currentUserRole
    }
}

export default WorkItemListContainer = createContainer(({params}) => {

    const workItems = ClientDataServices.getWorkItemList(
        params.userContext,
        params.workItemType,
        params.workItemsParentRef
    );

    return{
        workItems: workItems,
        parentItemRef: params.workItemsParentRef,
        workItemType: params.workItemType,
        displayContext: params.displayContext
    }

}, connect(mapStateToProps)(WorkItemList));


