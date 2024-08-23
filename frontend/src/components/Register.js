import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
const apiUrl = 'http://localhost:3001';

const Register = ({ toggleForm, onRegisterSuccess }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await fetch(`${apiUrl}/auth/register`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ username, email, password }),
			});

			if (response.ok) {
				onRegisterSuccess();
			} else {
				console.error('Error en el registro');
			}
		} catch (error) {
			console.error('Error en la solicitud', error);
		}
	};

	return (
		<div className='flex justify-center items-center h-screen'>
			<div className='bg-white p-8 rounded shadow-md w-96'>
				<h2 className='text-2xl font-bold mb-6 text-center'>
					Create an account
				</h2>
				<form onSubmit={handleSubmit}>
					<div className='mb-4'>
						<label
							className='block text-gray-700 text-sm font-bold mb-2'
							htmlFor='username'>
							Username
						</label>
						<input
							type='text'
							id='username'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className='w-full px-3 py-2 border rounded-md text-gray-700'
							required
							minLength={3}
							maxLength={12}
						/>
					</div>
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
					<div className='mb-6'>
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
								minLength={6}
								maxLength={16}
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
					<button
						type='submit'
						className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300'>
						Register
					</button>
				</form>
				<p className='text-center text-sm text-gray-600 mt-4'>
					Already have an account?{' '}
					<button
						onClick={toggleForm}
						className='text-green-500 hover:underline focus:outline-none'>
						Log in
					</button>
				</p>
			</div>
		</div>
	);
};

export default Register;
