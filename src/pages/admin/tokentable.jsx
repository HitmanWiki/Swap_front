import React from "react";
import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import TokenDataTable from "../../components/admin/tokenTable";
import Loading from "../../components/loaders/loading";
import { CheckAuthHook, LoginHook, LogoutHook } from "../../hooks/adminHooks";
import { GetTokensHook } from "../../hooks/tokenHooks";
import { BrowserUtility } from "../../utility/browserUtility";
import { TopHeader, Wrapper, LogoutBtn, HeaderText } from "./element";
import AdminDropdown from "../../components/adminDropdown";
import { AuthType } from "../../utility/constant";

const TokenTable = ({
  unknownNetwork,
  setIsShowWalletModal,
  isChain,
  userAddress,
  chainId,
  walletProvider,
  wallet,
}) => {
  const { authLoading, data } = CheckAuthHook(AuthType.ADMIN_PAGE);
  const {
    data: tokens,
    loading,
    getTokens,
    error: tokenError,
  } = GetTokensHook();
  const { logoutLoading, logout } = LogoutHook();
  return (
    <div>
      <>
        {userAddress ? (
          <>
            <TopHeader>
              <HeaderText>Admin Dashboard</HeaderText>
              <Wrapper>
                <AdminDropdown.Common
                  unknownNetwork={unknownNetwork}
                  chainId={chainId}
                />

                <LogoutBtn onClick={logout}>Log Out</LogoutBtn>
              </Wrapper>
            </TopHeader>
          </>
        ) : (
          <button
            // className={classes["calc-button"]}
            onClick={() => setIsShowWalletModal(true)}
          >
            Connect Wallet
          </button>
        )}
      </>
      {loading || authLoading ? (
        <Loading content="Loading" />
      ) : data ? (
        <TokenDataTable
          getToken={getTokens}
          data={tokens}
          unknownNetwork={unknownNetwork}
          setIsShowWalletModal={setIsShowWalletModal}
          isChain={isChain}
          userAddress={userAddress}
          chainId={chainId}
          walletProvider={walletProvider}
          wallet={wallet}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default TokenTable;
