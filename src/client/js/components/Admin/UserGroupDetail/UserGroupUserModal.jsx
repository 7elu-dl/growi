import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Modal from 'react-bootstrap/es/Modal';

import UserGroupUserFormByInput from './UserGroupUserFormByInput';
import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';
import UserGroupDetailContainer from '../../../services/UserGroupDetailContainer';

class UserGroupUserModal extends React.Component {

  render() {
    const { t, userGroupDetailContainer } = this.props;

    return (
      <Modal show={userGroupDetailContainer.state.isUserGroupUserModalOpen} onHide={userGroupDetailContainer.closeUserGroupUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t('user_group_management.add_user')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserGroupUserFormByInput />
          <div className="row mt-4">
            <div className="col-xs-12">
              <legend>検索時に有効にする</legend>
              <div className="col-xs-6 my-1" key="isAlsoMailSearched">
                <div className="checkbox checkbox-info">
                  <input
                    type="checkbox"
                    id="isAlsoMailSearched"
                    className="form-check-input"
                    checked={userGroupDetailContainer.state.isAlsoMailSearched}
                    onChange={userGroupDetailContainer.switchIsAlsoMailSearched}
                  />
                  <label className="text-capitalize form-check-label ml-3" htmlFor="isAlsoMailSearched">
                    Mail
                  </label>
                </div>
              </div>
              <div className="col-xs-6 my-1" key="isAlsoNameSearched">
                <div className="checkbox checkbox-info">
                  <input
                    type="checkbox"
                    id="isAlsoNameSearched"
                    className="form-check-input"
                    checked={userGroupDetailContainer.state.isAlsoNameSearched}
                    onChange={userGroupDetailContainer.switchIsAlsoNameSearched}
                  />
                  <label className="text-capitalize form-check-label ml-3" htmlFor="isAlsoNameSearched">
                    Name
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

}

UserGroupUserModal.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  userGroupDetailContainer: PropTypes.instanceOf(UserGroupDetailContainer).isRequired,
};

/**
 * Wrapper component for using unstated
 */
const UserGroupUserModalWrapper = (props) => {
  return createSubscribedElement(UserGroupUserModal, props, [AppContainer, UserGroupDetailContainer]);
};

export default withTranslation()(UserGroupUserModalWrapper);
