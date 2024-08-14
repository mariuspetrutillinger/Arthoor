"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import NavMenu from "@/components/NavMenu";
import Image from "next/image";
import { LockIcon, LockOpenIcon } from "lucide-react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

type PortfolioImage = {
	id: number;
	filename: string;
	mimetype: string;
	data: string;
	portfolio: string;
};

type Portfolio = {
	id: number;
	name: string;
	description: string;
	userId: string;
	images: [];
};

type User = {
	id: string;
	email: string;
	password: string;
	portfolios: Portfolio[];
};

export default function HomePage() {
	const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
	const [hidden, setHidden] = useState<Portfolio[]>([]);
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	const getImagePreview = (data: string, mimetype: string): string => {
		const base64 = Buffer.from(data).toString("base64");
		return `data:${mimetype};base64,${base64}`;
	};

	const hidePortfolio = async (portfolio: Portfolio) => {
		setHidden([...hidden, portfolio]);
		setPortfolios(portfolios.filter((p) => p.id !== portfolio.id));
	};

	const unhidePortfolio = async (portfolio: Portfolio) => {
		setPortfolios([...portfolios, portfolio]);
		setHidden(hidden.filter((p) => p.id !== portfolio.id));
	};

	useEffect(() => {
		const verifyCookie = async () => {
			const response = await fetch("http://localhost:3333/auth/verify", {
				method: "POST",
				credentials: "include",
			});

			if (!response.ok) {
				window.location.href = "/";
			}
		};

		const fetchPortfolios = async () => {
			const response = await fetch("http://localhost:3333/portfolio", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			setPortfolios(data);
		};

		const fetchUser = async () => {
			const response = await fetch("http://localhost:3333/user", {
				method: "GET",
				credentials: "include",
			});

			const data = await response.json();
			setCurrentUser(data);
		};

		verifyCookie();
		fetchUser();
		fetchPortfolios();
	}, []);

	return (
		<div className="flex w-screen min-h-screen justify-center gap-10">
			<nav
				id="homeIcon"
				className="flex justify-between items-center p-4 fixed top-10 w-[90%] h-20 bg-black rounded-full shadow-lg shadow-yellow-400 z-10"
			>
				<NavMenu />
				<span className="text-black bg-yellow-400 border-2 rounded-full text-2xl font-bold p-3 h-14 flex items-center">
					<Link href="/home#homeIcon">Arthoor</Link>
				</span>
			</nav>
			<div className="flex flex-col mt-52 w-[80%]">
				<h1 className="text-4xl font-bold self-start">All Portfolios</h1>
				<div className="w-full bg-gradient-to-r from-yellow-400 to-white h-1 rounded-full"></div>
				<div className="flex flex-col items-center w-full">
					<div className="w-full flex flex-row space-x-16 flex-nowrap justify-center">
						{portfolios.map((portfolio) => (
							<div
								key={portfolio.id}
								className="m-4 p-4 bg-white rounded-lg shadow-lg w-auto h-auto"
							>
								<div className="flex justify-between items-center">
									<span>
										<h2 className="text-2xl font-bold">{portfolio.name}</h2>
										<p className="text-lg">{portfolio.description}</p>
									</span>
									<LockOpenIcon
										className="text-yellow-400 h-8 w-8"
										onClick={() => hidePortfolio(portfolio)}
									/>
								</div>
								<Carousel>
									<CarouselContent>
										{portfolio.images.map((image: PortfolioImage) => (
											<CarouselItem key={image.id} className="w-28 ml-1 mr-1">
												<Image
													key={image.id}
													src={getImagePreview(image.data, image.mimetype)}
													alt={image.filename}
													width={100}
													height={100}
													objectFit="cover"
													className="h-56 w-56 object-cover rounded-lg mt-5 transition-all"
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							</div>
						))}
					</div>
					<div className="w-full flex flex-row space-x-16 flex-nowrap justify-center">
						{hidden.map((portfolio) => (
							<div
								key={`${portfolio.id}-hidden`}
								className="m-4 p-4 bg-white rounded-lg shadow-lg w-auto h-auto opacity-30"
							>
								<div className="flex justify-between items-center">
									<span>
										<h2 className="text-2xl font-bold">{portfolio.name}</h2>
										<p className="text-lg">{portfolio.description}</p>
									</span>
									<LockIcon
										className="text-yellow-400 h-8 w-8"
										onClick={() => unhidePortfolio(portfolio)}
									/>
								</div>
								<Carousel>
									<CarouselContent>
										{portfolio.images.map((image: PortfolioImage) => (
											<CarouselItem
												key={`${image.id}-hidden`}
												className="w-28 ml-1 mr-1"
											>
												<Image
													key={`${image.id}-hidden`}
													src={getImagePreview(image.data, image.mimetype)}
													alt={image.filename}
													width={100}
													height={100}
													objectFit="cover"
													className="h-56 w-56 object-cover rounded-lg mt-5 transition-all"
												/>
											</CarouselItem>
										))}
									</CarouselContent>
									<CarouselPrevious />
									<CarouselNext />
								</Carousel>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
