import React, { useEffect, useState } from 'react';
import { Drawer, FloatButton } from 'antd';
import NewNoteForm from './NewNoteForm';
import { message } from 'antd';
import axios from 'axios';
import logo from '../assets/ensolvers_logo.png';
import { motion, AnimatePresence } from 'framer-motion';
import './Sidebar.css';
import { CiLogout } from 'react-icons/ci';
const apiUrl = 'http://localhost:3001';

const Sidebar = ({ setView, setLoading, loading, setFilteredNotes, view }) => {
	const [open, setOpen] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const [uniqueCategories, setUniqueCategories] = useState([]);
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [allNotes, setAllNotes] = useState([]);

	const successMessage = (message) => {
		messageApi.open({
			type: 'success',
			content: message,
			duration: 1.5,
		});
	};

	const fetchNotes = async () => {
		try {
			const response = await axios.get(`${apiUrl}/notes`);
			const notes = response.data;
			setAllNotes(notes);
			return notes;
		} catch (error) {
			console.error('Error al obtener las notas:', error);
			return [];
		}
	};

	const getUniqueCategories = (notes) => {
		const unarchivedNotes = notes.filter((note) => !note.archived);

		const allCategories = unarchivedNotes.flatMap((note) => note.categories);

		const categoryCount = allCategories.reduce((acc, category) => {
			if (category !== null) {
				acc[category] = (acc[category] || 0) + 1;
			}
			return acc;
		}, {});

		const uniqueCategories = Object.entries(categoryCount).map(
			([name, count]) => ({
				name,
				count,
			})
		);

		return uniqueCategories;
	};

	useEffect(() => {
		const fetchAndSetCategories = async () => {
			const notes = await fetchNotes();
			const categories = getUniqueCategories(notes);
			setUniqueCategories(categories);
			setFilteredNotes(notes);
			setSelectedCategories([]);
		};

		fetchAndSetCategories();
	}, []);

	useEffect(() => {
		const fetchAndSetCategories = async () => {
			const notes = await fetchNotes();
			const categories = getUniqueCategories(notes);
			setUniqueCategories(categories);
			setFilteredNotes(notes);
			setSelectedCategories([]);
		};
		if (loading) {
			fetchAndSetCategories();
			setLoading(false);
		}
	}, [loading]);

	const handleViewArchived = () => {
		setView('archived');
		setLoading(true);
	};

	const handleViewCommon = () => {
		setView('common');
	};

	const handleCreateNote = () => {
		setOpen(true);
	};

	const handleCategoryClick = async (categoryName) => {
		setView('common');
		const allNotes = await fetchNotes();
		setSelectedCategories((prevSelected) => {
			let newSelected = Array.isArray(prevSelected) ? [...prevSelected] : [];

			if (newSelected.includes(categoryName)) {
				newSelected = newSelected.filter(
					(category) => category !== categoryName
				);
			} else {
				newSelected.push(categoryName);
			}

			if (newSelected.length === 0) {
				setFilteredNotes(allNotes);
			} else {
				setFilteredNotes(
					allNotes.filter((note) => {
						const categories = Array.isArray(note.categories)
							? note.categories
							: [];

						return newSelected.every((category) =>
							categories.includes(category)
						);
					})
				);
			}

			return newSelected;
		});
	};

	const logOut = () => {
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		window.location.reload();
	};
	return (
		<div className='bg-[#fff9ef] h-screen fixed justify-between flex flex-col w-2/12 text-[#262538] shadow-xl shadow-gray-300'>
			{contextHolder}
			<div>
				<div className='flex flex-col items-center justify-center py-4'>
					<img
						src={logo}
						alt='logo'
						className='w-40'
					/>
					<span className='text-xl font-bold italic'>Notes</span>
				</div>
				<div className='w-full flex flex-col gap-4'>
					<span className='p-2 font-semibold'>
						Welcome, {localStorage.getItem('username')}
					</span>
					<button
						onClick={handleViewCommon}
						className={`w-11/12 rounded-r-full py-2 px-4 mt-4 hover:bg-[#cb842e] active:bg-[#9e6520] hover:bg-opacity-100 font-semibold ${
							view === 'common'
								? 'bg-[#f09e3a] text-gray-800'
								: 'bg-[#7e5016] text-white bg-opacity-80'
						}`}>
						Active Notes
					</button>

					<AnimatePresence>
						{view === 'common' && (
							<motion.div
								initial={{ height: 0, opacity: 0 }}
								animate={{ height: 'auto', opacity: 1 }}
								exit={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.5 }}
								className='flex flex-col overflow-auto max-h-[40vh] sidebar-scroll gap-0.5'>
								{uniqueCategories.map((category, index) => (
									<span
										key={index}
										onClick={() => handleCategoryClick(category.name)}
										className={`cursor-pointer ${
											selectedCategories.includes(category.name)
												? 'bg-green-100'
												: ''
										} hover:bg-orange-100 active:bg-orange-200 transition-all duration-150 py-4 px-2`}>
										{category.name} ({category.count})
									</span>
								))}
							</motion.div>
						)}
					</AnimatePresence>

					<button
						onClick={handleViewArchived}
						className={`w-11/12 rounded-r-full py-2 px-4 hover:bg-[#cb842e] active:bg-[#9e6520] hover:bg-opacity-100 font-semibold ${
							view === 'archived'
								? 'bg-[#f09e3a] text-gray-800'
								: 'bg-[#7e5016] text-white bg-opacity-80'
						}`}>
						Archived Notes
					</button>
				</div>
			</div>
			<div className='self-end flex items-center gap-1 m-2 hover:text-orange-400 cursor-pointer'>
				<CiLogout />
				<span onClick={logOut}>Log out</span>
			</div>
			<FloatButton
				onClick={handleCreateNote}
				type='primary'
			/>
			<Drawer
				closable
				destroyOnClose
				title={<p>Add new note</p>}
				placement='bottom'
				open={open}
				onClose={() => setOpen(false)}>
				<NewNoteForm
					onSuccess={() => {
						setOpen(false);
						successMessage('Note created successfully');
						setLoading(true);
					}}
				/>
			</Drawer>
		</div>
	);
};

export default Sidebar;
