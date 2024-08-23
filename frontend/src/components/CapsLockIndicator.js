import React, { useState, useEffect } from 'react';

const CapsLockIndicator = () => {
	const [isCapsLockOn, setIsCapsLockOn] = useState(false);

	const handleKeyDown = (event) => {
		if (event.getModifierState && event.getModifierState('CapsLock')) {
			setIsCapsLockOn(true);
		} else {
			setIsCapsLockOn(false);
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div>
			{isCapsLockOn && (
				<div className='w-full flex justify-center items-center'>
					<p className=' text-red-700 px-6 py-1 text-xs '>Caps Lock on</p>
				</div>
			)}
		</div>
	);
};

export default CapsLockIndicator;
