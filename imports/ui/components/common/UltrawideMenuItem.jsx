// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {MenuType, RoleType} from '../../../constants/constants.js'

// Bootstrap
import {Glyphicon}  from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Menu Item - Direct Action item in App Header menu
//
// ---------------------------------------------------------------------------------------------------------------------

export class UltrawideMenuItem extends Component {

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

        const {menuType, itemName, userRole} = this.props;

        let className = '';
        let highlight = '';

        switch(userRole){
            case RoleType.DESIGNER:
                highlight = 'menu-highlight-designer';
                break;
            case RoleType.DEVELOPER:
                highlight = 'menu-highlight-developer';
                break;
            case RoleType.MANAGER:
                highlight = 'menu-highlight-manager';
                break;
        }

        switch(menuType){
            case MenuType.MENU_TOP:
                className = this.state.isHighlighted ? 'top-menu-item ' + highlight : 'top-menu-item';
                break;
            case MenuType.MENU_EDITOR:
                className = this.state.isHighlighted ? 'editor-menu-item editor-menu-highlight' : 'editor-menu-item';
        }

        let menuGlyph = 'star';

        switch(itemName){
            case 'FFF':
                menuGlyph = 'th';
                break;
            case 'SSS':
                menuGlyph = 'th-large';
                break;
            case 'VIEW':
                menuGlyph = 'eye-open';
                break;
            case 'EDIT':
                menuGlyph = 'edit';
                break;
            case 'Export':
                menuGlyph = 'upload';
        }

        if(menuType === MenuType.MENU_TOP){
            return(
                <div className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}>{itemName}</div>
            )
        } else {
            return(
                <div className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}><Glyphicon id={itemName} glyph={menuGlyph}/></div>
            )
        }

    }
}

UltrawideMenuItem.propTypes = {
    menuType: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    actionFunction: PropTypes.func.isRequired,
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userRole:   state.currentUserRole,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideMenuItem);
