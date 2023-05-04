import styled from "styled-components";

export const TopHeader = styled.div`
  overflow: hidden;
  background-color: rgb(30, 40, 65);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  @media (max-width: 767.98px) {
    flex-direction: column;
    gap: 20px;
    min-height: 30vh;
  }
`;

export const HeaderText = styled.div`
  color: #ffffff;
  font-size: 24px;
`;

export const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;

  @media (max-width: 575.98px) {
    flex-direction: column;
  }
`;

export const LogoutBtn = styled.button`
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 18px;
  font-weight: 500;
  border: 1px solid #ffffff;
  background-color: rgb(30, 40, 65);
  color: #ffffff;

  &:hover {
    background-color: #ffffff;
    color: rgb(30, 40, 65);
  }

  @media (max-width: 575.98px) {
    width: 100%;
  }
`;
