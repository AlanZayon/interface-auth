  // eslint-disable-next-line no-unused-vars
  import React from 'react';
  import { Container, Button, Form, InputGroup, Row } from 'react-bootstrap';
  import { useMutation } from '@tanstack/react-query';
  import { getAuth, signOut } from 'firebase/auth';
  import ChangePasswordForm from '../layout/ChangePasswordForm'; // Importar o novo componente
  import '../../styles/Profile_Page.css'

  // const useLogout = () => {
  //   const mutationFn = async () => {
  //     const auth = getAuth();
  //     // Realizar logout usando o Firebase
  //     await signOut(auth);

  //     // Enviar solicitação para o backend para invalidar o token
  //     const token = localStorage.getItem("token");
  //     const response = await fetch("http://localhost:3000/user/logout", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Authorization": "Bearer " + token,
  //         "X-Auth-Type": "JWT" // Enviar o token no cabeçalho da solicitação
  //       },
  //       body: JSON.stringify({ token })
  //     });

  //     if (!response.ok) {
  //       throw new Error("Erro durante o logout: " + response.statusText);
  //     }
      
  //     // Remover o token do armazenamento local após o logout
  //     localStorage.removeItem("token");
  //   };

  //   return useMutation(mutationFn);
  // };

  const ProfilePage = () => {

    const handleLogout = async () => {
      try {
        const auth = getAuth();
        await signOut(auth);
        window.location.href = "/";
      } catch (error) {
        console.error("Erro durante o logout:", error);
      }
    };
  
    const handleChangePassword = (currentPassword, newPassword) => {
      // Aqui você implementaria a lógica para mudar a senha,
      // por exemplo, fazendo uma chamada para o backend para atualizar a senha do usuário.
      // Adicione a lógica de validação ou integração com backend aqui
    };


    return (
      <Container className="d-flex justify-content-center align-items-center ">
        <Row className="profile-card p-3 rounded shadow" style={{ backgroundColor: '#fff', maxWidth: '400px' }}>
          <div className="text-center mb-3">
            <div className="profile-picture rounded-circle mb-3" style={{ width: '150px', height: '150px', backgroundColor: '#ccc' }}></div>
            <h4>AlanZayon</h4>
            <p>alanzayon72@gmail.com</p>
          </div>
          <ChangePasswordForm onChangePassword={handleChangePassword} />
            <Row xs={4} md={4} lg={4} className="d-flex justify-content-center align-items-center ">
              <Button variant="danger"  onClick={handleLogout}>Logout</Button>
            </Row>
          
        </Row>
      </Container>
    );
  };

  export default ProfilePage;
