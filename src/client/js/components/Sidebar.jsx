import React from 'react';
import PropTypes from 'prop-types';

import { withTranslation } from 'react-i18next';

import {
  withNavigationUIController,
  LayoutManager,
  NavigationProvider,
  ThemeProvider, modeGenerator,
} from '@atlaskit/navigation-next';

import Drawer from '@atlaskit/drawer';

import { createSubscribedElement } from './UnstatedUtils';
import AppContainer from '../services/AppContainer';

import SidebarNav from './Sidebar/SidebarNav';
import History from './Sidebar/History';
import CustomSidebar from './Sidebar/CustomSidebar';

class Sidebar extends React.Component {

  static propTypes = {
    appContainer: PropTypes.instanceOf(AppContainer).isRequired,
    navigationUIController: PropTypes.any.isRequired,
  };

  state = {
    currentContentsId: 'custom',
  };

  openDrawer = () => this.props.appContainer.setState({ isDrawerOpened: true });

  closeDrawer = () => this.props.appContainer.setState({ isDrawerOpened: false });

  itemSelectedHandler = (contentsId) => {
    const { navigationUIController } = this.props;
    const { currentContentsId } = this.state;

    // already selected
    if (currentContentsId === contentsId) {
      navigationUIController.toggleCollapse();
    }
    // switch and expand
    else {
      this.setState({ currentContentsId: contentsId });
      navigationUIController.expand();
    }
  }

  renderGlobalNavigation = () => (
    <>
      <SidebarNav currentContentsId={this.state.currentContentsId} onItemSelected={this.itemSelectedHandler} />
      <Drawer onClose={this.closeDrawer} isOpen={this.props.appContainer.state.isDrawerOpened}>
        <code>Drawer contents</code>
      </Drawer>
    </>
  );

  renderSidebarContents = () => {
    let contents = <CustomSidebar></CustomSidebar>;

    switch (this.state.currentContentsId) {
      case 'history':
        contents = <History></History>;
        break;
    }

    return contents;
  }

  render() {
    return (
      <ThemeProvider
        theme={theme => ({
          ...theme,
          context: 'product',
          mode: modeGenerator({
            product: { text: '#ffffff', background: '#334455' },
          }),
        })}
      >
        <LayoutManager
          globalNavigation={this.renderGlobalNavigation}
          productNavigation={() => null}
          containerNavigation={this.renderSidebarContents}
          experimental_hideNavVisuallyOnCollapse
          experimental_flyoutOnHover
          experimental_alternateFlyoutBehaviour
          // experimental_fullWidthFlyout
          shouldHideGlobalNavShadow
          showContextualNavigation
          topOffset={50}
        >
        </LayoutManager>
      </ThemeProvider>
    );
  }

}

const SidebarWithNavigationUI = withNavigationUIController(Sidebar);
const SidebarWithNavigationUIAndTranslation = withTranslation()(SidebarWithNavigationUI);

/**
 * Wrapper component for using unstated
 */
const SidebarWrapper = (props) => {
  return createSubscribedElement(SidebarWithNavigationUIAndTranslation, props, [AppContainer]);
};

export default () => (
  <NavigationProvider><SidebarWrapper /></NavigationProvider>
);
