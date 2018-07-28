// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Services
import { UltrawideItemUiModules }              from '../../../ui_modules/ultrawide_item.js';

import { LogLevel } from '../../../constants/constants.js';
import {log} from "../../../../imports/common/utils";

// REDUX services
import {connect} from 'react-redux';


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// UltrawideItem - The generic item for Designs, Design Versions, Design Updates and Work Packages
//
// ---------------------------------------------------------------------------------------------------------------------

export class UltrawideItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSelectable: false
        };
    }

    shouldComponentUpdate(nextProps, nextState){

        return UltrawideItemUiModules.updateRequired(nextProps, this.props, nextState, this.state);
    }

    setSelectable(){
        this.setState({isSelectable: true});
    }

    setUnselectable(){
        this.setState({isSelectable: false});
    }

    render() {
        const {itemType, item, userContext, userRole} = this.props;

        log((msg) => console.log(msg), LogLevel.PERF, 'Render UltrawideItem {}', itemType);

        return(
            <div onMouseEnter={ () => this.setSelectable()} onMouseLeave={ () => this.setUnselectable()}>
                {UltrawideItemUiModules.getComponentLayout(itemType, item, userContext, userRole, this.state.isSelectable)}
            </div>
        )
    }
}

UltrawideItem.propTypes = {
    itemType:   PropTypes.string.isRequired,
    item:       PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
        userRole:       state.currentUserRole
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideItem);



