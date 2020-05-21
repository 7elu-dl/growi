
import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from './UnstatedUtils';

import AppContainer from '../services/AppContainer';

const EmptyTrashModal = (props) => {
  const {
    t, isOpen, toggle,
  } = props;

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="grw-create-page">
      <ModalHeader tag="h4" toggle={toggle} className="bg-danger text-light">
        { t('modal_empty.empty_the_trash')}
      </ModalHeader>
      <ModalBody>
        完全削除したページは元に戻すことができません
      </ModalBody>
      <ModalFooter>
        {/* TODO add error message */}
        <button type="submit" className="btn btn-danger">
          <i className="icon-trash" aria-hidden="true"></i>
            Empty
        </button>
      </ModalFooter>
    </Modal>

  );
};


/**
 * Wrapper component for using unstated
 */
const EmptyTrashModalWrapper = (props) => {
  return createSubscribedElement(EmptyTrashModal, props, [AppContainer]);
};


EmptyTrashModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default withTranslation()(EmptyTrashModalWrapper);
