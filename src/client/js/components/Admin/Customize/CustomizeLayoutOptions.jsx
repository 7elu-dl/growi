import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import CustomizeLayoutOption from './CustomizeLayoutOption';

import { createSubscribedElement } from '../../UnstatedUtils';
import AdminCustomizeContainer from '../../../services/AdminCustomizeContainer';
import AppContainer from '../../../services/AppContainer';

class CustomizeLayoutOptions extends React.Component {

  render() {
    const { adminCustomizeContainer } = this.props;

    return (
      <React.Fragment>
        <CustomizeLayoutOption
          layoutType="crowi-plus"
          isSelected={adminCustomizeContainer.state.currentLayout === 'growi'}
          onSelected={() => adminCustomizeContainer.switchLayoutType('growi')}
          labelHtml={'GROWI Enhanced Layout <small className="text-success">(Recommended)</small>'}
        >
          {/* TODO i18n */}
          <h4>Simple and Clear</h4>
          <ul>
            <li>Full screen layout and thin margins/paddings</li>
            <li>Show and post comments at the bottom of the page</li>
            <li>Affix Table-of-contents</li>
          </ul>
        </CustomizeLayoutOption>

        <CustomizeLayoutOption
          layoutType="kibela"
          isSelected={adminCustomizeContainer.state.currentLayout === 'kibela'}
          onSelected={() => adminCustomizeContainer.switchLayoutType('kibela')}
          labelHtml="Kibela Like Layout"
        >
          {/* TODO i18n */}
          <h4>Easy Viewing Structure</h4>
          <ul>
            <li>Center aligned contents</li>
            <li>Show and post comments at the bottom of the page</li>
            <li>Affix Table-of-contents</li>
          </ul>
        </CustomizeLayoutOption>

        <CustomizeLayoutOption
          layoutType="classic"
          isSelected={adminCustomizeContainer.state.currentLayout === 'crowi'}
          onSelected={() => adminCustomizeContainer.switchLayoutType('crowi')}
          labelHtml="Crowi Classic Layout"
        >
          {/* TODO i18n */}
          <h4>Separated Functions</h4>
          <ul>
            <li>Collapsible Sidebar</li>
            <li>Show and post comments in Sidebar</li>
            <li>Collapsible Table-of-contents</li>
          </ul>
        </CustomizeLayoutOption>
      </React.Fragment>
    );
  }

}

const CustomizeLayoutOptionsWrapper = (props) => {
  return createSubscribedElement(CustomizeLayoutOptions, props, [AppContainer, AdminCustomizeContainer]);
};

CustomizeLayoutOptions.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  adminCustomizeContainer: PropTypes.instanceOf(AdminCustomizeContainer).isRequired,
};

export default withTranslation()(CustomizeLayoutOptionsWrapper);
