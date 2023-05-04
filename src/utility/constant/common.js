export const StorageConstant = {
    token: "token",
    termsAndCondition: "termsAndCondition",
    versionUpdate: "versionUpdate",
  };

  export const regex={
    URL:'^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$',
    NON_NEGATIVE: '^[1-9]+[0-9]*$',
    EMAIL: "^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$",
    CONTRACT_ADDRESS: '0x[a-fA-F0-9]{40}'
}

export const AuthType = {
  ADMIN_PAGE: 'ADMIN_PAGE',
  LOGIN_PAGE: 'LOGIN_PAGE'
};
