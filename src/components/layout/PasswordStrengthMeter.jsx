// eslint-disable-next-line no-unused-vars
import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';
import { FloatingFocusManager, FloatingArrow } from '@floating-ui/react';

const PasswordStrengthMeter = ({
  isOpen,
  strengthCriteria,
  strength,
  refs,
  floatingStyles,
  getFloatingProps,
  context,
  arrowRef,
}) => {
  const getProgressVariant = () => {
    if (strength <= 2) return 'danger';
    if (strength === 3) return 'warning';
    if (strength === 4) return 'info';
    if (strength === 5) return 'success';
  };
  return (
    isOpen && (
      <FloatingFocusManager context={context} modal={false} disabled>
        <div
          className="floating"
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <ul>
            <li className={strengthCriteria.length ? "text-success" : ""}>12 caracteres ou mais</li>
            <li className={strengthCriteria.lowercase ? "text-success" : ""}>Pelo menos uma letra minúscula</li>
            <li className={strengthCriteria.uppercase ? "text-success" : ""}>Pelo menos uma letra maiúscula</li>
            <li className={strengthCriteria.number ? "text-success" : ""}>Pelo menos um número</li>
            <li className={strengthCriteria.specialChar ? "text-success" : ""}>Pelo menos um caractere especial</li>
          </ul>

          <ProgressBar
            now={strength * 20}
            variant={getProgressVariant()}
            className="mt-2"
            label={`${strength}/5`}
          />

          <FloatingArrow ref={arrowRef} context={context} />
        </div>
      </FloatingFocusManager>
    )
  );
};

// Adicionando PropTypes para validação de props
PasswordStrengthMeter.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  strength: PropTypes.number.isRequired,
  strengthCriteria: PropTypes.shape({
    length: PropTypes.bool.isRequired,
    lowercase: PropTypes.bool.isRequired,
    uppercase: PropTypes.bool.isRequired,
    number: PropTypes.bool.isRequired,
    specialChar: PropTypes.bool.isRequired,
  }).isRequired,
  refs: PropTypes.shape({
    setFloating: PropTypes.func.isRequired,
  }).isRequired,
  floatingStyles: PropTypes.object.isRequired,
  getFloatingProps: PropTypes.func.isRequired,
  context: PropTypes.object.isRequired,
  arrowRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default PasswordStrengthMeter;
