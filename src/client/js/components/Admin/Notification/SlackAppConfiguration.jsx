import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  Dropdown, DropdownToggle, DropdownMenu, DropdownItem,
} from 'reactstrap';

import loggerFactory from '@alias/logger';

import { createSubscribedElement } from '../../UnstatedUtils';
import { toastSuccess, toastError } from '../../../util/apiNotification';

import AppContainer from '../../../services/AppContainer';
import AdminNotificationContainer from '../../../services/AdminNotificationContainer';
import AdminUpdateButtonRow from '../Common/AdminUpdateButtonRow';

const logger = loggerFactory('growi:slackAppConfiguration');

class SlackAppConfiguration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
    };

    this.onToggleDropdown = this.onToggleDropdown.bind(this);
    this.onClickSubmit = this.onClickSubmit.bind(this);
  }

  onToggleDropdown() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }

  async onClickSubmit() {
    const { t, adminNotificationContainer } = this.props;

    try {
      await adminNotificationContainer.updateSlackAppConfiguration();
      toastSuccess(t('notification_setting.updated_slackApp'));
    }
    catch (err) {
      toastError(err);
      logger.error(err);
    }
  }

  render() {
    const { t, adminNotificationContainer } = this.props;

    return (
      <React.Fragment>
        <div className="mb-5">
          <div className="col-xs-6 mt-3 text-left">
            <Dropdown isOpen={this.state.isDropdownOpen} toggle={this.onToggleDropdown}>
              <DropdownToggle caret>
                {`Slack ${adminNotificationContainer.state.selectSlackOption}`}
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu" role="menu">
                <DropdownItem key="Incoming Webhooks" role="presentation" onClick={() => adminNotificationContainer.switchSlackOption('Incoming Webhooks')}>
                  <a role="menuitem">Slack Incoming Webhooks</a>
                </DropdownItem>
                <DropdownItem key="App" role="presentation" onClick={() => adminNotificationContainer.switchSlackOption('App')}>
                  <a role="menuitem">Slack App</a>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        {adminNotificationContainer.state.selectSlackOption === 'Incoming Webhooks' ? (
          <React.Fragment>
            <h2 className="border-bottom mb-5">{t('notification_setting.slack_incoming_configuration')}</h2>

            <div className="row mb-5">
              <label className="col-xs-3 text-right">Webhook URL</label>
              <div className="col-xs-6">
                <input
                  className="form-control"
                  type="text"
                  defaultValue={adminNotificationContainer.state.webhookUrl}
                  onChange={e => adminNotificationContainer.changeWebhookUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="row mb-5">
              <div className="col-xs-offset-3 col-xs-6 text-left">
                <div className="custom-control custom-switch checkbox-success">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="cbPrioritizeIWH"
                    checked={adminNotificationContainer.state.isIncomingWebhookPrioritized}
                    onChange={() => { adminNotificationContainer.switchIsIncomingWebhookPrioritized() }}
                  />
                  <label className="custom-control-label" htmlFor="cbPrioritizeIWH">
                    {t('notification_setting.prioritize_webhook')}
                  </label>
                </div>
                <p className="help-block">
                  {t('notification_setting.prioritize_webhook_desc')}
                </p>
              </div>
            </div>
          </React.Fragment>
        )
          : (
            <React.Fragment>
              <h2 className="border-bottom mb-5">{t('notification_setting.slack_app_configuration')}</h2>

              <div className="well">
                <i className="icon-fw icon-exclamation text-danger"></i><span className="text-danger">NOT RECOMMENDED</span>
                <br /><br />
                {/* eslint-disable-next-line react/no-danger */}
                <span dangerouslySetInnerHTML={{ __html: t('notification_setting.slack_app_configuration_desc') }} />
                <br /><br />
                <a
                  href="#slack-incoming-webhooks"
                  data-toggle="tab"
                  onClick={() => adminNotificationContainer.switchSlackOption('Incoming Webhooks')}
                >
                  {t('notification_setting.use_instead')}
                </a>
              </div>

              <div className="row mb-5">
                <label className="col-xs-3 text-right">OAuth Access Token</label>
                <div className="col-xs-6">
                  <input
                    className="form-control"
                    type="text"
                    defaultValue={adminNotificationContainer.state.slackToken}
                    onChange={e => adminNotificationContainer.changeSlackToken(e.target.value)}
                  />
                </div>
              </div>

            </React.Fragment>
          )
        }

        <AdminUpdateButtonRow
          onClick={this.onClickSubmit}
          disabled={adminNotificationContainer.state.retrieveError != null}
        />

        <hr />

        <h3>
          <i className="icon-question" aria-hidden="true"></i>{' '}
          <a href="#collapseHelpForIwh" data-toggle="collapse">{t('notification_setting.how_to.header')}</a>
        </h3>

        <ol id="collapseHelpForIwh" className="collapse">
          <li>
            {t('notification_setting.how_to.workspace')}
            <ol>
              {/* eslint-disable-next-line react/no-danger */}
              <li dangerouslySetInnerHTML={{ __html:  t('notification_setting.how_to.workspace_desc1') }} />
              <li>{t('notification_setting.how_to.workspace_desc2')}</li>
              <li>{t('notification_setting.how_to.workspace_desc3')}</li>
            </ol>
          </li>
          <li>
            {t('notification_setting.how_to.at_growi')}
            <ol>
              {/* eslint-disable-next-line react/no-danger */}
              <li dangerouslySetInnerHTML={{ __html: t('notification_setting.how_to.at_growi_desc') }} />
            </ol>
          </li>
        </ol>

      </React.Fragment>
    );
  }

}

const SlackAppConfigurationWrapper = (props) => {
  return createSubscribedElement(SlackAppConfiguration, props, [AppContainer, AdminNotificationContainer]);
};

SlackAppConfiguration.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminNotificationContainer: PropTypes.instanceOf(AdminNotificationContainer).isRequired,

};

export default withTranslation()(SlackAppConfigurationWrapper);
