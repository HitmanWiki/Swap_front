const environment = {
    CMC_SERVER_URL: "https://pro-api.coinmarketcap.com",
    CMC_API_KEY: 'aa739a85-8a33-4567-8e5c-8f99f07559b7',
    BACKEND_BASE_URL: process.env.NODE_ENV === "production" ? 'https://black-panthera-be.vercel.app': 'http://localhost:8080'
};

export default environment