// // == IMPORTS ==========================================================================================================
//
// // Meteor / React Services
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { createContainer } from 'meteor/react-meteor-data';
//
// // Ultrawide Collections
//
// // Ultrawide GUI Components
// import DevFeatureFile from '../../components/dev/DevFeatureFile.jsx';
//
// // Ultrawide Services
// import { ClientDataServices } from '../../../apiClient/apiClientDataServices.js';
//
// // Bootstrap
// import {Panel} from 'react-bootstrap';
//
// // REDUX services
// import {connect} from 'react-redux';
//
// // =====================================================================================================================
//
// // -- CLASS ------------------------------------------------------------------------------------------------------------
// //
// // Dev Files Container - Shows the feature files found in the current users build area
// //
// // ---------------------------------------------------------------------------------------------------------------------
//
// class DevFilesList extends Component {
//     constructor(props) {
//         super(props);
//
//     }
//
//
//     renderDevFiles(files){
//
//         return files.map((file) => {
//             return (
//                 <DevFeatureFile
//                     key={file._id}
//                     file={file}
//                 />
//             );
//         });
//     }
//
//     render() {
//
//         const {wpFiles, designFiles, unknownFiles, currentUserRole, userContext} = this.props;
//
//         let wpPanel = '';
//         let designPanel = '';
//         let unknownPanel = '';
//
//         if(wpFiles.length > 0) {
//             wpPanel =
//                 <Panel className="panel-text panel-text-body" header="Features in Work Package">
//                     {this.renderDevFiles(wpFiles)}
//                 </Panel>;
//         }
//
//         if(designFiles.length > 0) {
//             designPanel =
//                 <Panel className="panel-text panel-text-body" header="Features in Design">
//                     {this.renderDevFiles(designFiles)}
//                 </Panel>;
//         }
//
//         if(unknownFiles.length > 0) {
//             unknownPanel =
//                 <Panel className="panel-text panel-text-body" header="Unknown Features">
//                     {this.renderDevFiles(unknownFiles)}
//                 </Panel>;
//         }
//
//         return(
//             <div>
//                 {wpPanel}
//                 {designPanel}
//                 {unknownPanel}
//             </div>
//         );
//
//     }
// }
//
// DevFilesList.propTypes = {
//     wpFiles: PropTypes.array,
//     designFiles: PropTypes.array,
//     unknownFiles: PropTypes.array,
// };
//
//
// // Redux function which maps state from the store to specific props this component is interested in.
// function mapStateToProps(state) {
//     return {
//         currentUserRole: state.currentUserRole,
//         userContext: state.currentUserItemContext
//     }
// }
//
// // Connect the Redux store to this component ensuring that its required state is mapped to props
// DevFilesList = connect(mapStateToProps)(DevFilesList);
//
//
// export default DevFilesContainer = createContainer(({params}) => {
//
//
//     let devFilesData = ClientDataServices.getDevFilesData(params.userContext);
//
//     return(
//         {
//             wpFiles: devFilesData.wpFiles,
//             designFiles: devFilesData.designFiles,
//             unknownFiles: devFilesData.unknownFiles
//         }
//     )
//
//
// }, DevFilesList);