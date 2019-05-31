import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import ButtonToolbar from 'react-bootstrap/es/ButtonToolbar';
import SplitButton from 'react-bootstrap/es/SplitButton';
import MenuItem from 'react-bootstrap/es/MenuItem';

import PageContainer from '../services/PageContainer';
import AppContainer from '../services/AppContainer';

import { createSubscribedElement } from './UnstatedUtils';
import SlackNotification from './SlackNotification';
import GrantSelector from './SavePageControls/GrantSelector';


class SavePageControls extends React.PureComponent {

  constructor(props) {
    super(props);

    const config = this.props.appContainer.getConfig();
    this.hasSlackConfig = config.hasSlackConfig;
    this.isAclEnabled = config.isAclEnabled;

    this.submit = this.submit.bind(this);
    this.submitAndOverwriteScopesOfDescendants = this.submitAndOverwriteScopesOfDescendants.bind(this);
  }

  componentWillMount() {
  }

  submit() {
    this.props.appContainer.setIsDocSaved(true);
    this.props.onSubmit();
  }

  submitAndOverwriteScopesOfDescendants() {
    this.props.onSubmit({ overwriteScopesOfDescendants: true });
  }

  render() {
    const { t } = this.props;
    const labelSubmitButton = this.props.pageContainer.state.pageId == null ? t('Create') : t('Update');
    const labelOverwriteScopes = t('page_edit.overwrite_scopes', { operation: labelSubmitButton });

    return (
      <div className="d-flex align-items-center form-inline">
        {this.hasSlackConfig
          && (
          <div className="mr-2">
            <SlackNotification
              isSlackEnabled={false}
            />
          </div>
          )
        }

        {this.isAclEnabled
          && (
          <div className="mr-2">
            <GrantSelector />
          </div>
          )
        }

        <ButtonToolbar>
          <SplitButton
            id="spl-btn-submit"
            bsStyle="primary"
            className="btn-submit"
            dropup
            pullRight
            onClick={this.submit}
            title={labelSubmitButton}
          >
            <MenuItem eventKey="1" onClick={this.submitAndOverwriteScopesOfDescendants}>{labelOverwriteScopes}</MenuItem>
            {/* <MenuItem divider /> */}
          </SplitButton>
        </ButtonToolbar>
      </div>
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const SavePageControlsWrapper = (props) => {
  return createSubscribedElement(SavePageControls, props, [AppContainer, PageContainer]);
};

SavePageControls.propTypes = {
  t: PropTypes.func.isRequired, // i18next

  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,

  onSubmit: PropTypes.func.isRequired,
};

export default withTranslation()(SavePageControlsWrapper);
