// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';


const ErrorMessage = ({ error }) => {
  return error ? <div className="text-danger">{error}</div> : null;
};

// Adicionando validação de props
ErrorMessage.propTypes = {
    error: PropTypes.string, // Define que `error` deve ser uma string
  };

export default ErrorMessage;
