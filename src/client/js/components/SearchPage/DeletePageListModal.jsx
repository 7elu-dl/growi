import React from 'react';
import PropTypes from 'prop-types';

// TODO: GW-333
// import Checkbox from 'react-bootstrap/es/Checkbox';

import {
  Button,
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

export default class DeletePageListModal extends React.Component {

  /*
   * the threshold for omitting body
   */
  static get OMIT_BODY_THRES() { return 400 }

  componentWillMount() {
  }

  render() {
    if (this.props.pages == null || this.props.pages.length === 0) {
      return <div></div>;
    }

    const listView = this.props.pages.map((page) => {
      return (
        <li key={page._id}>{page.path}</li>
      );
    });

    return (
      <Modal isOpen={this.props.isShown} toggle={this.props.cancel} className="page-list-delete-modal">
        <ModalHeader className="border-bottom" toggle={this.props.cancel}>
          Deleting pages:
        </ModalHeader>
        <ModalBody className="border-bottom">
          <ul className="m-0">
            {listView}
          </ul>
        </ModalBody>
        <ModalFooter>
          <div className="d-flex justify-content-between">
            <span className="text-danger">{this.props.errorMessage}</span>
            <span className="d-flex align-items-center">
              <label className="text-danger mb-0 mr-3">
                <input type="checkbox" onClick={this.props.toggleDeleteCompletely} className="align-middle mr-2" />Delete completely
              </label>
              <span className="m-l-10">
                <Button color="secondary" onClick={this.props.confirmedToDelete}><i className="icon-trash"></i>Delete</Button>
              </span>
            </span>
          </div>
        </ModalFooter>
      </Modal>
    );
  }

}

DeletePageListModal.propTypes = {
  isShown: PropTypes.bool.isRequired,
  pages: PropTypes.array,
  errorMessage: PropTypes.string,
  cancel: PropTypes.func.isRequired, //                 for cancel evnet handling
  confirmedToDelete: PropTypes.func.isRequired, //      for confirmed event handling
  toggleDeleteCompletely: PropTypes.func.isRequired, // for delete completely check event handling
};
