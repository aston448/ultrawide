// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components
import WorkItemListContainer            from '../../containers/work/WorkItemContainer';
import WorkItemMoveTarget               from './WorkItemMoveTarget.jsx';
import WorkItemDetail                   from './WorkItemDetail.jsx';
import ProjectWorkSummaryItemContainer  from '../../containers/summary/ProjectWorkSummaryItemContainer.jsx';
import UnassignedWpListContainer        from '../../containers/work/UnassignedWpListContainer.jsx';

// Ultrawide Services
import {WorkItemType, ViewMode, ViewType, DisplayContext, UserSettingValue, UpdateScopeType, LogLevel} from '../../../constants/constants.js';
import {AddActionIds}   from "../../../constants/ui_context_ids.js";
import { UI }           from "../../../constants/ui_context_ids";



import { getContextID, log }              from '../../../common/utils.js';

// Bootstrap
import {Panel} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';
import {replaceAll} from "../../../common/utils";

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Iteration Component.  Contains details of Iteration plus, f0r top level, a list of iterations
//
// ---------------------------------------------------------------------------------------------------------------------

export class WorkItem extends Component{

    constructor(...args){
        super(...args);

        this.state = {

        };
    }

    shouldComponentUpdate(nextProps, nextState){

        // Optimisation.  No need to re-render this component if stuff that changes its look not changed
        return true

    }



    // Render generic design component
    render() {

        const {workItem, workItemType, displayContext, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render WorkItem');

        let uiItemId = '';

        switch(workItemType){

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:
                uiItemId = replaceAll(workItem.workPackageName, ' ', '_');
                break;
            case WorkItemType.DESIGN_UPDATE:

                 if(displayContext === DisplayContext.WORK_ITEM_DU_LIST){
                    uiItemId = replaceAll(workItem.updateName, ' ', '_');
                } else {
                    uiItemId = replaceAll(workItem.wiName, ' ', '_');
                }
                break;
            default:
                uiItemId = replaceAll(workItem.wiName, ' ', '_');
                break;
        }

        let uiContextName = uiItemId;

        let layout = <div></div>;


        switch(workItemType){
            case WorkItemType.INCREMENT:

                if(displayContext === DisplayContext.WORK_ITEM_SUMMARY){
                    layout =
                        <div>
                            <ProjectWorkSummaryItemContainer params={{
                                userContext: userContext,
                                workItem: workItem,
                                workItemType: workItemType,
                            }}/>
                            <WorkItemListContainer params={{
                                userContext: userContext,
                                workItemType: WorkItemType.ITERATION,
                                workItemsParentRef: workItem.wiReferenceId,
                                displayContext: displayContext
                            }}/>
                        </div>;
                } else {
                    layout =
                        <div>
                            <WorkItemDetail
                                workItem={workItem}
                                workItemType={workItemType}
                                userRole={userRole}
                                userContext={userContext}
                                displayContext={displayContext}
                            />
                            <WorkItemListContainer params={{
                                userContext: userContext,
                                workItemType: WorkItemType.ITERATION,
                                workItemsParentRef: workItem.wiReferenceId,
                                displayContext: displayContext
                            }}/>
                        </div>;
                }

                break;

            case WorkItemType.ITERATION:

                switch(displayContext){

                    // TODO - need to have a Base and Update Summary context
                    case DisplayContext.WORK_ITEM_SUMMARY:

                        layout =
                            <div>
                                <ProjectWorkSummaryItemContainer params={{
                                    userContext: userContext,
                                    workItem: workItem,
                                    workItemType: workItemType,
                                }}/>
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.BASE_WORK_PACKAGE,
                                    workItemsParentRef: workItem.wiReferenceId,
                                    displayContext: displayContext
                                }}/>
                            </div>;

                            break;

                    case DisplayContext.WORK_ITEM_EDIT_BASE:

                        layout =
                            <div>
                                <WorkItemDetail
                                    workItem={workItem}
                                    workItemType={workItemType}
                                    userRole={userRole}
                                    userContext={userContext}
                                    displayContext={displayContext}
                                />
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.BASE_WORK_PACKAGE,
                                    workItemsParentRef: workItem.wiReferenceId,
                                    displayContext: displayContext
                                }}/>
                            </div>;

                            break;

                    case DisplayContext.WORK_ITEM_EDIT_UPD:

                        // List of Updates in an iteration of Updatable design version

                        layout =
                            <div>
                                <WorkItemDetail
                                    workItem={workItem}
                                    workItemType={workItemType}
                                    userRole={userRole}
                                    userContext={userContext}
                                    displayContext={displayContext}
                                />
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.DESIGN_UPDATE,
                                    workItemsParentRef: workItem.wiReferenceId,
                                    displayContext: displayContext
                                }}/>
                            </div>;

                        break;
                }

                break;

            case WorkItemType.DESIGN_UPDATE:

                switch(displayContext){

                    case DisplayContext.WORK_ITEM_SUMMARY:

                        layout =
                            <div>
                                <ProjectWorkSummaryItemContainer params={{
                                    userContext: userContext,
                                    workItem: workItem,
                                    workItemType: workItemType,
                                }}/>
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.UPDATE_WORK_PACKAGE,
                                    workItemsParentRef: workItem._id,
                                    displayContext: displayContext
                                }}/>
                            </div>;
                        break;

                    case DisplayContext.WORK_ITEM_DU_LIST:

                        // DU has list of unassigned WPs with option to add WP if in the DU List
                        layout =
                            <div>
                                <WorkItemDetail
                                    workItem={workItem}
                                    workItemType={workItemType}
                                    userRole={userRole}
                                    userContext={userContext}
                                    displayContext={displayContext}
                                />
                                <UnassignedWpListContainer params={{
                                    userContext: userContext,
                                    displayContext: displayContext,
                                    parentId: workItem._id
                                }}/>
                            </div>;

                        break;

                    case DisplayContext.WORK_ITEM_EDIT_BASE:

                        layout =
                            <div>
                                <WorkItemDetail
                                    workItem={workItem}
                                    workItemType={workItemType}
                                    userRole={userRole}
                                    userContext={userContext}
                                    displayContext={displayContext}
                                />
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.BASE_WORK_PACKAGE,
                                    workItemsParentRef: workItem._id,
                                    displayContext: displayContext
                                }}/>
                            </div>;

                        break;

                    case DisplayContext.WORK_ITEM_EDIT_UPD:

                        layout =
                            <div>
                                <WorkItemDetail
                                    workItem={workItem}
                                    workItemType={workItemType}
                                    userRole={userRole}
                                    userContext={userContext}
                                    displayContext={displayContext}
                                />
                                <WorkItemListContainer params={{
                                    userContext: userContext,
                                    workItemType: WorkItemType.UPDATE_WORK_PACKAGE,
                                    workItemsParentRef: workItem.wiReferenceId,
                                    displayContext: displayContext
                                }}/>
                            </div>;

                        break;
                }

                break;

            case WorkItemType.BASE_WORK_PACKAGE:
            case WorkItemType.UPDATE_WORK_PACKAGE:

                if(displayContext === DisplayContext.WORK_ITEM_SUMMARY){
                    layout =
                        <div>
                            <ProjectWorkSummaryItemContainer params={{
                                userContext: userContext,
                                workItem: workItem,
                                workItemType: workItemType,
                            }}/>
                        </div>;
                } else {
                    layout =
                        <div>
                            <WorkItemDetail
                                workItem={workItem}
                                workItemType={workItemType}
                                userRole={userRole}
                                userContext={userContext}
                                displayContext={displayContext}
                            />

                        </div>;
                }
                break;

        }



        // Each Iteration has a move target above it so we can reorder stuff...

        // TODO - clause to say movable only for Manager
        if(false){
            return (
                <div id={getContextID(UI.ITEM_ITERATION, uiContextName)}>
                    {layout}
                </div>
            )
        } else {
            return (
                <div>
                    <WorkItemMoveTarget
                        workItem={workItem}
                    />
                    <div id={getContextID(UI.ITEM_ITERATION, uiContextName)}>
                        {layout}
                    </div>
                </div>
            )
        }
    }

}

WorkItem.propTypes = {
    workItem: PropTypes.object.isRequired,
    workItemType: PropTypes.string.isRequired,
    displayContext: PropTypes.string.isRequired
};


// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:                state.currentUserItemContext,
        userRole:                   state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(WorkItem);



