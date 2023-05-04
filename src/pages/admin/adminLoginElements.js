import styled from "styled-components";

import loginbg from "../../assets/images/bg-img.png";
export const Content = styled.div`
  /* background-image: url(${loginbg}); */
  background-size: 100vw 100vh;
  background-repeat: no-repeat;

  @media (max-width: 991px) {
    background-size: 100vw 100vh;
    background-position: 0;
  }
  @media (max-width: 460px) {
    /* background-image: none; */
  }
`;

export const LoginMain = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  @media (max-width: 460px) {
    padding: 0 1rem;
  }
`;

export const LoginContainer = styled.div`
  height: 21rem;
  width: 28rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  color: white;
  flex-direction: column;
  background-color: #131b2a;
  border: 1px solid white;

  box-shadow: -2px 0px 33px 0px rgb(39, 67, 117);
`;

export const Heading = styled.h5`
  color: white;
`;

export const EmailInputField = styled.input`
  width: 22rem;
  height: 40px;
  color: white;

  border: 1px solid #555a65;

  margin-top: 20px;
  text-indent: 15px;
  background: #16243e;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &::placeholder {
    color: white;
  }

  @media (max-width: 400px) {
    width: 20rem;
  }
  @media (max-width: 360px) {
    width: 18rem;
  }
`;

export const PasswordInputField = styled.input`
  margin-top: 30px;
  border: 1px solid #555a65;
  width: 22rem;
  height: 40px;
  text-indent: 15px;
  color: black;
  background: #16243e;
  display: block;
  margin-left: auto;
  margin-right: auto;

  &::placeholder {
    color: white;
  }
  @media (max-width: 400px) {
    width: 20rem;
  }
  @media (max-width: 360px) {
    width: 18rem;
  }
`;
export const LoginButton = styled.button`
  margin-top: 30px;
  height: 33px;
  width: 22rem;

  border-radius: 30px;
  border: none;
  outline: none;
  background: linear-gradient(to left, #d2591f, #aa473a, #8e4656, #5d478d)
    no-repeat center center;
  color: white;
  font-weight: 600;
  text-align: center;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);

  @media (max-width: 400px) {
    width: 20rem;
  }
  @media (max-width: 360px) {
    width: 18rem;
  }
`;

export const ErrorMessage = styled.p`
  text-align: start;
  color: red;
  margin-bottom: 0px;
`;
