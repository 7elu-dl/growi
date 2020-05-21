
import React from 'react';
import PropTypes from 'prop-types';

import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from './UnstatedUtils';

import AppContainer from '../services/AppContainer';

const PageDeleteModal = (props) => {
  const {
    t, isOpen, toggle, onClickSubmit, isDeleteCompletely, path,
  } = props;
  const deleteMode = isDeleteCompletely ? 'completely' : 'temporary';

  const deleteIconAndKey = {
    completely: {
      color: 'danger',
      icon: 'fire',
      translationKey: 'completely',
    },
    temporary: {
      color: 'primary',
      icon: 'trash',
      translationKey: 'page',
    },
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} className="grw-create-page">
      <ModalHeader tag="h4" toggle={toggle} className={`bg-${deleteIconAndKey[deleteMode].color} text-light`}>
        <i className={`icon-fw icon-${deleteIconAndKey[deleteMode].icon}`}></i>
        { t(`modal_delete.delete_${deleteIconAndKey[deleteMode].translationKey}`) }
      </ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>{ t('modal_delete.deleting_page') }:</label><br />
          <code>{ path }</code>
        </div>
      </ModalBody>
      <ModalFooter>
        <button type="button" className={`m-l-10 btn btn-${deleteIconAndKey[deleteMode].color}`} onClick={onClickSubmit}>
          <i className={`icon-${deleteIconAndKey[deleteMode].icon}`} aria-hidden="true"></i>
          { t(`modal_delete.delete_${deleteIconAndKey[deleteMode].translationKey}`) }
        </button>
      </ModalFooter>
    </Modal>

  );
};


/**
 * Wrapper component for using unstated
 */
const PageDeleteModalWrapper = (props) => {
  return createSubscribedElement(PageDeleteModal, props, [AppContainer]);
};


PageDeleteModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onClickSubmit: PropTypes.func.isRequired,

  path: PropTypes.string.isRequired,
  isDeleteCompletely: PropTypes.bool,
};

PageDeleteModal.defaultProps = {
  isDeleteCompletely: false,
};

export default withTranslation()(PageDeleteModalWrapper);
