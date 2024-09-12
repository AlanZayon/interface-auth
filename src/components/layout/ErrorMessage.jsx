// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';


const ErrorMessage = ({ error }) => {
  return error ? <div className="text-danger">{error}</div> : null;
};

ErrorMessage.propTypes = {
    error: PropTypes.string, 
  };

export default ErrorMessage;
