// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components
import DesignItemHeader from './DesignItemHeader.jsx';

// Ultrawide Services
import { ItemType } from '../../../constants/constants.js';
import ClientDesignServices from '../../../apiClient/apiClientDesign.js';

// Bootstrap
import {Button, ButtonGroup} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Design Component - Represents one design in a possible list of designs - top level item
//
// ---------------------------------------------------------------------------------------------------------------------

class Design extends Component {
    constructor(props) {
        super(props);
    }

    onSelectDesign(currentDesignId, newDesignId){
        ClientDesignServices.setDesign(currentDesignId, newDesignId);
    };

    onWorkDesign(currentDesignId, newDesignId){
        ClientDesignServices.workDesign(currentDesignId, newDesignId);
    }

    onRemoveDesign(designId){
        ClientDesignServices.removeDesign(designId);
    }

    render() {
        const {design, currentUserItemContext} = this.props;

        console.log("Rendering design " + design._id + "  Current design is " + currentUserItemContext.designId);

        // Active if this design is the current context design
        let itemStyle = (design._id === currentUserItemContext.designId ? 'design-item di-active' : 'design-item');

        let buttons = '';
        if(design.isRemovable){
            buttons = <ButtonGroup>
                <Button bsSize="xs" onClick={ () => this.onWorkDesign(currentUserItemContext.designId, design._id)}>Work on this Design</Button>
                <Button bsSize="xs" onClick={ () => this.onRemoveDesign(design._id)}>Remove Design</Button>
            </ButtonGroup>
        } else {
            buttons = <ButtonGroup>
                <Button bsSize="xs" onClick={ () => this.onWorkDesign(currentUserItemContext.designId, design._id)}>Work on this Design</Button>
            </ButtonGroup>
        }

        return (
            <div className={itemStyle}>
                <DesignItemHeader
                    currentItemType={ItemType.DESIGN}
                    currentItemId={design._id}
                    currentItemName={design.designName}
                    currentItemStatus=''
                    onSelectItem={ () => this.onSelectDesign(currentUserItemContext.designId, design._id)}
                />
                {buttons}
            </div>
        )
    }
}

Design.propTypes = {
    design: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        currentUserItemContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
Design = connect(mapStateToProps)(Design);

export default Design;


