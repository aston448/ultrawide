// == IMPORTS ==========================================================================================================

// Meteor / React Services
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

// Ultrawide Collections


// Ultrawide GUI Components


// Ultrawide Services
import {RoleType, LocationType, ViewType} from '../../../constants/constants.js'
import ClientUserContextServices from '../../../apiClient/apiClientUserContext.js'

// Bootstrap
import {InputGroup, FormGroup, ControlLabel, FormControl, Col, Glyphicon} from 'react-bootstrap';

// REDUX services
import {connect} from 'react-redux';

// React DnD


// =====================================================================================================================

// -- CLASS ------------------------------------------------------------------------------------------------------------
//
// Location Input Component - Allows entry of file paths
//
// ---------------------------------------------------------------------------------------------------------------------


// App Body component - represents all the design content
class LocationInput extends Component {

    constructor(props) {
        super(props);

        this.state = {
            editing:    false,
            filePath:   ''
        };

    }

    onEditPath(){
        this.setState({editing: true});
    }

    onUpdateFilePath(e){
        this.setState({filePath: e.target.value});
    }

    onSavePath(type, userContext){

        ClientUserContextServices.updateContextFilePath(type, userContext, this.state.filePath);
        this.setState({editing: false});

    }

    onUndoChange(){
        this.setState({filePath: ''});
    }

    render() {
        const {type, userContext} = this.props;

        let placeholderText = '';
        let labelText = '';

        switch(type){
            case LocationType.LOCATION_FEATURE_FILES:
                labelText = 'Directory containing Cucumber Feature Files:';
                placeholderText = userContext.featureFilesLocation;
                break;
            case LocationType.LOCATION_ACCEPTANCE_TEST_OUTPUT:
                labelText = 'File containing Acceptance Test Results:';
                placeholderText = userContext.acceptanceTestResultsLocation;
                break;
            case LocationType.LOCATION_INTEGRATION_TEST_OUTPUT:
                labelText = 'File containing Integration Test Results:';
                placeholderText = userContext.integrationTestResultsLocation;
                break;
            case LocationType.LOCATION_MODULE_TEST_OUTPUT:
                labelText = 'File containing Module Test Results:';
                placeholderText = userContext.unitTestResultsLocation;
        }

        let editingItem =
            <div className="path-item">
                <InputGroup>
                    <div>
                        <FormGroup controlId="loginUserName">
                            <Col componentClass={ControlLabel} md={4}>
                                {labelText}
                            </Col>
                            <Col md={8}>
                                <FormControl className="editableItem" type="text" placeholder={placeholderText} value={this.state.filePath} onChange={(e) => this.onUpdateFilePath(e)}/>
                            </Col>
                        </FormGroup>
                    </div>
                    <InputGroup.Addon onClick={ () => this.onSavePath(type, userContext)}>
                        <div className="green"><Glyphicon glyph="ok"/></div>
                    </InputGroup.Addon>
                    <InputGroup.Addon onClick={ () => this.onUndoChange()}>
                        <div className="red"><Glyphicon glyph="arrow-left"/></div>
                    </InputGroup.Addon>
                </InputGroup>
            </div>;

        // let notEditingItem =
        //     <div>
        //         <InputGroup>
        //             <div>
        //                 <FormGroup controlId="loginUserName">
        //                     <ControlLabel>{labelText}</ControlLabel>
        //                     <FormControl type="text"/>
        //                 </FormGroup>
        //             </div>
        //             <InputGroup.Addon onClick={ () => this.onEditPath()}>
        //                 <div className="blue"><Glyphicon glyph="edit"/></div>
        //             </InputGroup.Addon>
        //         </InputGroup>
        //     </div>;


        return(
            <div>
                {editingItem}
            </div>
        )



    }
}

LocationInput.propTypes = {
    type:   PropTypes.string.isRequired
};

// Redux function which maps state from the store to specific props this component is interested in.
function mapStateToProps(state) {
    return {
        userContext:    state.currentUserItemContext,
    }
}

// Connect the Redux store to this component ensuring that its required state is mapped to props
LocationInput = connect(mapStateToProps)(LocationInput);

export default LocationInput;