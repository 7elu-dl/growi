import React from 'react';
import PropTypes from 'prop-types';

import AppContainer from '../services/AppContainer';
import PageContainer from '../services/PageContainer';

import { createSubscribedElement } from './UnstatedUtils';
import RevisionRenderer from './Page/RevisionRenderer';
import HandsontableModal from './PageEditor/HandsontableModal';
import MarkdownTable from '../models/MarkdownTable';
import mtu from './PageEditor/MarkdownTableUtil';

class Page extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      currentTargetTableArea: null,
    };

    this.saveHandlerForHandsontableModal = this.saveHandlerForHandsontableModal.bind(this);
  }

  /**
   * launch HandsontableModal with data specified by arguments
   * @param beginLineNumber
   * @param endLineNumber
   */
  launchHandsontableModal(beginLineNumber, endLineNumber) {
    const markdown = this.props.pageContainer.state.markdown;
    const tableLines = markdown.split(/\r\n|\r|\n/).slice(beginLineNumber - 1, endLineNumber).join('\n');
    this.setState({ currentTargetTableArea: { beginLineNumber, endLineNumber } });
    this.handsontableModal.show(MarkdownTable.fromMarkdownString(tableLines));
  }

  saveHandlerForHandsontableModal(markdownTable) {
    const newMarkdown = mtu.replaceMarkdownTableInMarkdown(
      markdownTable,
      this.props.pageContainer.state.markdown,
      this.state.currentTargetTableArea.beginLineNumber,
      this.state.currentTargetTableArea.endLineNumber,
    );
    this.props.onSaveWithShortcut(newMarkdown);
    this.setState({ currentTargetTableArea: null });
  }

  render() {
    const isMobile = this.props.appContainer.isMobile;

    return (
      <div className={isMobile ? 'page-mobile' : ''}>
        <RevisionRenderer
          crowiRenderer={this.props.crowiRenderer}
        />
        <HandsontableModal ref={(c) => { this.handsontableModal = c }} onSave={this.saveHandlerForHandsontableModal} />
      </div>
    );
  }

}

/**
 * Wrapper component for using unstated
 */
const PageWrapper = (props) => {
  return createSubscribedElement(Page, props, [AppContainer, PageContainer]);
};


Page.propTypes = {
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
  pageContainer: PropTypes.instanceOf(PageContainer).isRequired,

  crowiRenderer: PropTypes.object.isRequired,
  onSaveWithShortcut: PropTypes.func.isRequired,
};

export default PageWrapper;
