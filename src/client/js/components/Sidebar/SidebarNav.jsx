import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import EditIcon from '@atlaskit/icon/glyph/edit';
import TrayIcon from '@atlaskit/icon/glyph/tray';

import {
  GlobalNav,
} from '@atlaskit/navigation-next';

import { createSubscribedElement } from '../UnstatedUtils';
import AppContainer from '../../services/AppContainer';


class SidebarNav extends React.Component {

  static propTypes = {
    onItemSelected: PropTypes.func,
  };

  state = {
  };

  itemSelectedHandler = (contentsId) => {
    const { onItemSelected } = this.props;
    if (onItemSelected != null) {
      onItemSelected(contentsId);
    }
  }

  render() {
    return (
      <GlobalNav
        primaryItems={[
          {
            id: 'custom', icon: EditIcon, label: 'Custom Sidebar', onClick: () => this.itemSelectedHandler('custom'),
          },
          {
            id: 'drawer', icon: TrayIcon, label: 'Drawer', onClick: () => this.itemSelectedHandler('drawer'),
          },
        ]}
        secondaryItems={[]}
      />
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const SidebarNavWrapper = (props) => {
  return createSubscribedElement(SidebarNav, props, [AppContainer]);
};

export default withTranslation()(SidebarNavWrapper);
