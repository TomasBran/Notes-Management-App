import React, { useEffect, useRef, useState } from 'react';
import { MdModeEdit, MdDelete, MdUnarchive } from 'react-icons/md';
import { FaPlus } from 'react-icons/fa';
import { IoMdArchive } from 'react-icons/io';
import { TiDelete } from 'react-icons/ti';
import axios from 'axios';
import { Tooltip } from 'antd';
import pin from '../assets/pin.png';

const apiUrl = 'http://localhost:3001';

const Note = ({ note, onDelete, updateNote, onEdit, onArchive, onTag }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(note.title);
	const [content, setContent] = useState(note.content);
	const taggingRef = useRef(null);
	const [newTag, setNewTag] = useState('');
	const [isTagging, setIsTagging] = useState(false);

	const handleEdit = () => {
		onEdit(note);
		setIsEditing(true);
	};

	const handleArchive = () => {
		onArchive(note);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		if (title.trim() !== '' && content.trim() !== '') {
			updateNote({ ...note, title, content });
			setIsEditing(false);
		} else {
			alert('Please fill in both title and content');
		}
	};

	const handleTagClick = () => {
		setIsTagging(true);
	};

	const handleTagChange = (e) => {
		setNewTag(e.target.value);
	};

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (taggingRef.current && !taggingRef.current.contains(event.target)) {
				setIsTagging(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const addTagToNote = async (noteId, category) => {
		try {
			const response = await axios.post(
				`${apiUrl}/notes/${noteId}/categories`,
				{
					category,
				}
			);
			return response.data;
		} catch (error) {
			console.error('Error adding tag to note:', error);
			throw error;
		}
	};

	const handleAddTag = async () => {
		if (newTag.trim() !== '') {
			try {
				await addTagToNote(note.id, newTag);
				setNewTag('');
				setIsTagging(false);
				onTag();
			} catch (error) {
				throw new Error(error);
			}
		}
	};

	const handleRemoveCategory = async (categoryToRemove) => {
		try {
			await axios.delete(`http://localhost:3001/notes/${note.id}/categories`, {
				data: { category: categoryToRemove },
			});
			onTag();
		} catch (error) {
			console.error('Error removing category:', error);
		}
	};

	return (
		<div
			className={`${
				!note.archived ? 'max-w-md' : 'max-w-xs'
			} mx-auto p-4 bg-white shadow-md rounded`}>
			{isEditing ? (
				<form onSubmit={handleSubmit}>
					<input
						type='text'
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						placeholder='Note Title'
						className='w-full p-2 mb-4 border border-gray-300 rounded'
					/>
					<textarea
						value={content}
						onChange={(event) => setContent(event.target.value)}
						placeholder='Note Content'
						className='w-full p-2 mb-4 border border-gray-300 rounded'
					/>
					<button
						type='submit'
						className='w-full p-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded'>
						Update
					</button>
				</form>
			) : (
				<div className={`flex flex-col gap-4`}>
					<div className='flex justify-between'>
						<h2 className='text-lg font-bold break-words'>{note.title}</h2>
						<img
							src={pin}
							alt='pin'
							className='h-6 drop-shadow-xl shadow-black'
						/>
					</div>
					{!note.archived && <p className='text-gray-600'>{note.content}</p>}
					<div
						className={`flex ${
							!note.archived ? 'justify-between' : 'justify-end'
						}`}>
						{!note.archived && (
							<div>
								<div className='flex gap-2 items-center justify-start flex-wrap py-2'>
									{note.categories &&
										note.categories.length > 0 &&
										note.categories.map((category, index) => (
											<div
												key={index}
												className={`flex items-center justify-center gap-1 px-2 rounded bg-blue-400 text-white drop-shadow shadow-gray-500`}>
												<span className='flex items-center justify-center'>
													{category}
												</span>
												<Tooltip title='Delete'>
													<button
														onClick={() => handleRemoveCategory(category)}
														className='text-white hover:text-slate-800 opacity-90 text-xl'>
														<TiDelete />
													</button>
												</Tooltip>
											</div>
										))}
								</div>
								<div
									className='flex w-20 justify-center items-center gap-2 cursor-pointer bg-green-600 hover:bg-green-500 active:bg-green-400 text-white py-1 px-2 rounded-xl drop-shadow-xl shadow-black transform transition-all duration-150 active:scale-95'
									onClick={handleTagClick}>
									<FaPlus />
									<span>Tag</span>
								</div>
							</div>
						)}
						{isTagging && (
							<div
								className='z-50 absolute shadow-lg shadow-gray-400 bg-gray-300 p-4 rounded-lg flex flex-col gap-2 items-center'
								ref={taggingRef}>
								<input
									type='text'
									value={newTag}
									onChange={handleTagChange}
									placeholder='e.g.: Work'
									maxLength={12}
									className='p-2 rounded bg-gray-50 text-black '
								/>
								<div className='flex gap-2'>
									<button
										className='bg-green-500 hover:bg-green-700 active:bg-green-800 shadow-gray-400 shadow-lg text-white py-1 px-4 rounded'
										onClick={handleAddTag}>
										Add
									</button>
									<button
										className='bg-red-500 hover:bg-red-700 active:bg-red-800 shadow-gray-400 shadow-lg text-white py-1 px-4 rounded'
										onClick={() => {
											setIsTagging(false);
											setNewTag('');
										}}>
										Cancel
									</button>
								</div>
							</div>
						)}
						<div className='flex justify-end items-end'>
							{!note.archived && (
								<Tooltip title='Edit'>
									<button
										className='text-blue-500 hover:text-blue-700 transition duration-150 ease-in-out drop-shadow-lg shadow-black'
										onClick={handleEdit}>
										<MdModeEdit className='text-2xl' />
									</button>
								</Tooltip>
							)}
							<Tooltip title='Delete'>
								<button
									className='text-red-500 hover:text-red-700 transition duration-150 ease-in-out drop-shadow-lg shadow-black'
									onClick={() => onDelete(note)}>
									<MdDelete className='text-2xl' />
								</button>
							</Tooltip>
							<Tooltip title={`${note.archived ? 'Unarchive' : 'Archive'}`}>
								<button
									className='text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out drop-shadow-lg shadow-black'
									onClick={handleArchive}>
									{!note.archived ? (
										<IoMdArchive className='text-2xl' />
									) : (
										<MdUnarchive className='text-2xl' />
									)}
								</button>
							</Tooltip>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Note;
