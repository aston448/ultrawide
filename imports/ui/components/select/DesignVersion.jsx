
// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import ClientDesignVersionServices from '../../../apiClient/apiClientDesignVersion.js';
import {RoleType, DesignVersionStatus, ItemType, ViewType, ViewMode} from '../../../constants/constants.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Version Component - Graphically represents one Design Version that belongs to one Design
//
// ---------------------------------------------------------------------------------------------------------------------

class DesignVersion extends Component {
    constructor(props) {
        super(props);
    }

    onEditDesignVersion(viewOptions, context, dv, currentProgressDataValue){

        ClientDesignVersionServices.editDesignVersion(
            viewOptions,
            context,
            dv._id,
            currentProgressDataValue
        );
    }

    onViewDesignVersion(viewOptions, context, dv){

        ClientDesignVersionServices.viewDesignVersion(
            viewOptions,
            context,
            dv._id,
            dv.designVersionStatus
        );
    }

    onAdoptDesignVersion(context, dv){

    }

    onPublishDesignVersion(context, dv){

        ClientDesignVersionServices.publishDesignVersion(
            context,
            dv._id
        );
    }

    onUnPublishDesignVersion(context, dv){

        ClientDesignVersionServices.unpublishDesignVersion(
            context,
            dv._id
        );
    }

    onMergeUpdatesToNewDraftVersion(context, dv){

        ClientDesignVersionServices.mergeUpdatesToNewDraftVersion(
            context,
            dv._id
        );
    }

    setNewDesignVersionActive(context, dv){

        ClientDesignVersionServices.setDesignVersion(
            context,
            dv._id
        );
    }

    render() {
        const {designVersion, userRole, viewOptions, userContext, currentProgressDataValue} = this.props;

        let itemStyle = (designVersion._id === userContext.designVersionId ? 'design-item di-active' : 'design-item');

        // What choices are available depend on the current stste of the design version
        let buttons = '';


        // Designers can add / edit stuff
        switch (designVersion.designVersionStatus) {
            case DesignVersionStatus.VERSION_NEW:
                if(userRole === RoleType.DESIGNER){
                    // Designers can Edit View or Publish
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onEditDesignVersion(viewOptions, userContext, designVersion, currentProgressDataValue)}>Edit</Button>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(viewOptions, userContext, designVersion)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onPublishDesignVersion(userContext, designVersion)}>Publish</Button>
                        </ButtonGroup>;

                } else {
                    // Developers and Managers cannot access new design versions
                    buttons = <div></div>;
                }
                break;
            case DesignVersionStatus.VERSION_PUBLISHED_DRAFT:
                switch(userRole){
                    case RoleType.DESIGNER:
                        // Designers can view it, unpublish it if not adopted or create the next version from updates...
                        buttons =
                            <ButtonGroup>
                                <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(userContext, designVersion)}>View</Button>
                                <Button bsSize="xs" onClick={ () => this.onEditDesignVersion(userContext, designVersion, currentProgressDataValue)}>Edit</Button>
                                <Button bsSize="xs" onClick={ () => this.onUnPublishDesignVersion(userContext, designVersion)}>Unpublish</Button>
                                <Button bsSize="xs" onClick={ () => this.onMergeUpdatesToNewDraftVersion(userContext, designVersion)}>Create New from Updates</Button>
                            </ButtonGroup>;
                        break;
                    case  RoleType.DEVELOPER:
                        //TODO - Change all this
                        // Developers can view or adopt a draft design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(userContext, designVersion)}>View</Button>
                                </ButtonGroup>
                            </div>;
                            break;
                    case  RoleType.MANAGER:
                        // Managers can view a draft design
                        buttons =
                            <div>
                                <ButtonGroup className="button-group-left">
                                    <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(userContext, designVersion)}>View</Button>
                                </ButtonGroup>
                            </div>;
                        break;
                }
                break;
            case DesignVersionStatus.VERSION_PUBLISHED_FINAL:
                //TODO - Change all this
                if(userRole === RoleType.DEVELOPER){
                    // Developers can view or adopt a final design
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(userContext, designVersion)}>View</Button>
                            <Button bsSize="xs" onClick={ () => this.onAdoptDesignVersion(userContext, designVersion)}>Adopt</Button>
                        </ButtonGroup>;

                } else {
                    // Designers can just view it
                    buttons =
                        <ButtonGroup>
                            <Button bsSize="xs" onClick={ () => this.onViewDesignVersion(userContext, designVersion)}>View</Button>
                        </ButtonGroup>;
                }
                break;

        }


        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN_VERSION}
                    currentItemId={designVersion._id}
                    currentItemName={designVersion.designVersionName}
                    currentItemVersion={designVersion.designVersionNumber}
                    currentItemStatus={designVersion.designVersionStatus}
                    onSelectItem={ () => this.setNewDesignVersionActive(userContext, designVersion)}
                />
                {buttons}
            </div>
        )
    }
}

DesignVersion.propTypes = {
    designVersion: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:                   state.currentUserRole,
        viewOptions:                state.currentUserViewOptions,
        userContext:                state.currentUserItemContext,
        currentProgressDataValue:   state.currentProgressDataValue
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DesignVersion = connect(mapStateToProps)(DesignVersion);

export default DesignVersion;
