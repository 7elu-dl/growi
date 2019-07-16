import React, { Fragment } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';

class Importer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      esaTeamName: '',
      esaAccessToken: '',
      qiitaTeamName: '',
      qiitaAccessToken: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputValue = this.handleInputValue.bind(this);
  }


  handleInputValue(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleSubmit() {
    axios({
      method: 'POST',
      url: '/_api/admin/settings/importerEsa',
      data: { esaTeamName: this.state.esaTeamName, esaAccessToken: this.state.esaAccessToken },
    })
      .then((response) => {
        console.log(this.props);
        this.props.history.push('/');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const { esaTeamName, esaAccessToken } = this.state;
    return (
      <Fragment>
        <label>偉人 : </label>
        <input type="text" name="esaTeamName" value={esaTeamName} onChange={this.handleInputValue} />
        <label>名言 : </label>
        <input type="text" name="esaAccessToken" value={esaAccessToken} onChange={this.handleInputValue} />
        <input type="button" onClick={this.handleSubmit} value="Submit" />
      </Fragment>

    );
  }

}

export default Importer;
