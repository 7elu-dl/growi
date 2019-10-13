import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

class ExportingProgressBar extends React.Component {


  render() {
    const {
      header, currentCount, totalCount, isInProgress,
    } = this.props;

    const percentage = currentCount / totalCount * 100;
    const isActive = (isInProgress != null)
      ? isInProgress
      : (currentCount !== totalCount);

    return (
      <>
        <h5 className="my-1">
          {header}
          <div className="pull-right">{currentCount} / {totalCount}</div>
        </h5>
        <div className="progress progress-sm">
          <div
            className={`progress-bar ${isActive ? 'progress-bar-info progress-bar-striped active' : 'progress-bar-success'}`}
            style={{ width: `${percentage}%` }}
          >
            <span className="sr-only">{percentage.toFixed(0)}% Complete</span>
          </div>
        </div>
      </>
    );
  }

}

ExportingProgressBar.propTypes = {
  header: PropTypes.string.isRequired,
  currentCount: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  isInProgress: PropTypes.bool,
};

export default withTranslation()(ExportingProgressBar);
