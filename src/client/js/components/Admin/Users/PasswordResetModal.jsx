import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import Modal from 'react-bootstrap/es/Modal';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class PasswordResetModal extends React.Component {

  render() {
    const { t, user } = this.props;

    return (
      <div>
        {this.props.isResetDone
          ? (
            <Modal show={this.props.isOpenPasswordResetDoneModal} onHide={this.props.onHideDoneModal}>
              <Modal.Header className="modal-header" closeButton>
                <Modal.Title>
                  { t('user_management.reset_password') }
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <p className="alert alert-danger">{ t('user_management.password_reset_message') }</p>
                  <p>
                    { t('user_management.target_user') }: <code>{ user.email }</code>
                  </p>
                  <p>
                    { t('user_management.new_password') }: <code>{ this.props.temporaryPassword }</code>
                  </p>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <div>
                  <button type="submit" className="btn btn-primary" onClick={this.props.onHideDoneModal}>OK</button>
                </div>
              </Modal.Footer>
            </Modal>
          )
          : (
            <Modal show={this.props.isOpenPasswordResetModal} onHide={this.props.onHideModal}>
              <Modal.Header className="modal-header" closeButton>
                <Modal.Title>
                  {t('user_management.reset_password')}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <p>
                    { t('user_management.password_never_seen') }<br />
                    <span className="text-danger">{ t('user_management.send_new_password') }</span>
                  </p>
                  <p>
                    { t('user_management.target_user') }: <code>{ user.email }</code>
                  </p>
                  <button type="submit" className="btn btn-primary" onClick={this.props.resetPassword}>
                    { t('user_management.reset_password')}
                  </button>
                </div>
              </Modal.Body>
            </Modal>
        )
      }
      </div>

    );
  }

}

/**
 * Wrapper component for using unstated
 */
const PasswordResetModalWrapper = (props) => {
  return createSubscribedElement(PasswordResetModal, props, [AppContainer]);
};

PasswordResetModal.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

  user: PropTypes.object.isRequired,
  isOpenPasswordResetModal: PropTypes.bool.isRequired,
  temporaryPassword: PropTypes.array.isRequired,
  onHideModal: PropTypes.func.isRequired,
  isShowDoneModal: PropTypes.func.isRequired,
  isOpenPasswordResetDoneModal: PropTypes.bool.isRequired,
  onHideDoneModal: PropTypes.func.isRequired,
  resetPassword: PropTypes.func.isRequired,
  isResetDone: PropTypes.bool,
};

export default withTranslation()(PasswordResetModalWrapper);
