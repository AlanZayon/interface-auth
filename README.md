# Documentação do Frontend - Autenticação com Login Social

## Sumário

1. [Introdução](#1-introdução)
2. [Tecnologias Utilizadas](#2-tecnologias-utilizadas)
3. [Configuração](#3-configuração)
4. [Funcionalidades](#4-funcionalidades)
   - [Login](#login)
   - [Cadastro](#cadastro)
   - [Login com Google](#login-com-google)
   - [Login com Facebook](#login-com-facebook)
5. [Comunicação com a API](#5-comunicação-com-a-api)
6. [Tratamento de Erros](#6-tratamento-de-erros)
7. [Fluxo de Usuário](#7-fluxo-de-usuário)
8. [Notas Finais](#8-notas-finais)

---

## 1. Introdução
Este frontend foi desenvolvido para um sistema de autenticação que permite login, cadastro de usuários e login social usando Google e Facebook. Ele se comunica com uma API REST para autenticar e registrar usuários, além de validar credenciais.

### URL do Site

A aplicação está disponível no seguinte endereço:

https://site-kong.netlify.app/

## 2. Tecnologias Utilizadas
- **React**
- **Firebase Authentication**
- **TanStack Query**
- **React Router**
- **React Bootstrap**

## 3. Configuração

Para rodar o projeto localmente, siga os passos abaixo:

3.1. **Clone o repositório**:
   ```bash
   git clone https://github.com/AlanZayon/interface-auth.git
   ```
3.2. **Instale as dependências**:
   ```bash
   npm install
   ```
3.3. **Crie um arquivo .env com as variáveis de ambiente**:
   ```env
   VITE_API_BASE_URL=your_auth_domain
   ```
3.4. **Execute o projeto**:
   ```bash
   npm run dev
   ```
O projeto estará disponível em http://localhost:5173


## 4. Funcionalidades

### 4.1 Login
...

### 4.2 Cadastro
...

### 4.3 Login com Google
...

### 4.4 Login com Facebook
...

## 5. Comunicação com a API
As requisições ao backend seguem um padrão de autenticação com tokens JWT ou Firebase tokens, onde o token é armazenado no localStorage ou sessionStorage e enviado ou recebido em cada requisição com o cabeçalho Authorization: Bearer <token>.

### Exemplo de chamada com Fetch:

```js
const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                },
                body: JSON.stringify({ email, password }),
            });

const token = await response.headers.get("Authorization-token").split(" ")[1];
```

## 6. Tratamento de Erros.
### Erros de validação login: e-mail ou senha inválidos.
![erro de validação login](https://i.imgur.com/nLROfyP.gif)
### Erros de validação: cadastro:username at least 5 characters, Emails do not match, Password is too weak, You must be at least 18 years old.
![erro de validação cadastro](https://i.imgur.com/3eJcbsE.gif)

## 7. Fluxo de Usuário
- **Cadastro**: o usuário se registra inserindo nome, email, senha e data de nascimento. Após a confirmação, o sistema redireciona para a página de confirmação de email.
- **Login**: o usuário faz login com email/senha ou através de Google/Facebook. O token JWT ou o Firebase Token é salvo e utilizado em todas as requisições futuras para validar a sessão.
- **Login Social**: o Firebase autentica o usuário via Google/Facebook e retorna um token que é enviado ao backend para associar ou criar a conta.
- **Persistência de Sessão**: o token é armazenado no localStorage/sessionStorage para manter o usuário autenticado entre sessões(futuramente será alterado para o uso de cookies).
## 8. Notas Finais
Este frontend foi projetado para ser escalável e modular, facilitando a manutenção e possíveis expansões de funcionalidades como redefinição de senha, autenticação de dois fatores, etc.

