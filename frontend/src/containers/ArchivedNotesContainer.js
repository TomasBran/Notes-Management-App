import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Note from '../components/Note';
import { message, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const apiUrl = 'http://localhost:3001';

const ArchivedNotesContainer = ({ loading, setLoading }) => {
	const [notes, setNotes] = useState([]);
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
			successMessage('Note deleted succesfully');
			setLoading(true);
		} catch (error) {
			errorMessage(error);
		}
	};

	const handleUnarchive = async (noteToUnarchive) => {
		try {
			const updatedNote = { ...noteToUnarchive, archived: false };
			const response = await axios.put(
				`${apiUrl}/notes/${noteToUnarchive.id}/unarchive`,
				updatedNote
			);
			setNotes((prevNotes) =>
				prevNotes.map((note) =>
					note.id === noteToUnarchive.id ? response.data : note
				)
			);
			setLoading(true);
			successMessage('Note unarchived succesfully');
		} catch (error) {
			errorMessage(error);
		}
	};

	return (
		<div className='p-8 flex flex-col items-center w-10/12'>
			{contextHolder}
			<span className='text-3xl'>Archived Notes</span>
			<div className='flex flex-wrap justify-center -mx-4 w-full'>
				{showSpinner ? (
					<Spin
						indicator={<LoadingOutlined spin />}
						size='large'
						className='mt-8'
					/>
				) : notes.filter((note) => note.archived).length > 0 ? (
					notes
						.filter((note) => note.archived)
						.map((note) => (
							<div
								className='w-full md:w-1/2 xl:w-1/3 p-4'
								key={note.id}>
								<Note
									note={note}
									onDelete={onDelete}
									onArchive={handleUnarchive}
								/>
							</div>
						))
				) : (
					<p className='mt-8'>There are no archived notes yet</p>
				)}
			</div>
		</div>
	);
};

export default ArchivedNotesContainer;
