import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from '../components/Note';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const apiUrl = 'http://localhost:3001';

const NotesContainer = ({ notes = [], setNotes, loading, setLoading }) => {
	const [editingNote, setEditingNote] = useState(null);
	const [messageApi, contextHolder] = message.useMessage();
	const [showSpinner, setShowSpinner] = useState(true);

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

	const fetchNotes = async () => {
		try {
			const response = await axios.get(`${apiUrl}/notes/all`);
			setNotes(response.data);
		} catch (error) {
			errorMessage(error);
		}

		setTimeout(() => {
			setShowSpinner(false);
		}, 300);
	};

	useEffect(() => {
		fetchNotes();
	}, []);

	useEffect(() => {
		if (loading) {
			fetchNotes();
			setLoading(false);
		}
	}, [loading, setLoading]);

	const onDelete = async (noteToDelete) => {
		try {
			await axios.delete(`${apiUrl}/notes/${noteToDelete.id}`);
			setNotes((prevNotes) =>
				prevNotes.filter((note) => note.id !== noteToDelete.id)
			);
			successMessage('Note deleted successfully');
			setLoading(true);
		} catch (error) {
			errorMessage(error);
		}
	};

	const onEdit = async (noteToEdit) => {
		if (notes.includes(noteToEdit)) {
			setEditingNote(noteToEdit);
		}
	};

	const updateNote = async (updatedNote) => {
		try {
			await axios.put(`${apiUrl}/notes/${updatedNote.id}`, updatedNote);
			setNotes((prevNotes) =>
				prevNotes.map((note) =>
					note.id === updatedNote.id ? updatedNote : note
				)
			);
			setEditingNote(null);
			successMessage('Note updated successfully');
		} catch (error) {
			errorMessage(error);
		}
	};

	const handleTag = () => {
		setLoading(true);
	};

	const archiveNote = async (noteToArchive) => {
		try {
			const updatedNote = { ...noteToArchive, archived: true };
			const response = await axios.put(
				`${apiUrl}/notes/${noteToArchive.id}/archive`,
				updatedNote
			);
			setNotes((prevNotes) =>
				prevNotes.map((note) =>
					note.id === noteToArchive.id ? response.data : note
				)
			);
			successMessage('Note archived successfully');
			setLoading(true);
		} catch (error) {
			console.error('Error archiving note:', error);
		}
	};

	return (
		<div className='p-8 flex flex-col items-center w-10/12'>
			{contextHolder}
			<span className='text-3xl'>My Notes</span>
			<div className='flex flex-wrap justify-center -mx-4 w-full'>
				{showSpinner ? (
					<Spin
						indicator={<LoadingOutlined spin />}
						size='large'
						className='mt-8'
					/>
				) : notes.filter((note) => !note.archived).length > 0 ? (
					notes
						.filter((note) => !note.archived)
						.map((note) => (
							<div
								className='w-full md:w-1/2 xl:w-1/3 p-4'
								key={note.id}>
								<Note
									note={note}
									onDelete={onDelete}
									onEdit={onEdit}
									updateNote={updateNote}
									onArchive={archiveNote}
									onTag={handleTag}
								/>
							</div>
						))
				) : (
					<div className='mt-8'>
						<span>There are no notes yet</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default NotesContainer;
