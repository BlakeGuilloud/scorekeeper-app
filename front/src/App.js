import React, { Component } from 'react';

import './App.css';
import * as Actions from './actions';
import Preview from './components/Preview';
import UploadForm from './components/UploadForm';

class App extends Component {
  state = this.initialState;

  get initialState() {
    return {
      bucketKey: '',
      err: null,
      fileName: '',
      rankings: [],
      preview: false,
      uploadInProgress: false,
    };
  }

  handleUploadFile = (event) => {
    this.setState({ uploadInProgress: true });

    const reader = new FileReader();
    const file = event.target.files[0];

    reader.addEventListener('load', () => {
      const payload = {
        fileData: reader.result,
        fileType: file.type,
        fileName: file.name,
      };

      Actions.uploadFile(payload)
        .then((data) => {
          const { bucketKey, fileName, rankings, err } = data;

          this.setState({
            bucketKey,
            fileName,
            rankings,
            err,
            preview: err ? false : true,
            uploadInProgress: false,
          });
        })
        .catch((err) => {
          this.setState({ err });
          // eslint-disable-next-line
          console.error(err);
        });
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  handleResetState = () => {
    this.setState(this.initialState);
  }

  render() {
    return (
      <div>
        <a href="https://github.com/blakeGuilloud/scorekeeper"><img style={{ position: "absolute", top: 0, right: 0, border: 0, }} src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub" /></a>
        <div className="jumbotron jumbotron-fluid">
          <div className="container">
            <h1 className="display-4">Scorekeeper</h1>
            <p className="lead">A service for calculating tournament scores into rankings.</p>
          </div>
        </div>
        <div className="container">
          {this.state.err &&
            <div className="row justify-content-center">
                <div className="alert alert-danger" role="alert">
                  Something went wrong.. Please refresh and try again!
                </div>
            </div>
          }
          <div className="row justify-content-center">
            {this.state.preview ?
              <Preview rankings={this.state.rankings} downloadUrl={`https://s3.amazonaws.com/scorekeeper-app-bucket/${this.state.bucketKey}`} handleResetState={this.handleResetState} /> :
              <UploadForm handleUploadFile={this.handleUploadFile} />
            }
          </div>
        </div>
        <footer className="footer">
          <div className="container">
            <div className="row justify-content-center text-muted">
              Blake Guilloud | 2018
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
