import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import NotesContainer from './NotesContainer';
import ArchivedNotesContainer from './ArchivedNotesContainer';
import Auth from './Auth';

const Layout = () => {
	const [view, setView] = useState('common');
	const [loading, setLoading] = useState(false);
	const [filteredNotes, setFilteredNotes] = useState([]);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (token) {
			setIsAuthenticated(true);
		}
	}, []);

	const handleAuthSuccess = () => {
		setIsAuthenticated(true);
	};

	return (
		<div>
			{isAuthenticated ? (
				<div className='flex h-screen w-screen font-poppins bg-[#fffcf6]'>
					<Sidebar
						setView={setView}
						view={view}
						setLoading={setLoading}
						loading={loading}
						setFilteredNotes={setFilteredNotes}
					/>
					<div className='flex p-4 w-full justify-end'>
						{view === 'common' && (
							<NotesContainer
								notes={filteredNotes}
								setNotes={setFilteredNotes}
								loading={loading}
								setLoading={setLoading}
							/>
						)}
						{view === 'archived' && (
							<ArchivedNotesContainer
								loading={loading}
								setLoading={setLoading}
							/>
						)}
					</div>
				</div>
			) : (
				<div className='flex justify-center items-center h-screen w-screen font-poppins bg-[#fffcf6]'>
					<Auth onAuthSuccess={handleAuthSuccess} />
				</div>
			)}
		</div>
	);
};

export default Layout;
