import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';

const Auth = ({ onAuthSuccess }) => {
	const [isLogin, setIsLogin] = useState(true);

	const toggleForm = () => {
		setIsLogin(!isLogin);
	};

	return (
		<>
			{isLogin ? (
				<Login
					toggleForm={toggleForm}
					onLoginSuccess={onAuthSuccess}
				/>
			) : (
				<Register
					toggleForm={toggleForm}
					onRegisterSuccess={toggleForm}
				/>
			)}
		</>
	);
};

export default Auth;
