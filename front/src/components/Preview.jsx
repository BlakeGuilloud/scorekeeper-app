import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const Preview = ({ rankings, downloadUrl, handleResetState }) => (
  <Fragment>
    <table className="table">
      <thead className="thead-dark">
        <tr>
          <th scope="col"># Rank</th>
          <th scope="col">Name</th>
          <th scope="col">Points</th>
        </tr>
      </thead>
      <tbody>
        {rankings.map((item, idx) => (
            <tr key={idx}>
              <td>{item.rank}</td>
              <td>{item.name}</td>
              <td>{item.points}</td>
            </tr>
          )
        )}
      </tbody>
    </table>

    <div className="text-center">
      <div>
        <a download href={downloadUrl}>
          Download .txt file
        </a>
      </div>

      <div>
        <a href="" onClick={handleResetState}>
          Back to Form
        </a>
      </div>
    </div>
  </Fragment>
);

Preview.propTypes = {
  downloadUrl: PropTypes.string.isRequired,
  handleResetState: PropTypes.func.isRequired,
  rankings: PropTypes.array.isRequired,
};

export default Preview;