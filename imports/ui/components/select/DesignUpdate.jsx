// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import {ItemType, DesignUpdateStatus, DesignUpdateMergeAction, RoleType} from '../../../constants/constants.js';
import TextLookups from '../../../common/lookups.js';

// Bootstrap
import {Button, ButtonGroup, FormGroup, Radio, Checkbox} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Update Component - Graphically represents one Design Update that belongs to one Design Version
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            adopted: false,
            mergeAction: props.designUpdate.updateMergeAction
        };
    }


    onEditDesignUpdate(userRole, userContext, viewOptions, du){

        ClientDesignUpdateServices.editDesignUpdate(
            userRole,
            userContext,
            viewOptions,
            du._id
        );
    };

    onDeleteDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.deleteDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onPublishDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.publishDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onWithdrawDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.withdrawDesignUpdate(
            userRole,
            userContext,
            du._id
        );
    };

    onViewDesignUpdate(userRole, userContext, viewOptions, du){

        ClientDesignUpdateServices.viewDesignUpdate(
            userRole,
            userContext,
            viewOptions,
            du._id
        );
    }

    setNewDesignUpdateActive(context, du){

        ClientDesignUpdateServices.setDesignUpdate(
            context,
            du._id
        );
    };

    onDevelopDesignUpdate(){

    }

    onMergeActionChange(userRole, du, newAction){

        this.setState({mergeAction: newAction});

        ClientDesignUpdateServices.updateMergeAction(userRole, du._id, newAction);

        this.setNewDesignUpdateActive(this.props.userContext, du);

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
        const {designUpdate, userRole, userContext, viewOptions} = this.props;

        // Display as selected if this is the current DU in the user context
        let itemStyle = (designUpdate._id === userContext.designUpdateId ? 'design-item di-active' : 'design-item');

        let buttons = '';
        let options = '';

        switch(designUpdate.updateStatus){
            case DesignUpdateStatus.UPDATE_NEW:
                if(userRole === RoleType.DEVELOPER){
                    // Developers can't do anything with design updates until published
                    buttons = <div></div>;
                } else {
                    // Designers can edit, delete or publish a new update
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onDeleteDesignUpdate(userRole, userContext, designUpdate)}>Delete</Button>
                            <Button bsSize="xs" onClick={ () => this.onPublishDesignUpdate(userRole, userContext, designUpdate)}>Publish</Button>
                        </ButtonGroup>;
                }
                break;
            case DesignUpdateStatus.UPDATE_PUBLISHED_DRAFT:
                if(userRole === RoleType.DEVELOPER){
                    // Developers can view or select an update to include in the adopted design
                    buttons =
                        <div>
                            <ButtonGroup className="button-group-left">
                                <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                            </ButtonGroup>
                            <ButtonGroup>
                                <Button bsSize="xs" onClick={ () => this.onDevelopDesignUpdate(userContext, designUpdate)}>Develop this Update</Button>
                            </ButtonGroup>
                        </div>
                    // options =
                    //     <FormGroup>
                    //         <Checkbox
                    //             checked={this.state.adopted}
                    //             onChange={ (e) => this.setUpdateAdoptionStatus(e, designUpdate, currentUserDevContext.designUpdateIds, userContext)}>
                    //             Select for Development
                    //         </Checkbox>
                    //     </FormGroup>;
                } else {
                    // Designers can view, edit or withdraw the update or specify how it is to be merged into the next Design Version
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onWithdrawDesignUpdate(userRole, userContext, designUpdate)}>Withdraw</Button>
                        </ButtonGroup>;
                    options =
                        <FormGroup>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_INCLUDE}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_INCLUDE)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_INCLUDE)}
                            </Radio>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_ROLL}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_ROLL)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_ROLL)}
                            </Radio>
                            <Radio checked={this.state.mergeAction === DesignUpdateMergeAction.MERGE_IGNORE}
                                   onChange={() => this.onMergeActionChange(userRole, designUpdate, DesignUpdateMergeAction.MERGE_IGNORE)}>
                                {TextLookups.updateMergeActions(DesignUpdateMergeAction.MERGE_IGNORE)}
                            </Radio>
                        </FormGroup>;
                }
                break;
            case DesignUpdateStatus.UPDATE_MERGED:
                // View only for everyone
                buttons =
                    <ButtonGroup>
                        <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, viewOptions, designUpdate)}>View</Button>
                    </ButtonGroup>;
                break;
        }

        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_UPDATE}
                    currentItemId={designUpdate._id}
                    currentItemName={designUpdate.updateName}
                    currentItemVersion={designUpdate.updateReference}
                    currentItemStatus={designUpdate.updateStatus}
                    onSelectItem={ () => this.setNewDesignUpdateActive(userContext, designUpdate) }
                />
                {options}
                {buttons}
            </div>
        )
    }
}

DesignUpdate.propTypes = {
    designUpdate: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole: state.currentUserRole,
        userContext: state.currentUserItemContext,
        viewOptions: state.currentUserViewOptions
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignUpdate = connect(mapStateToProps)(DesignUpdate);

export default DesignUpdate;