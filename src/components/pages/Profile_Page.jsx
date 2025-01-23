import React, { useState, useRef, useEffect } from 'react';
import { auth } from "../../services/firebaseConfig";
import { Container, Button, Row } from 'react-bootstrap';
import { FaEdit, FaCog } from 'react-icons/fa';
import { signOut, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import ChangePasswordForm from '../layout/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext';
import CardTreatment from '../common/CardProfileTreatment';
import ModalNewEmail from '../common/ModalNewEmail';
import ModalSocialConnections from '../common/ModalSocialConnections';
import '../../styles/Profile_Page.css';

const ProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setLoading, setRedirect2AF, setRedirect } = useLoading();
  const [profileImage, setProfileImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const inputRef = useRef(null); // Referência para o input
  const divRef = useRef(null); // Referência para a div do nome
  const [email, setEmail] = useState("");
  const fileInputRef = useRef();
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleIconClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 400); // Reset rotation after 1 second
    setShowSettingsModal(true); // Open the modal
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get the token and fetch data
        const token = await user.getIdToken();
        fetchUserData(token, "Firebase");
      } else {
        setLoading(true);
        // No user is signed in, try to use local token
        const localToken = localStorage.getItem("token");
        if (localToken) {
          fetchUserData(localToken, "JWT");
        } else {
          setLoading(false);
          navigate("/");
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const fetchUserData = async (token, authType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": authType
        }
      });

      if (!response.ok) {
        throw new Error("Erro: " + response.statusText);
      }


      const data = await response.json();
      const user = data.user;
      const firebaseToken = data.firebaseToken;
      setUsername(user.username);
      setEmail(user.email);
      setProfileImage(user.profileImage);
      if (authType === "JWT") {
        await signInWithCustomToken(auth, firebaseToken);
      } else if (authType === "Firebase") {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      setNewUsername(username);
      inputRef.current.focus(); // Foca no input quando começar a edição
    }
  }, [isEditing]);

  const handleClose = () => setShow(false);

  const handleOnClose = () => setShowModal(false);


  const handleChange = (event) => {
    setNewUsername(event.target.value); // Atualiza o estado do nome
  };

  const handleBlur = async () => {
    // Ao sair do input, envia a atualização para o backend
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/admin/resetUsername`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Auth-Type": "JWT"
      },
      body: JSON.stringify({ username: newUsername }),
    });

    const data = await response.text();

    if (!response.ok) {
      setIsEditing(false); // Fecha o modo de edição
      setMessage(data); // Define a mensagem de erro
      setIsSuccess(false); // Define a mensagem como erro
      setShow(true); // Exibe o modal
    } else {
      setIsEditing(false); // Fecha o modo de edição
      setUsername(newUsername); // Atualiza o nome
      setMessage(data); // Define a mensagem de sucesso
      setIsSuccess(true); // Define a mensagem como sucesso
      setShow(true);  // Exibe o modal
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Habilita o modo de edição
  };

  const handleEditClickModal = () => {
    setShowModal(true);
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0]; // Pegando o arquivo da imagem

    if (file) {
      const reader = new FileReader();

      // Atualizando o estado da imagem quando o FileReader terminar de carregar o arquivo
      reader.onloadend = async () => {
        setProfileImage(reader.result); // Define a imagem no estado (base64)

        const token = localStorage.getItem("token"); // Recupera o token

        const formData = new FormData();
        formData.append("profileImage", file); // Use o arquivo, não o DataURL

        try {
          // Envia o arquivo para o servidor com o token no cabeçalho
          const response = await fetch(`${API_BASE_URL}/admin/upload`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "X-Auth-Type": "JWT" // Enviar o token no cabeçalho da solicitação
            },
            body: formData, // Envia o FormData com o arquivo
          });

          if (!response.ok) {
            throw new Error("Erro ao fazer upload da imagem");
          }

          const data = await response.json();
        } catch (error) {
          console.error("Erro no envio da imagem:", error);
        }
      };

      reader.readAsDataURL(file); // Lê o arquivo como um DataURL
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();


  };

  const handleLogout = async () => {
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, get the token and fetch data
        const token = await user.getIdToken();
        logout(token, "Firebase");
      } else {
        setLoading(true);
        // No user is signed in, try to use local token
        const localToken = localStorage.getItem("token");
        if (localToken) {
          logout(localToken, "JWT");
        } else {
          setLoading(false);
          navigate("/");
        }
      }
    });

    return () => unsubscribe(); // Cleanup on unmount

  }

  const logout = async (token, authType) => {
    try {
      // Enviar solicitação para o backend para invalidar o token
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": authType// Enviar o token no cabeçalho da solicitação
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error("Erro durante o logout: " + response.statusText);
      }

      // Remover o token do armazenamento local após o logout
      localStorage.removeItem("token");

      // Realizar logout usando o Firebase
      await signOut(auth);

      setRedirect(false);
      setRedirect2AF(false);

      // Redirecionar para a página inicial após o logout
      navigate("/")
    } catch (error) {
      console.error("Erro durante o logout:", error);
    } finally {
      setLoading(false);
    }
  }




  return (
    <Container className="d-flex justify-content-center align-items-center">



      <CardTreatment
        show={show}
        message={message}
        isSuccess={isSuccess}
        onClose={handleClose}
      />
      <ModalNewEmail
        showModal={showModal}
        onHide={handleOnClose}
        setShow={setShow}
        setMessage={setMessage}
        setIsSuccess={setIsSuccess}
        setEmail={setEmail}
      />

      <ModalSocialConnections
        show={showSettingsModal}
        handleClose={() => setShowSettingsModal(false)}
      />

      <Row className="profile-card p-3 rounded shadow" style={{ backgroundColor: '#fff', maxWidth: '400px' }}>

        <div className="text-center mb-3">
          <FaCog
            className={`gear-icon ${isRotating ? 'rotating' : ''}`}
            onClick={handleIconClick}
            style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', fontSize: '24px' }}
          />
          <div
            className="profile-picture rounded-circle mb-3"
            style={{
              width: '150px',
              height: '150px',
              backgroundColor: '#ccc',
              backgroundImage: `url(${profileImage || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              cursor: 'pointer'
            }}
            onClick={handleImageClick}

          >
            <div className="overlay">
              <FaEdit className="edit-icon" />
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
          {!isEditing ? (
            <div className="d-flex align-items-center justify-content-center">
              <>
                <h4 className="mb-0" style={{ marginRight: '10px' }} ref={divRef}>{username}</h4>
                <FaEdit
                  className="ml-2 cursor-pointer"
                  onClick={handleEditClick}
                  size={14}

                />
              </>
            </div>

          ) : (
            <input
              ref={inputRef}
              type="text"
              value={newUsername}
              onChange={handleChange}
              onBlur={handleBlur}
              className="form-control"
              autoFocus
            />
          )}
          <div className="d-flex align-items-center justify-content-center">
            <>
              <p className="mb-0" style={{ marginRight: '10px' }} ref={divRef}>{email}</p>
              <FaEdit
                className="ml-2 cursor-pointer"
                onClick={handleEditClickModal}
                size={12}

              />
            </>
          </div>
        </div>
        <ChangePasswordForm
          setShow={setShow}
          setMessage={setMessage}
          setIsSuccess={setIsSuccess}
        />
        <Row xs={4} md={4} lg={4} className="d-flex justify-content-center align-items-center">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Row>
      </Row>
    </Container>
  );
};


export default ProfilePage;
