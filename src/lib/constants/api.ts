export const BASE_API_ENDPOINT = import.meta.env.VITE_BASE_API_ENDPOINT
export const BASE_WEBSOCKET_ENDPOINT = import.meta.env.VITE_BASE_WEBSOCKET_ENDPOINT

export const API_ENDPOINTS = {
    Auth: {
        SignUp: `${BASE_API_ENDPOINT}/auth/sign-up`,
        SignIn: `${BASE_API_ENDPOINT}/auth/sign-in`,
        SignOut: `${BASE_API_ENDPOINT}/auth/sign-out`,
        ResetPassword: `${BASE_API_ENDPOINT}/auth/reset-password`,
        ForgotPassword: `${BASE_API_ENDPOINT}/auth/forgot-password`,
        SetPassword: `${BASE_API_ENDPOINT}/auth/set-password`,
        ChangePassword: `${BASE_API_ENDPOINT}/auth/change-password`,
        RefreshToken: `${BASE_API_ENDPOINT}/auth/token`,
        SendCode: `${BASE_API_ENDPOINT}/auth/send-code`,
        VerfiyEmail: `${BASE_API_ENDPOINT}/auth/verify-email`,
        CheckEmail: `${BASE_API_ENDPOINT}/auth/check-email`,
        CheckPhone: `${BASE_API_ENDPOINT}/auth/check-phone`,
        VerifyCode: `${BASE_API_ENDPOINT}/auth/verify-code`,
        GoogleSignIn: `${BASE_API_ENDPOINT}/oauth/google-sign-in`,
    },
    Products: {
        Base: `${BASE_API_ENDPOINT}/products`,
        Analytics: `${BASE_API_ENDPOINT}/products/analytics`,
        Import: `${BASE_API_ENDPOINT}/products/import`,
        AddImported: `${BASE_API_ENDPOINT}/products/add-imported`,
        ById: (id: string) => `${BASE_API_ENDPOINT}/products/${id}`,
    },
    Sales: {
        Base: `${BASE_API_ENDPOINT}/sales`,
        Analytics: `${BASE_API_ENDPOINT}/sales/analytics`,
        Import: `${BASE_API_ENDPOINT}/sales/import`,
        AddImported: `${BASE_API_ENDPOINT}/sales/add-imported`,
        ById: (id: string) => `${BASE_API_ENDPOINT}/sales/${id}`,
    },
    Customers: {
        Base: `${BASE_API_ENDPOINT}/customers`,
        Analytics: `${BASE_API_ENDPOINT}/customers/analytics`,
        Import: `${BASE_API_ENDPOINT}/customers/import`,
        AddImported: `${BASE_API_ENDPOINT}/customers/add-imported`,
        ById: (id: string) => `${BASE_API_ENDPOINT}/customers/${id}`,
    },
    Business: {
        Base: `${BASE_API_ENDPOINT}/business`,
        Mine: `${BASE_API_ENDPOINT}/business/mine`,
        MyHealth: `${BASE_API_ENDPOINT}/business/mine/health`,
        ById: (id: string) => `${BASE_API_ENDPOINT}/business/${id}`,
    },
    Users: {
        Profile: `${BASE_API_ENDPOINT}/users/profile`
    },
    Brainstorm: {
        Chat: `${BASE_API_ENDPOINT}/brainstorm/chat`,
        ExternalChat: `https://ai-dev.inscend.io/chat/brainstorm`,
    },
    Analytics: {
        ActionBoardMetrics: `${BASE_API_ENDPOINT}/analytics/action-board`,
        GetBusinessData: `${BASE_API_ENDPOINT}/analytics/get-business-data`,
        SalesTotal: `${BASE_API_ENDPOINT}/analytics/sales-total`,
        OrderStatuses: `${BASE_API_ENDPOINT}/analytics/order-statuses`,
        Profit: `${BASE_API_ENDPOINT}/analytics/profit`,
        Customers: `${BASE_API_ENDPOINT}/analytics/customers`,
        Orders: `${BASE_API_ENDPOINT}/analytics/orders`,
        AvgRevenue: `${BASE_API_ENDPOINT}/analytics/avg-revenue`,
        SalesDistribution: `${BASE_API_ENDPOINT}/analytics/sales-distribution`,
        ActionCards: `${BASE_API_ENDPOINT}/analytics/action-cards`
    },
}