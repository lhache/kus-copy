import React, { Component } from 'react';
import R from 'ramda';
import { copyFiles } from '../scripts/copy';
import MessageConsole from './MessageConsole';
import styles from './CopyForm.css';

export default class CopyForm extends Component {

  state = {
    srcFolder: '',
    destFolder: '',
    files: ['XKCD', 'XKCE'],
    fileInputField: 'XKCD,XKCE',
    messages: []
  }
  // lifecycle hooks
  componentDidMount() {
    this.setupInput();
  }
  componentDidUpdate() {
    this.setupInput();
  }

  // custom
  setupInput() {
    this.refs.SourceFolder.directory = true;
    this.refs.SourceFolder.webkitdirectory = true;
    this.refs.DestFolder.directory = true;
    this.refs.DestFolder.webkitdirectory = true;
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.resetMessages();
    setTimeout(() => {
      copyFiles(this.state.srcFolder, this.state.destFolder, this.state.files, this.stackMessage);
    }, 100);
  }

  resetMessages = () => {
    this.setState({
      messages: []
    });
  }

  stackMessage = (message) => {
    // log FTW
    console.log(message);

    // stack in state
    this.setState({
      messages: R.flatten(R.append(message, this.state.messages))
    });
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    // input type=file will return a fake path so get the right one
    // https://github.com/electron/electron/issues/2480
    if (name === 'srcFolder' || name === 'destFolder') {
      this.setState({
        [name]: R.head(target.files).path
      });
    }
    else if (name === 'fileInputField') {
      this.setState({
        [name]: value,
        files: R.map(R.trim, R.split(',', value)).filter(item => item !== '')
      });
    }
  }

  render() {
    return (
      <div>
        <div className={styles.formContainer}>
          <form onSubmit={this.onSubmit}>
            <section>
                <label>
                  <p>Select destination folder (most likely your dropbox)</p>
                  <input
                    onChange={this.handleChange}
                    name="srcFolder"
                    ref="SourceFolder"
                    type="file"
                    required
                  />
                </label>
              </section>
              <section>
                <label>
                  <p>Select destination folder (your new catalog folder)</p>
                  <input
                    onChange={this.handleChange}
                    name="destFolder"
                    type="file"
                    ref="DestFolder"
                    required
                  />
                </label>
              </section>
              <section>
                <label>
                  <p>Paste product IDs (single one or comma separated like ABCD, BCDE)</p>
                  <textarea
                    value={this.state.fileInputField}
                    name="fileInputField"
                    onChange={this.handleChange}
                    required
                  />
                </label>
              </section>

            <button type="submit">Submit</button>
          </form>
        </div>
        <div className={styles.consoleContainer}>
          <MessageConsole messages={this.state.messages} />
        </div>
      </div>
    )
  }
}
