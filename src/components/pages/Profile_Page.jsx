import React from 'react';
import { Container, Button, Row } from 'react-bootstrap';
import { getAuth, signOut } from 'firebase/auth';
import ChangePasswordForm from '../layout/ChangePasswordForm';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../context/LoadingContext'; 
import '../../styles/Profile_Page.css';

const ProfilePage = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const { setLoading } = useLoading();  

  const handleLogout = async () => {
    setLoading(true); 
    try {
      const auth = getAuth();
      // Realizar logout usando o Firebase
      await signOut(auth);

      // Enviar solicitação para o backend para invalidar o token
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
          "X-Auth-Type": "JWT" // Enviar o token no cabeçalho da solicitação
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error("Erro durante o logout: " + response.statusText);
      }

      // Remover o token do armazenamento local após o logout
      localStorage.removeItem("token");

      // Redirecionar para a página inicial após o logout
      navigate("/")
    } catch (error) {
      console.error("Erro durante o logout:", error);
    }finally{
      setLoading(false); 
    }
  };

  const handleChangePassword = (currentPassword, newPassword) => {
    // Lógica de mudança de senha
  };

  return (
    <Container className="d-flex justify-content-center align-items-center">
      <Row className="profile-card p-3 rounded shadow" style={{ backgroundColor: '#fff', maxWidth: '400px' }}>
        <div className="text-center mb-3">
          <div className="profile-picture rounded-circle mb-3" style={{ width: '150px', height: '150px', backgroundColor: '#ccc' }}></div>
          <h4>Usuario</h4>
          <p>email@gmail.com</p>
        </div>
        <ChangePasswordForm onChangePassword={handleChangePassword} />
        <Row xs={4} md={4} lg={4} className="d-flex justify-content-center align-items-center">
          <Button variant="danger" onClick={handleLogout}>Logout</Button>
        </Row>
      </Row>
    </Container>
  );
};

export default ProfilePage;
