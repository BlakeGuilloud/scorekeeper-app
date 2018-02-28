import React from 'react';
import PropTypes from 'prop-types';

const UploadForm = ({ handleUploadFile }) => (
  <form>
    <div className="form-group">
      <div>Upload a .txt file of scores to preview / download tournament rankings.</div>
    </div>
    <div className="form-group">
      <div className="custom-file">
        <input type="file" onChange={handleUploadFile} accept=".txt" className="custom-file-input" id="customFile" />
        <label className="custom-file-label" htmlFor="customFile">Upload File</label>
      </div>
    </div>
    <div>An example file format can be found <a download href="https://s3.amazonaws.com/scorekeeper-app-bucket/scores.txt">here</a>.</div>
  </form>
);

UploadForm.propTypes = {
  handleUploadFile: PropTypes.func.isRequired,
};

export default UploadForm;