import { useState, useRef, useEffect } from 'react';
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  arrow,
} from '@floating-ui/react';
import { useQueryParams } from "../hooks/useQueryParams";

const useForm = (handleRegister) => {

  // Função para obter parâmetros da URL
  function getParameterByName(name) {
    const url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  const queryParams = useQueryParams();
  const [formData, setFormData] = useState({
    username: queryParams.name || "",
    email: queryParams.email || "",
    confirmEmail: queryParams.email || "",
    password: '',
    confirmPassword: '',
    dateOfBirth: '', // Adiciona data de nascimento
  });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const arrowRef = useRef(null);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [offset(10), flip(), shift(), arrow({
      element: arrowRef,
    })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context, { enabled: true, toggle: false });
  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      if (!refs.reference.current.contains(event.target) && !refs.floating.current.contains(event.target)) {
        setIsOpen(false);
      }
    },
  });
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  const handleFocus = () => {
    setIsOpen(true);
    refs.reference.current.focus();
  };

  const handleBlur = (event) => {
    if (refs.floating.current && !refs.floating.current.contains(event.relatedTarget)) {
      setIsOpen(false);
    }
  };

  // Atualiza formData com os valores dos parâmetros da URL
  useEffect(() => {
    const nameParam = getParameterByName("name");
    const emailParam = getParameterByName("email");

    setFormData((prevFormData) => ({
      ...prevFormData,
      username: nameParam || "",
      email: emailParam || "",
      confirmEmail: emailParam || "",
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });
    calculateStrength(value);
  };

  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    setStrength(score);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData, strength);
    await handleRegister(formData, setErrors, validationErrors);


  };

  const validateForm = (formData, strength) => {
    let validationErrors = {};

    if (!formData.username.trim()) {
      validationErrors.username = 'Username is required';
    }
    if (!formData.email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = 'Email is invalid';
    }
    if (!formData.confirmEmail) {
      validationErrors.confirmEmail = 'Confirm Email is required';
    } else if (formData.email !== formData.confirmEmail) {
      validationErrors.confirmEmail = 'Emails do not match';
    }
    if (!formData.password) {
      validationErrors.password = 'Password is required';
    } else if (strength < 4) {
      validationErrors.password = 'Password is too weak';
    }
    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.dateOfBirth) {
      validationErrors.dateOfBirth = 'Date of Birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDifference = today.getMonth() - dob.getMonth();
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        validationErrors.dateOfBirth = 'You must be at least 18 years old';
      }
    }

    return validationErrors;
  };


  return {
    formData,
    errors,
    handleChange,
    handleSubmit,
    handlePasswordChange,
    strength,
    isOpen,
    refs,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
    handleFocus,
    handleBlur,
    arrowRef,
    context,
  };
};

export default useForm;
