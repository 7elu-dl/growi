
import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';

import { withTranslation } from 'react-i18next';

import { createSubscribedElement } from './UnstatedUtils';
import PageContainer from '../services/PageContainer';

import ApiErrorMessage from './PageManagement/ApiErrorMessage';

const PageDeleteModal = (props) => {
  const {
    t, pageContainer, isOpen, toggle, isDeleteCompletelyModal, path, isAbleToDeleteCompletely,
  } = props;
  const [isDeleteRecursively, setIsDeleteRecursively] = useState(true);
  const [isDeleteCompletely, setIsDeleteCompletely] = useState(isDeleteCompletelyModal);
  const deleteMode = isDeleteCompletely ? 'completely' : 'temporary';
  const [errorCode, setErrorCode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  function changeIsDeleteRecursivelyHandler() {
    setIsDeleteRecursively(!isDeleteRecursively);
  }


  function changeIsDeleteCompletelyHandler() {
    setIsDeleteCompletely(!isDeleteCompletely);
  }

  async function deleteButtonHandler() {
    setErrorCode(null);
    setErrorMessage(null);

    try {
      const response = await pageContainer.deletePage(isDeleteRecursively, isDeleteCompletely);
      const trashPagePath = response.page.path;
      window.location.href = encodeURI(trashPagePath);
    }
    catch (err) {
      setErrorCode(err.code);
      setErrorMessage(err.message);
    }
  }

  function renderDeleteRecursivelyForm() {
    return (
      <div className="custom-control custom-checkbox custom-checkbox-warning">
        <input
          className="custom-control-input"
          id="deleteRecursively"
          type="checkbox"
          checked={isDeleteRecursively}
          onChange={changeIsDeleteRecursivelyHandler}
        />
        <label className="custom-control-label" htmlFor="deleteRecursively">
          { t('modal_delete.delete_recursively') }
          <p className="form-text text-muted mt-0"><code>{path}</code> { t('modal_delete.recursively') }</p>
        </label>
      </div>
    );
  }

  function renderDeleteCompletelyForm() {
    return (
      <div className="custom-control custom-checkbox custom-checkbox-danger">
        <input
          className="custom-control-input"
          name="completely"
          id="deleteCompletely"
          type="checkbox"
          disabled={!isAbleToDeleteCompletely}
          checked={isDeleteCompletely}
          onChange={changeIsDeleteCompletelyHandler}
        />
        <label className="custom-control-label text-danger" htmlFor="deleteCompletely">
          { t('modal_delete.delete_completely') }
          <p className="form-text text-muted mt-0"> { t('modal_delete.completely') }</p>
        </label>
        {!isAbleToDeleteCompletely
    && <p className="alert alert-warning p-2 my-0"><i className="icon-ban icon-fw"></i>{ t('modal_delete.delete_completely_restriction') }</p>}
      </div>
    );
  }

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
        {renderDeleteRecursivelyForm()}
        {!isDeleteCompletelyModal && renderDeleteCompletelyForm()}
      </ModalBody>
      <ModalFooter>
        <ApiErrorMessage errorCode={errorCode} errorMessage={errorMessage} linkPath={path} />
        <button type="button" className={`m-l-10 btn btn-${deleteIconAndKey[deleteMode].color}`} onClick={deleteButtonHandler}>
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
  return createSubscribedElement(PageDeleteModal, props, [PageContainer]);
};

PageDeleteModal.propTypes = {
  t: PropTypes.func.isRequired, //  i18next
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,

  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,

  path: PropTypes.string.isRequired,
  isDeleteCompletelyModal: PropTypes.bool,
  isAbleToDeleteCompletely: PropTypes.bool,
};

PageDeleteModal.defaultProps = {
  isDeleteCompletelyModal: false,
};

export default withTranslation()(PageDeleteModalWrapper);
