import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import GrowiZipUploadForm from './GrowiZipUploadForm';
import GrowiZipImportForm from './GrowiZipImportForm';
import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';
// import { toastSuccess, toastError } from '../../../util/apiNotification';

class GrowiZipImportSection extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fileName: '',
      fileStats: [],
    };

    this.inputRef = React.createRef();

    this.handleUpload = this.handleUpload.bind(this);
  }

  handleUpload({ meta, fileName, fileStats }) {
    this.setState({ fileName, fileStats });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { t } = this.props;

    return (
      <Fragment>
        <legend>Import from GROWI</legend>
        <div className="well well-sm small">
          <ul>
            <li>Imported documents will overwrite existing pages</li>
          </ul>
        </div>
        <GrowiZipUploadForm
          onUpload={this.handleUpload}
        />
        {this.state.fileName && (
          <GrowiZipImportForm
            fileName={this.state.fileName}
            fileStats={this.state.fileStats}
          />
        )}
      </Fragment>
    );
  }

}

GrowiZipImportSection.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,
};

/**
 * Wrapper component for using unstated
 */
const GrowiZipImportSectionWrapper = (props) => {
  return createSubscribedElement(GrowiZipImportSection, props, [AppContainer]);
};

export default withTranslation()(GrowiZipImportSectionWrapper);
