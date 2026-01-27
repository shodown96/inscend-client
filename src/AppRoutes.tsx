// AppRoutes.tsx
import { BrowserRouter, Route, Routes } from "react-router";
import AuthLayout from "./routes/auth/layout";
import MainLayout from "./routes/main/layout";

import ForgotPassword from "./routes/auth/forgot-password";
import SetupBusiness from "./routes/auth/setup-business";
import SignIn from "./routes/auth/sign-in";
import SignUp from "./routes/auth/sign-up";
import SsoCallback from "./routes/auth/sso-callback";
import Home from "./routes/home";

import { PATHS } from "./lib/constants";
import Onboarding from "./routes/auth/onboarding";
import ActionBoardPage from "./routes/main/action-board";
import Analytics from "./routes/main/analytics";
import Customers from "./routes/main/customers";
import CustomerDetailsPage from "./routes/main/customers/[id]";
import Inventory from "./routes/main/inventory";
import Sales from "./routes/main/sales";
import Settings from "./routes/main/settings";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Home */}
                <Route path={PATHS.HOME} element={<Home />} />

                {/* Auth */}
                <Route element={<AuthLayout />}>
                    <Route path={PATHS.SIGN_IN} element={<SignIn />} />
                    <Route path={PATHS.SIGN_UP} element={<SignUp />} />
                    <Route path={PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={PATHS.SETUP_BUSINESS} element={<SetupBusiness />} />
                    <Route path={PATHS.ONBOARDING} element={<Onboarding />} />
                    <Route path={PATHS.SSO_CALLBACK} element={<SsoCallback />} />
                </Route>

                {/* Main */}
                <Route element={<MainLayout />}>
                    <Route path={PATHS.ACTION_BOARD} element={<ActionBoardPage />} />
                    <Route path={PATHS.INVENTORY} element={<Inventory />} />
                    <Route path={PATHS.SALES} element={<Sales />} />
                    <Route path={PATHS.CUSTOMERS} element={<Customers />} />
                    <Route path={PATHS.CUSTOMER_DETAILS} element={<CustomerDetailsPage />} />
                    <Route path={PATHS.ANALYTICS} element={<Analytics />} />
                    <Route path={PATHS.SETTINGS} element={<Settings />} />
                </Route>

                {/* Catch-all */}
                <Route path="*" element={<div>Page Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}
