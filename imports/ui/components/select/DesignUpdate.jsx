// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignUpdateServices from '../../../apiClient/apiClientDesignUpdate.js';
import {ItemType, DesignUpdateStatus, DesignUpdateMergeAction, RoleType} from '../../../constants/constants.js';

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
        };
    }

    // componentDidMount(){
    //     this.setState({adopted: this.getUpdateAdoptionStatus(this.props.currentUserDevContext, this.props.designUpdate)});
    // }

    onEditDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.editDesignUpdate(
            userRole,
            userContext,
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

    onViewDesignUpdate(userRole, userContext, du){

        ClientDesignUpdateServices.viewDesignUpdate(
            userRole,
            userContext,
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
        const {designUpdate, userRole, userContext, currentUserDevContext} = this.props;

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
                            <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, designUpdate)}>Edit</Button>
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
                                <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>
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
                            <Button bsSize="xs" onClick={ () => this.onEditDesignUpdate(userRole, userContext, designUpdate)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignUpdate(userRole, userContext, designUpdate)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onWithdrawDesignUpdate(userRole, userContext, designUpdate)}>Withdraw</Button>
                        </ButtonGroup>
                    options =
                        <FormGroup>
                            <Radio>
                                {DesignUpdateMergeAction.MERGE_INCLUDE}
                            </Radio>
                            <Radio>
                                {DesignUpdateMergeAction.MERGE_IGNORE}
                            </Radio>
                            <Radio>
                                {DesignUpdateMergeAction.MERGE_ROLL}
                            </Radio>
                        </FormGroup>;
                }
                break;
            case DesignUpdateStatus.UPDATE_MERGED:
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
        currentUserDevContext: state.currentUserDevContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignUpdate = connect(mapStateToProps)(DesignUpdate);

export default DesignUpdate;