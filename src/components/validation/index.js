import { CommonUtility } from "../../utility/commonUtility";
import { regex } from "../../utility/constant";

const tokenInfoValidation = (values) => {
    const errors = {};

    if (!values?.name?.trim()) {
        errors.name = 'Token Name is required'
    }
    if (!values?.symbol?.trim()) {
        errors.symbol = 'Token symbol is required'
    }
    if (!(values?.decimals)?.toString()?.trim()) {
        errors.decimals = 'Token decimals is required'
    }
    if (!values?.network?.trim()) {
        errors.network = 'Network is required'
    }
    if (!values?.logoURI?.trim()) {
        errors.logoURI = 'Token logo Uri is required'
    }
    if (!values?.address?.trim()) {
        errors.address = 'Token address is required'
    }
    else if (!CommonUtility.validatePattern(regex.CONTRACT_ADDRESS, values?.address)) {
        errors.address = 'Invalid token address'
    }
    return errors;
}
const credentialsValidate = (values) => {
    const errors = {};
  
    if (!values.username) {
      errors.username = "Username is required";
    } else if (values.username.length > 8) {
      errors.username = "Username exceed the character limit";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length > 8) {
      errors.password = "Password exceed the character limit";
    }
    return errors;
  };

export  {
    tokenInfoValidation,
 //   credentialsValidate
}