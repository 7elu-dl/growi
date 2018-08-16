import React from 'react';
import PropTypes from 'prop-types';

import Modal from 'react-bootstrap/es/Modal';
import Button from 'react-bootstrap/es/Button';
import ButtonGroup from 'react-bootstrap/es/ButtonGroup';
import Navbar from 'react-bootstrap/es/Navbar';
import Nav from 'react-bootstrap/es/Nav';
import NavDropdown from 'react-bootstrap/es/NavDropdown';
import MenuItem from 'react-bootstrap/es/MenuItem';

import { HotTable } from '@handsontable/react';

export default class HandsontableModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
    };

    this.settings = {
      data: this.data,
      height: 300,
      rowHeaders: true,
      colHeaders: true,
      fixedRowsTop: [0, 1],
      contextMenu: ['row_above', 'row_below', 'col_left', 'col_right', '---------', 'remove_row', 'remove_col', '---------', 'alignment'],
      stretchH: 'all',
      selectionMode: 'multiple',
    };

    this.initData(this.props.data);

    this.cancel = this.cancel.bind(this);
  }

  initData(data) {
    const initData = data || [
      ['col1', 'col2', 'col3'],
      ['', '', ''],
      ['', '', ''],
    ];
    this.setState({ data: initData });
  }

  show(data, doneHandler) {
    this.initData(data);
    this.setState({ show: true });
  }

  cancel() {
    this.setState({ show: false });
  }

  render() {
    return (
      <Modal show={this.state.show} onHide={this.cancel} bsSize="large">
        <Modal.Header closeButton>
          <Modal.Title>Edit Table</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Navbar>
            <Nav>
              <NavDropdown title="Data">
                <MenuItem>Paste HTML <code>&lt;table&gt;</code> tag</MenuItem>
                <MenuItem>Paste CSV</MenuItem>
                <MenuItem>Paste TSV</MenuItem>
                <MenuItem>Paste Excel data</MenuItem>
              </NavDropdown>
            </Nav>
            <Navbar.Form>
              <ButtonGroup>
                <Button><i className="ti-align-left"></i></Button>
                <Button><i className="ti-align-center"></i></Button>
                <Button><i className="ti-align-right"></i></Button>
              </ButtonGroup>
            </Navbar.Form>
          </Navbar>
          <HotTable data={this.state.data} settings={this.settings} />
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between">
            <Button bsStyle="danger" onClick={() => this.initData(this.props.data)}>Reset</Button>
            <div className="d-flex">
              <Button bsStyle="default" onClick={this.cancel}>Cancel</Button>
              <Button bsStyle="primary">Done</Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    );
  }
}

HandsontableModal.propTypes = {
  data: PropTypes.object,
};
