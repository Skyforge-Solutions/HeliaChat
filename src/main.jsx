import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { QueryProvider } from './services/api';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryProvider>
			<App />
		</QueryProvider>
	</React.StrictMode>
);
