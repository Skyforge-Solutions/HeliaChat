import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

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

function App() {
	return (
		<ThemeProvider>

			<AuthProvider>
				<PendingMessageProvider>
					<Router>
						<Routes>
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
							</Route>

							{/* Protected routes */}
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
								</Route>
							</Route>

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
			</AuthProvider>
		</ThemeProvider>
	);
}

export default App;
