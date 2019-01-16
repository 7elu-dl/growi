import React from 'react';
import PropTypes from 'prop-types';
import SearchTypeahead from '../SearchTypeahead';

// Search.SearchForm
export default class SearchForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      keyword: this.props.keyword,
      searchedKeyword: this.props.keyword,
      searchError: null,
    };

    this.onSearchError = this.onSearchError.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  search(keyword) {
    if (this.state.searchedKeyword != keyword) {
      this.props.onSearchFormChanged({keyword: keyword});
      this.setState({searchedKeyword: keyword});
    }
  }

  onSearchError(err) {
    this.setState({
      searchError: err,
    });
  }

  onSubmit(event) {
    if (event !== '') {
      event.preventDefault(); // prevent refreshing page of form tag
    }
    const input = this.refs.searchTypeahead.state.input;
    this.setState({keyword: input});
    this.search(input);
  }

  onChange(selected) {
    const page = selected[0];

    // navigate to page
    if (page != null) {
      window.location = page.path;
    }
  }

  getHelpElement() {
    return (
      <table className="table m-1 search-help">
        <caption className="text-left text-primary p-2 mb-2">
          <h5 className="m-1"><i className="icon-magnifier pr-2 mb-2"/>Search Help</h5>
        </caption>
        <tbody>
          <tr>
            <td className="text-right mt-0 pr-2 p-1"><code>keyword</code></td>
            <th className="mr-2"><h6 className="pr-2 m-0 pt-1">記事名 or 本文に<samp>"keyword"</samp>を含む</h6></th>
          </tr>
          <tr>
            <td className="text-right mt-0 pr-2 p-1"><code>a b</code></td>
            <th><h6 className="m-0 pt-1">文字列<samp>"a"</samp>と<samp>"b"</samp>を含む (スペース区切り)</h6></th>
          </tr>
          <tr>
            <td className="text-right mt-0 pr-2 p-1"><code>-keyword</code></td>
            <th><h6 className="m-0 pt-1">文字列<samp>"keyword"</samp>を含まない</h6></th>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const emptyLabel = (this.state.searchError !== null)
      ? 'Error on searching.'
      : 'No matches found on title... Hit [Enter] key so that search on contents.';

    return (
      <form ref='form' className="form form-group input-group" onSubmit={this.onSubmit}>
        <SearchTypeahead
          ref='searchTypeahead'
          crowi={this.props.crowi}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onSearchError={this.onSearchError}
          emptyLabel={emptyLabel}
          promptText={this.getHelpElement()}
          keywordOnInit={this.state.keyword}
        />
          <span className="input-group-btn">
            <button type="submit" className="btn btn-default">
              <i className="search-top-icon icon-magnifier"></i>
            </button>
          </span>
      </form>
    );
  }
}

SearchForm.propTypes = {
  crowi: PropTypes.object.isRequired,
  keyword: PropTypes.string,
  onSearchFormChanged: PropTypes.func.isRequired,
};
SearchForm.defaultProps = {
};
