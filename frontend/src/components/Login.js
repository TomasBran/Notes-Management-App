import React, { useState } from 'react';
import { message } from 'antd';
import CapsLockIndicator from './CapsLockIndicator';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const apiUrl = 'http://localhost:3001';

const Login = ({ toggleForm, onLoginSuccess }) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [messageApi, contextHolder] = message.useMessage();
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword((prev) => !prev);
	};

	const successMessage = (message) => {
		messageApi.open({
			type: 'loading',
			content: message,
			duration: 1.5,
		});
	};

	const errorMessage = (message) => {
		messageApi.open({
			type: 'error',
			content: message,
			duration: 1.5,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(`${apiUrl}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email, password }),
			});

			if (response.ok) {
				const data = await response.json();
				if (data.access_token !== undefined) {
					localStorage.setItem('token', data.access_token);
					localStorage.setItem('username', data.username);
					successMessage('Logged in succesfully. Redirecting...');

					setTimeout(() => {
						onLoginSuccess();
					}, 1500);

					return;
				}
				errorMessage('Invalid credentials');
			} else {
				errorMessage('Response not ok');
			}
		} catch (error) {
			errorMessage(error);
		}
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			{contextHolder}
			<div className='bg-white p-8 rounded shadow-md w-96'>
				<h2 className='text-2xl font-bold mb-6 text-center'>Log In</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							className='block text-gray-700 text-sm font-bold mb-2'
							htmlFor='email'>
							Email
						</label>
						<input
							type='email'
							id='email'
							value={email}
							onChange={(e) => setEmail(e.target.value.toLowerCase())}
							className='w-full px-3 py-2 border rounded-md text-gray-700'
							required
						/>
					</div>
					<div className='mb-2'>
						<label
							className='block text-gray-700 text-sm font-bold mb-2'
							htmlFor='password'>
							Password
						</label>
						<div className='relative w-full'>
							<input
								type={showPassword ? 'text' : 'password'}
								id='password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className='w-full px-3 py-2 border rounded-md text-gray-700 pr-10'
								required
							/>
							<button
								type='button'
								onClick={togglePasswordVisibility}
								className='absolute inset-y-0 right-0 flex items-center pr-3'>
								{showPassword ? (
									<FaEyeSlash className='text-gray-500' />
								) : (
									<FaEye className='text-gray-500' />
								)}
							</button>
						</div>
					</div>
					<div className='h-8'>
						<CapsLockIndicator />
					</div>
					<button
						type='submit'
						className='w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300'>
						Log in
					</button>
				</form>
				<p className='text-center text-sm text-gray-600 mt-4'>
					Don't have an account yet?{' '}
					<button
						onClick={toggleForm}
						className='text-blue-500 hover:underline focus:outline-none'>
						Register
					</button>
				</p>
			</div>
		</div>
	);
};

export default Login;
