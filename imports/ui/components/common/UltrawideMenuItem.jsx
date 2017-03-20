// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {MenuType} from '../../../constants/constants.js'

// Bootstrap

// REDUX services

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export default class UltrawideMenuItem extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isHighlighted: false
        }

    }

    highlightMe(){
        this.setState({isHighlighted: true})
    }

    unhighlightMe(){
        this.setState({isHighlighted: false})
    }

    action(){
        this.props.actionFunction()
    }

    render() {

        const {menuType, itemName, actionFunction} = this.props;

        let className = '';

        switch(menuType){
            case MenuType.MENU_TOP:
                className = this.state.isHighlighted ? 'top-menu-item menu-highlight' : 'top-menu-item';
                break;
            case MenuType.MENU_EDITOR:
                className = this.state.isHighlighted ? 'editor-menu-item editor-menu-highlight' : 'editor-menu-item';
        }

        return(
            <div className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}>{itemName}</div>
        )
    }
}

UltrawideMenuItem.propTypes = {
    menuType: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func.isRequired,
};
