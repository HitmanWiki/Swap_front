import React, { useEffect, useRef, useState } from "react";
import "./datatable.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.css";
import "primeflex/primeflex.css";
import * as C from "./dataTableElement";
import { CommonUtility } from "../../utility/commonUtility";
import {
    AddTokenHook,
    DeleteTokenHook,
    TokenInfoHook,
} from "../../hooks/tokenHooks";
import Loading from "../loaders/loading";
import { Dropdown } from "antd";
import { ContractUtility } from "../../utility/contractUtility";
import { useForm } from "../../hooks/useForm";
import { tokenInfoValidation } from "../validation";

const TokenDataTable = ({
    data,
    getToken,
    isChain,
    chainId,
    wallet,
    walletProvider,
}) => {
    const dt = useRef(null);
    const tokenInit = {
        name: '',
        decimals: "",
        address: "",
        logoURI: "",
        network: "",
        symbol: ""
    }

    //useStates
    const [globalFilter, setGlobalFilter] = useState(null);
    const [tokensDialog, setTokensDialog] = useState(false);
    const [tokenInfo, setTokenInfo] = useState(tokenInit)

    //functions
    const addTokens = async () => {
        try {
            saveTokens(tokenInfo)
        }
        catch (error) {
            console.log("error in adding token", error)
        }
    }
    const deleteItem = (token) => {
        deleteToken(token);
    };
    const fetchTokenInfo = async () => {
        await getTokenInfo(wallet, walletProvider, tokenInfo?.address);
    };

    //hooks
    const { deleteToken, loading, data: deleted } = DeleteTokenHook();
    const {
        data: tokenData,
        error,
        loading: tokenLoading,
        getTokenInfo,
        setData
    } = TokenInfoHook();

    const { saveTokens, loading: saveLoading, data: tokenAdded, error: saveTokenError } = AddTokenHook();
    const { handleSubmit, errors } = useForm(addTokens, tokenInfoValidation, tokenInfo)

    //JSX methods
    const header = (
        <div className="table-header">
            <h5 className="p-mx-0 p-my-1">Tokens</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Search..."
                />
            </span>
        </div>
    );
    const detailDialogFooter = (
        <React.Fragment>
            <Button
                label="Cancel"
                icon="pi pi-times"
                className="p-button-text"
                onClick={() =>{setTokensDialog(false); setTokenInfo({...tokenInit, network: ContractUtility.getSymbol(chainId.toString())}); setData(null)}}
            />
            <Button
                label={saveLoading ? "Saving..." : "Save"}
                icon="pi pi-times"
                disabled={saveLoading}
                className="p-button-text"
                onClick={() => handleSubmit()}
            />
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button
                    disabled={loading}
                    className=" p-button-info"
                    onClick={() => deleteItem(rowData._id)}
                >
                    {
                        loading ? "Deleting..." : "Delete"
                    }
                </Button>
            </React.Fragment>
        );
    };

    //useEffect
    useEffect(() => {
        if (tokenData) {
            setTokenInfo({
                ...tokenInfo,
                name: tokenData.name,
                symbol: tokenData.symbol,
                decimals: tokenData.decimals,
                logoURI: tokenData.logoUri
            })
        }
    }, [tokenData]);

    useEffect(() => {
        (deleted || tokenAdded) && getToken();
    }, [tokenAdded, deleted]);

    useEffect(() => {
        if (tokenAdded || saveTokenError) {
            setTokensDialog(false)
            setTokenInfo({...tokenInit, network: ContractUtility.getSymbol(chainId.toString())})
            setData(null)
        }
    }, [saveTokenError, tokenAdded])
    useEffect(() => {
        const get = () => {
            const symbol = ContractUtility.getSymbol(chainId.toString());
            setTokenInfo({ ...tokenInfo, network: symbol });
        };
        isChain && get();
    }, [chainId, isChain]);

    return (
        <C.MainDiv className="datatable-crud-demo">
            {loading || saveLoading || tokenLoading ? <Loading content="loading..."></Loading> : ""}
            <C.MainCard className="card">
                <div>
                    <Button onClick={() => setTokensDialog(true)}>Add new</Button>
                    <br />
                </div>
                <C.DataTables
                    ref={dt}
                    value={data ? data : []}
                    dataKey="id"
                    paginator
                    globalFilter={globalFilter}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Users"
                    header={header}
                    loading={tokenLoading}
                    responsiveLayout="scroll"
                >
                    <C.Columns
                        field="name"
                        header="Name"
                        sortable
                        style={{ minWidth: "12rem" }}
                    ></C.Columns>
                    <C.Columns
                        field="symbol"
                        header="Symbol"
                        sortable
                        style={{ minWidth: "16rem" }}
                    ></C.Columns>
                    <C.Columns
                        field="network"
                        header="Network"
                        sortable
                        style={{ minWidth: "10rem" }}
                    ></C.Columns>
                    <C.Columns
                        field="address"
                        header="Token"
                        body={(row) => CommonUtility.addressConvertor(row.address)}
                    ></C.Columns>
                    <C.Columns
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: "8rem" }}
                    ></C.Columns>
                </C.DataTables>
            </C.MainCard>
            <C.Dialogs
                visible={tokensDialog}
                style={{ width: "450px" }}
                header="Tokens Details"
                modal
                className="p-fluid"
                footer={tokenData && detailDialogFooter}
                onHide={() => setTokensDialog(false)}
            >
                <p>Network: {tokenInfo?.network || ""}</p>
                <p style={{ color: "red" }} > {errors?.network && errors?.network}</p>
                <label>Enter Address: </label>
                <input onChange={(e) => setTokenInfo({ ...tokenInfo, address: e.target.value })} value={tokenInfo?.address} />
                <p style={{ color: "red" }} > {errors?.address && errors?.address}</p>
                <Button
                 label={tokenLoading ? "Fetching..." : "Fetch Data"}
                // label={saveLoading ? "Saving..." : "Save"}
                // icon="pi pi-times"
                disabled={tokenLoading}
                className="p-button-text"
                onClick={() => fetchTokenInfo()}
            />
            
                {/* <button disabled={tokenLoading} onClick={() => fetchTokenInfo()}> {tokenLoading ? "Fetching..." : "Fetch Data"}</button> */}
                <hr />
                        <br />
                        <br />
                {tokenData && (
                    <>
                        <label>Name: </label>
                        <input onChange={(e) => setTokenInfo({ ...tokenInfo, name: e.target.value })} value={tokenInfo?.name} />
                        <p style={{ color: "red" }} > {errors?.name && errors?.name}</p>
                        <br /> <label>Symbol: </label>
                        <input onChange={(e) => setTokenInfo({ ...tokenInfo, symbol: e.target.value })} value={tokenInfo?.symbol} />
                        <p style={{ color: "red" }} > {errors?.symbol && errors?.symbol}</p>
                        <br /> <label>Decimals: </label>
                        <input
                            onChange={(e) => setTokenInfo({ ...tokenInfo, decimals: e.target.value })}
                            value={tokenInfo?.decimals}
                        />
                        <p style={{ color: "red" }} > {errors?.decimals && errors?.decimals}</p>
                        <br />
                        <label>Image Uri: </label>
                        <input
                            onChange={(e) => setTokenInfo({ ...tokenInfo, logoURI: e.target.value })}
                            value={tokenInfo?.logoURI}
                        />
                        <p style={{ color: "red" }} > {errors?.logoURI && errors?.logoURI}</p>
                        <br />
                        {tokenInfo?.logoURI && <img width={50} height={50} src={tokenInfo?.logoURI} />}
                        <br />
                        <br />
                    </>
                )}
            </C.Dialogs>
        </C.MainDiv>
    );
};

export default TokenDataTable;
