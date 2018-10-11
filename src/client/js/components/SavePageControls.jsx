import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import SlackNotification from './SlackNotification';
import GrantSelector from './SavePageControls/GrantSelector';

class SavePageControls extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      pageId: this.props.pageId,
    };

    this.getCurrentOptionsToSave = this.getCurrentOptionsToSave.bind(this);
    this.submit = this.submit.bind(this);
  }

  componentWillMount() {
  }

  getCurrentOptionsToSave() {
    const slackNotificationOptions = this.refs.slackNotification.getCurrentOptionsToSave();
    const grantSelectorOptions = this.refs.grantSelector.getCurrentOptionsToSave();
    return Object.assign(slackNotificationOptions, grantSelectorOptions);
  }

  /**
   * update pageId of state
   * @param {string} pageId
   */
  setPageId(pageId) {
    this.setState({pageId});
  }

  submit() {
    this.props.onSubmit();
  }

  render() {
    const { t } = this.props;

    const acl_enable = this.props.acl_enable;
    const label = this.state.pageId == null ? t('Create') : t('Update');

    return (
      <div className="d-flex align-items-center form-inline">
        <div className="mr-2">
          <SlackNotification
              ref='slackNotification'
              crowi={this.props.crowi}
              pageId={this.props.pageId}
              pagePath={this.props.pagePath}
              isSlackEnabled={false}
              slackChannels={this.props.slackChannels} />
        </div>


        {acl_enable &&
          <div className="mr-2">
            <GrantSelector crowi={this.props.crowi}
                ref={(elem) => {
                  if (this.refs.grantSelector == null) {
                    this.refs.grantSelector = elem.getWrappedInstance();
                  }
                }}
                grant={this.props.grant}
                grantGroupId={this.props.grantGroupId}
                grantGroupName={this.props.grantGroupName} />
          </div>
        }

        <button className="btn btn-primary btn-submit" onClick={this.submit}>{label}</button>
      </div>
    );
  }
}

SavePageControls.propTypes = {
  t: PropTypes.func.isRequired,               // i18next
  crowi: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  pageId: PropTypes.string,
  // for SlackNotification
  pagePath: PropTypes.string,
  slackChannels: PropTypes.string,
  // for GrantSelector
  grant: PropTypes.number,
  grantGroupId: PropTypes.string,
  grantGroupName: PropTypes.string,
  acl_enable: PropTypes.bool,
};

export default translate()(SavePageControls);
