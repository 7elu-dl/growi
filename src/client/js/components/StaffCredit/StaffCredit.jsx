import React from 'react';
import keydown from 'react-keydown';

/**
 * Page staff credit component
 *
 * @export
 * @class StaffCredit
 * @extends {React.Component}
 */

export default class StaffCredit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      konamiCommand: ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', '5', '7', '3'],
      userCommand: [],
    };
  }

  @keydown('enter', 'up', 'down', 'right', 'left', '5', '7', '3')
  check(event) {
    if (this.state.konamiCommand[this.state.userCommand.length] === event.key) {
      this.setState({ userCommand: this.state.userCommand.concat(event.key) });
    }
    else {
      this.state.userCommand = [];
    }
  }

  render() {
    const isRender = this.state.userCommand.length === this.state.konamiCommand.length;
    if (isRender) {
      return <div>スタッフロール</div>;
    }
    return null;
  }

}

StaffCredit.propTypes = {
};
