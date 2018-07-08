// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Ultrawide Collections

// Ultrawide GUI Components

// Ultrawide Services
import {MenuType, RoleType, LogLevel} from '../../../constants/constants.js'
import {UI} from "../../../constants/ui_context_ids";
import {log, getContextID, replaceAll} from "../../../common/utils";

// Bootstrap
import {Glyphicon}  from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

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

    shouldComponentUpdate(nextProps, nextState){

        let shouldUpdate = false;

        if(
            nextState.isHighlighted !== this.state.isHighlighted ||
            nextProps.view !== this.state.view ||
            nextProps.userRole !== this.props.userRole
        ){
            shouldUpdate = true;
        }

        return shouldUpdate;
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

        log((msg) => console.log(msg), LogLevel.PERF, 'Render Ultrawide Menu Item {}', itemName);

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
            case RoleType.GUEST_VIEWER:
                highlight = 'menu-highlight-viewer';
                break;
        }

        switch(menuType){
            case MenuType.MENU_TOP_TEXT:
            case MenuType.MENU_TOP_ICON:
                className = this.state.isHighlighted ? 'top-menu-item ' + highlight : 'top-menu-item';
                break;
            case MenuType.MENU_EDITOR:
                className = this.state.isHighlighted ? 'editor-menu-item editor-menu-highlight' : 'editor-menu-item';
        }

        let menuGlyph = 'star';
        let menuItemToolTip = '';
        let tooltipDelay = 100;

        switch(itemName){
            case 'SETTINGS':
                menuGlyph = 'cog';
                menuItemToolTip = 'Configure Ultrawide';
                break;
            case 'DESIGNER':
                menuGlyph = 'queen';
                menuItemToolTip = 'Change to ' + itemName;
                break;
            case 'DEVELOPER':
                menuGlyph = 'knight';
                menuItemToolTip = 'Change to ' + itemName;
                break;
            case 'MANAGER':
                menuGlyph = 'king';
                menuItemToolTip = 'Change to ' + itemName;
                break;
            case 'FFF':
                menuGlyph = 'th';
                menuItemToolTip = 'Zoom to Features';
                break;
            case 'SSS':
                menuGlyph = 'th-large';
                menuItemToolTip = 'Zoom to Sections';
                break;
            case 'DDD':
                menuGlyph = 'book';
                menuItemToolTip = 'Show or Hide Domain Terms';
                break;
            case 'VIEW':
                menuGlyph = 'eye-open';
                menuItemToolTip = 'View Mode';
                break;
            case 'EDIT':
                menuGlyph = 'edit';
                menuItemToolTip = 'Edit Mode';
                break;
            case 'Export':
                menuGlyph = 'upload';
                menuItemToolTip = 'Export';
        }

        const tooltipIcon = (
            <Tooltip id="modal-tooltip">
                {menuItemToolTip}
            </Tooltip>
        );

        const uiContextId = replaceAll(menuItemToolTip, ' ', '_');

        // Layout ------------------------------------------------------------------------------------------------------

        switch(menuType){
            case MenuType.MENU_TOP_TEXT:
                return(
                    <div id={itemName} className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}>{itemName}</div>
                );

            case MenuType.MENU_TOP_ICON:
                return(
                    <OverlayTrigger delayShow={tooltipDelay} placement="bottom" overlay={tooltipIcon}>
                        <div id={getContextID(UI.OPTION_MENU_ICON, uiContextId)} className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}><Glyphicon id={itemName} glyph={menuGlyph}/></div>
                    </OverlayTrigger>
                );
            case MenuType.MENU_EDITOR:
                return(
                    <OverlayTrigger delayShow={tooltipDelay} placement="top" overlay={tooltipIcon}>
                        <div id={getContextID(UI.OPTION_MENU_ICON, uiContextId)} className={className} onMouseEnter={() => this.highlightMe()} onMouseLeave={() => this.unhighlightMe()} onClick={() => this.action()}><Glyphicon id={itemName} glyph={menuGlyph}/></div>
                    </OverlayTrigger>
                );

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
        userRole:           state.currentUserRole,
        view:               state.currentAppView
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
export default connect(mapStateToProps)(UltrawideMenuItem);
