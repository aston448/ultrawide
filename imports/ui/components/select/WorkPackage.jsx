// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientWorkPackageServices from '../../../apiClient/apiClientWorkPackage.js';
import {ItemType, WorkPackageStatus, WorkPackageType, RoleType} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio, Checkbox} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Work Package Component - Graphically represents one Work Package that belongs to one Design Version or Design Update
//
// ---------------------------------------------------------------------------------------------------------------------

class WorkPackage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
        };
    }

    componentDidMount(){
        //this.setState({adopted: this.getUpdateAdoptionStatus(this.props.currentUserDevContext, this.props.designUpdate)});
    }

    onEditWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.editWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    };

    onViewWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.viewWorkPackage(
            userRole,
            userContext,
            wp._id,
            wp.workPackageType
        );
    }

    onDeleteWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.removeWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onPublishWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.publishWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    onUnpublishWorkPackage(userRole, userContext, wp){

        ClientWorkPackageServices.withdrawWorkPackage(
            userRole,
            userContext,
            wp._id
        );
    };

    setNewWorkPackageActive(context, wp){

        ClientWorkPackageServices.setWorkPackage(
            context,
            wp._id
        );
    };

    onDevelopWorkPackage(userRole, userContext, viewOptions, wp){

        ClientWorkPackageServices.developWorkPackage(
            userRole,
            userContext,
            viewOptions,
            wp._id
        );
    }

    // getUpdateAdoptionStatus(devContext, du){
    //
    //     // Return true if we have updates in the dev context and this one is included
    //     if(devContext.designUpdateIds){
    //         return devContext.designUpdateIds.includes(du._id);
    //     } else {
    //         return false;
    //     }
    // };

    // setUpdateAdoptionStatus(e, du, duList, context){
    //
    //     console.log("ON CHANGE: " + e.target.checked);
    //
    //     let checked = e.target.checked;
    //
    //     // If ticking add to list, if unticking subtract from it.
    //     // State change depends on actual success of update not on ticking
    //
    //     if(this.state.adopted && !checked){
    //         if(ClientDesignUpdateServices.setUpdateAdoptionStatus(du, duList, 'SUBTRACT', context.designId)) {
    //             this.setState({adopted: false});
    //             return;
    //         } else {
    //             //TODO warn user that it failed
    //         }
    //     }
    //
    //     if(!this.state.adopted && checked) {
    //         if(ClientDesignUpdateServices.setUpdateAdoptionStatus(du, duList, 'ADD', context.designId)){
    //             this.setState({adopted: true});
    //             return;
    //         } else {
    //             //TODO warn user that it failed
    //         }
    //     }
    // }

    render() {
        const {workPackage, userRole, viewOptions, userContext} = this.props;

        // Display as selected if this is the current WP in the user context
        //console.log("Rendering WP " + workPackage._id + " Current WP is " + userContext.workPackageId);
        let itemStyle = (workPackage._id === userContext.workPackageId ? 'design-item di-active' : 'design-item');


        let buttons = '';
        let options = '';

        switch(workPackage.workPackageStatus){
            case WorkPackageStatus.WP_NEW:
                if(userRole === RoleType.DEVELOPER){
                    // Developers can't do anything with WPs until published
                    buttons = <div></div>;
                } else {
                    // Managers can edit, delete or publish a new WP
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onDeleteWorkPackage(userRole, userContext, workPackage)}>Delete</Button>
                            <Button bsSize="xs" onClick={ () => this.onPublishWorkPackage(userRole, userContext, workPackage)}>Publish</Button>
                        </ButtonGroup>;
                }
                break;
            case WorkPackageStatus.WP_AVAILABLE:

                if(userRole === RoleType.DEVELOPER){
                    // Developers can view or select an update to include in the adopted design
                    buttons =
                        <div>
                            <ButtonGroup className="button-group-left">
                                <Button bsSize="xs" onClick={ () => this.onViewWorkPackage(userContext, workPackage)}>View</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button bsSize="xs" onClick={ () => this.onDevelopWorkPackage(userRole, userContext, viewOptions, workPackage)}>Develop</Button>
                            </ButtonGroup>
                        </div>
                    // options =
                    //     <FormGroup>
                    //         <Checkbox
                    //             checked={this.state.adopted}
                    //             onChange={ (e) => this.setUpdateAdoptionStatus(e, designUpdate, currentUserDevContext.designUpdateIds, currentUserItemContext)}>
                    //             Select for Development
                    //         </Checkbox>
                    //     </FormGroup>;
                } else {
                    // Managers can view or edit the WP
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onUnpublishWorkPackage(userRole, userContext, workPackage)}>Withdraw</Button>
                        </ButtonGroup>
                    // options =
                    //     <FormGroup>
                    //         <Radio>
                    //             {DesignUpdateMergeAction.MERGE_INCLUDE}
                    //         </Radio>
                    //         <Radio>
                    //             {DesignUpdateMergeAction.MERGE_IGNORE}
                    //         </Radio>
                    //         <Radio>
                    //             {DesignUpdateMergeAction.MERGE_ROLL}
                    //         </Radio>
                    //     </FormGroup>;
                }
                break;
            case WorkPackageStatus.WP_ADOPTED:
                // Developers can still view adopted WPs
                if(userRole === RoleType.DEVELOPER) {
                    buttons =
                        <div>
                            <ButtonGroup className="button-group-left">
                                <Button bsSize="xs"
                                        onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                            </ButtonGroup>
                        </div>
                } else {
                    // Managers can view or edit the WP
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditWorkPackage(userRole, userContext, workPackage)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewWorkPackage(userRole, userContext, workPackage)}>View</Button>
                        </ButtonGroup>
                }
                break;
            case WorkPackageStatus.WP_COMPLETE:
                // View only for everyone
                buttons =
                    <ButtonGroup>
                        <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>
                    </ButtonGroup>;
                break;
        }

        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.WORK_PACKAGE}
                    currentItemId={workPackage._id}
                    currentItemName={workPackage.workPackageName}
                    currentItemVersion=''
                    currentItemStatus={workPackage.workPackageStatus}
                    onSelectItem={ () => this.setNewWorkPackageActive(userContext, workPackage) }
                />
                {/*{options}*/}
                {buttons}
            </div>
        )
    }
}

WorkPackage.propTypes = {
    workPackage: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:               state.currentUserRole,
        viewOptions:            state.currentUserViewOptions,
        userContext:            state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
WorkPackage = connect(mapStateToProps)(WorkPackage);

export default WorkPackage;