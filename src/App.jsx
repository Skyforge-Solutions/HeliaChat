import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SignupProvider } from './context/SignupContext';
import { CreditProvider } from './context/CreditContext';

// Auth components
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';

// Pages
import HomePage from './components/home/HomePage';
import ChatPage from './components/chat/ChatPage';
import { PendingMessageProvider } from './context/PendingMessageContext';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import BuyCreditsPage from './pages/buy-credit';
import CheckoutSuccessPage from './pages/billing/CheckoutSuccessPage';
import PaymentHistoryPage from './pages/billing/PaymentHistoryPage';

function App() {
	return (
		<ThemeProvider>
			<CreditProvider>
				<AuthProvider>
					<SignupProvider>
						<PendingMessageProvider>
							<Router>
								<Routes>
									<Route element={<ProtectedRoute />}>
										<Route element={<MainLayout />}>
											<Route
												path='/'
												element={<HomePage />}
											/>
											<Route
												path='/chat/:chatId'
												element={<ChatPage />}
											/>
											<Route
												path='/buy-credit'
												element={<BuyCreditsPage />}
											/>
											<Route
												path='/checkout-success'
												element={<CheckoutSuccessPage />}
											/>
											<Route
												path='/payment-history'
												element={<PaymentHistoryPage />}
											/>
										</Route>
									</Route>
									{/* Auth routes */}
									<Route element={<AuthLayout />}>
										<Route
											path='/login'
											element={<Login />}
										/>
										<Route
											path='/signup'
											element={<Signup />}
										/>
										<Route
											path='/forgot-password'
											element={<ForgotPassword />}
										/>
										<Route
											path='/reset-password'
											element={<ResetPassword />}
										/>
									</Route>

									{/* Protected routes */}

									{/* Fallback route */}
									<Route
										path='*'
										element={
											<Navigate
												to='/'
												replace
											/>
										}
									/>
								</Routes>
							</Router>
						</PendingMessageProvider>
					</SignupProvider>
				</AuthProvider>{' '}
			</CreditProvider>
		</ThemeProvider>
	);
}

export default App;
