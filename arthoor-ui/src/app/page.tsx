"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import AuthComponent from "@/components/AuthComponent";

export default function LandingPage() {
	const [helloMessage, setHelloMessage] = useState("Bring art to life");
	const [arrowModal, setArrowModal] = useState(false);

	useEffect(() => {
		const helloMessages = [
			"Show your work",
			"Explore art",
			"Create something new",
			"Share your passion",
			"Connect with others",
			"Inspire the world",
		];

		const interval = setInterval(() => {
			setHelloMessage(
				helloMessages[Math.floor(Math.random() * helloMessages.length)]
			);
		}, 2000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="flex min-h-screen w-scren flex-col items-center justify-center">
			<div className="flex flex-row w-full lg:w-2/3 xl:w-1/3 h-auto bg-yellow-400 p-5 border-t-8 justify-evenly">
				<span className="flex flex-col items-start justify-start w-1/2">
					<h1 className="text-4xl font-bold">Arthoor</h1>
					<p className="text-xl text-nowrap">For the digital creator in you</p>
				</span>
				<span className="flex flex-col items-end justify-center w-1/2">
					<span
						onClick={() => setArrowModal(!arrowModal)}
						className={`transform transition-transform duration-300 ${
							arrowModal ? "rotate-90" : ""
						}`}
					>
						<ArrowRight size={48} />
					</span>
				</span>
			</div>
			<div className="flex flex-col items-center justify-center w-full lg:w-2/3 xl:w-1/3 min-h-1/2 bg-black p-5 mb-8">
				<p className="text-lg text-white">* {helloMessage} *</p>
			</div>
			{arrowModal && (
				<div
					className={`w-full lg:w-2/3 xl:w-1/3 h-auto transform transition-transform duration-75 ease-in-out ${
						arrowModal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
					}`}
				>
					<AuthComponent />
				</div>
			)}
		</div>
	);
}
