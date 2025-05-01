import { useRef } from 'react';

export default function MessageInput({
	message,
	setMessage,
	onKeyDown,
	isDisabled,
	extraClass = '',
	placeholder = 'Type here...',
}) {
	const taRef = useRef();

	const handleChange = (e) => {
		setMessage(e.target.value);
		// --- auto‑grow ---
		const el = taRef.current;
		if (!el) return;
		el.style.height = 'auto'; // reset
		el.style.height = Math.min(el.scrollHeight, 200) + 'px'; // cap at 200 px
	};

	return (
		<textarea
			ref={taRef}
			value={message}
			onChange={handleChange}
			onKeyDown={onKeyDown}
			placeholder={isDisabled ? 'Waiting for response...' : placeholder}
			disabled={isDisabled}
			className={`w-full bg-transparent py-3 focus:outline-none resize-y text-foreground ${extraClass} ${isDisabled ? 'opacity-60' : ''}`}
			rows={1}
			style={{ maxHeight: '200px' }}
		/>
	);
}
