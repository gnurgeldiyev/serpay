"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function PageLoader() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [loading, setLoading] = useState(false);
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Start loading
		setLoading(true);
		setProgress(10);

		// Simulate progress
		const timer1 = setTimeout(() => setProgress(50), 100);
		const timer2 = setTimeout(() => setProgress(80), 200);

		// Complete loading
		const timer3 = setTimeout(() => {
			setProgress(100);
			setTimeout(() => {
				setLoading(false);
				setProgress(0);
			}, 200);
		}, 300);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, [pathname, searchParams]);

	if (!loading) return null;

	return (
		<div
			className="fixed top-0 left-0 right-0 h-[4px] bg-green-500 z-50 transition-all duration-300 ease-out"
			style={{
				width: `${progress}%`,
				opacity: progress === 100 ? 0 : 1,
			}}
		/>
	);
}
