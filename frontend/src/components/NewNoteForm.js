import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const apiURL = 'http://localhost:3001';

const NewNoteForm = ({ initialData, onSuccess }) => {
	const [title, setTitle] = useState(initialData ? initialData.title : '');
	const [content, setContent] = useState(
		initialData ? initialData.content : ''
	);
	const [isEditing, setIsEditing] = useState(!!initialData);
	const [messageApi, contextHolder] = message.useMessage();

	const successMessage = (message) => {
		messageApi.open({
			type: 'success',
			content: message,
			duration: 1.5,
		});
	};
	const errorMessage = (message) => {
		messageApi.open({
			type: 'error',
			content: message,
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (title.trim() !== '' && content.trim() !== '') {
			try {
				if (isEditing) {
					await axios.put(`${apiURL}/notes/${initialData.id}`, {
						title,
						content,
					});
				} else {
					await axios.post(`${apiURL}/notes`, {
						title,
						content,
					});
				}

				setTitle('');
				setContent('');
				setIsEditing(false);

				if (onSuccess) {
					onSuccess();
				}
			} catch (error) {
				errorMessage(error);
			}
		} else {
			errorMessage('Please fill in both title and content');
		}
	};

	return (
		<div>
			{contextHolder}
			<form onSubmit={handleSubmit}>
				<input
					type='text'
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder='Title'
					className='w-full p-2 mb-4 border border-gray-300 rounded'
				/>
				<textarea
					value={content}
					onChange={(event) => setContent(event.target.value)}
					placeholder='Content'
					className='w-full min-h-40 p-2 mb-4 border border-gray-300 rounded'
				/>
				<div className='flex gap-2 w-full justify-center'>
					{!isEditing && (
						<div
							className='w-1/12 flex justify-center items-center cursor-pointer p-2 text-gray-400 outline-gray-300 outline-double outline-2 font-bold rounded hover:bg-gray-300 hover:text-white active:bg-gray-400 active:outline-gray-400 shadow-lg shadow-gray-300 hover:shadow-gray-400'
							onClick={onSuccess}>
							Cancel
						</div>
					)}
					<button
						type='submit'
						className='w-1/12 p-2 bg-green-500 hover:bg-green-700 active:bg-green-800 text-white font-bold rounded shadow-lg shadow-gray-300 hover:shadow-gray-500'>
						Add
					</button>
				</div>
			</form>
		</div>
	);
};

export default NewNoteForm;
