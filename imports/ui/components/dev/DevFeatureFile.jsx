// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide GUI Components

// Ultrawide Services
import {ViewType, ComponentType, ViewMode, ScenarioStepStatus, ScenarioStepType, StepContext, MashStatus, MashTestStatus} from '../../../constants/constants.js';
import ClientFeatureFileServices from  '../../../apiClient/apiClientFeatureFiles.js';
import ClientMashDataServices from  '../../../apiClient/apiClientMashData.js';

// Bootstrap
import {Grid, Row, Col} from 'react-bootstrap';
import {InputGroup, Panel, FormControl} from 'react-bootstrap';
import {Glyphicon} from 'react-bootstrap';
import {Tooltip, OverlayTrigger} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD - Component is draggable


// Draft JS


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Dev Feature File Component - Graphically represents one Feature file found in the user Dev area
//
// ---------------------------------------------------------------------------------------------------------------------

class DevFeatureFile extends Component {

    constructor(props) {
        super(props);

        this.state = {
            open: false
        };

    };

    toggleOpen(){
        this.setState({open: !this.state.open});
    }

    render(){
        const { file, userContext } = this.props;

        let openGlyph = this.state.open ? 'collapse-up' :'collapse-down';

        return (
            <div>
                <InputGroup>
                    <InputGroup.Addon>
                        <div><Glyphicon glyph="file"/></div>
                    </InputGroup.Addon>
                    <div>
                        {file.featureFile}
                    </div>
                    <InputGroup.Addon onClick={ () => this.toggleOpen()}>
                        <div><Glyphicon glyph={openGlyph}/></div>
                    </InputGroup.Addon>
                </InputGroup>
                <Panel collapsible expanded={this.state.open} className="feature-file-panel">
                    <FormControl className="feature-file" componentClass="textarea" placeholder={file.fileText}/>
                </Panel>
            </div>
        );
    }

}

DevFeatureFile.propTypes = {
    file: PropTypes.object.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext: state.currentUserItemContext
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
DevFeatureFile = connect(mapStateToProps)(DevFeatureFile);

export default DevFeatureFile;