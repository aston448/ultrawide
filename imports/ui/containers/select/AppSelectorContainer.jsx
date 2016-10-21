// // == IMPORTS ==========================================================================================================
//
// // Meteor / React Services
// import React, { Component, PropTypes } from 'react';
// import { Meteor } from 'meteor/meteor';
// import { createContainer } from 'meteor/react-meteor-data';
//
//
// // Ultrawide Collections
//
//
// // Ultrawide GUI Components
// import Design from '../components/Design.jsx';
// import DesignComponentAdd from '../components/DesignComponentAdd.jsx';
// import DesignVersionsContainer from '../containers/DesignVersionsContainer.jsx';
//
// // Ultrawide Services
// import {RoleType} from '../../constants/constants.js';
// import ClientContainerServices from '../../apiClient/apiClientContainerServices.js';
// import ClientDesignServices from  '../../apiClient/apiClientDesign.js';
//
// // Bootstrap
// import {Grid, Col, Row} from 'react-bootstrap';
// import {Panel} from 'react-bootstrap';
//
// // REDUX services
// import {connect} from 'react-redux';
//
// // =====================================================================================================================
//
// // -- CLASS ------------------------------------------------------------------------------------------------------------
// //
// // Selection View Container - Contains data for Designs available in the application
// //
// // ---------------------------------------------------------------------------------------------------------------------
//
// // Work selection screen
// class SelectionScreen extends Component {
//     constructor(props) {
//         super(props);
//
//     }
//
//     addNewDesign() {
//         ClientDesignServices.addNewDesign();
//     }
//
//     renderDesignList(designs){
//         return designs.map((design) => {
//             return (
//                 <Design
//                     key={design._id}
//                     design={design}
//                 />
//             );
//         });
//     }
//
//     render() {
//
//         const {designs, currentUserRole, currentUserItemContext} = this.props;
//
//         // Designs only addable by a Designer
//         let addDesign = <div></div>;
//
//         if(currentUserRole === RoleType.DESIGNER){
//             addDesign =
//                 <div className="design-item-add">
//                     <DesignComponentAdd
//                         addText="Add Design"
//                         onClick={ () => this.addNewDesign()}
//                     />
//                 </div>
//         }
//
//         // A list of available Designs and a container to hold Design Versions for the selected Design
//
//         if(designs.length > 0 && currentUserItemContext) {
//             return (
//                 <Grid>
//                     <Row>
//                         <Col md={2} className="col">
//                             <Panel header="Designs">
//                                 {this.renderDesignList(designs)}
//                                 {addDesign}
//                             </Panel>
//                         </Col>
//                         <Col md={10} className="col">
//                             <DesignVersionsContainer params={{
//                                 currentDesignId: currentUserItemContext.designId
//                             }}
//                             />
//                         </Col>
//                     </Row>
//                 </Grid>
//             );
//         } else {
//             return(
//                 <div>No Data</div>
//             )
//         }
//     }
// }
//
// SelectionScreen.propTypes = {
//     designs: PropTypes.array.isRequired
// };
//
//
// // Redux function which maps state from the store to specific props this component is interested in.
// function mapStateToProps(state) {
//     return {
//         currentUserRole: state.currentUserRole,
//         currentUserItemContext: state.currentUserItemContext
//     }
// }
//
// // Connect the Redux store to this component ensuring that its required state is mapped to props
// SelectionScreen = connect(mapStateToProps)(SelectionScreen);
//
//
// export default AppSelectorContainer = createContainer(({params}) => {
//
//     // Gets the currently saved user context and a list of known Designs
//     return ClientContainerServices.getUltrawideDesigns();
//
//
// }, SelectionScreen);