"use client";

import { useEffect, useState, useRef } from "react";
import { Menu, Plus, Folder, User, House } from "lucide-react";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarTrigger,
} from "@/components/ui/menubar";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Label } from "./ui/label";

export default function NavMenu() {
	const router = useRouter();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [openDialog, setOpenDialog] = useState<string | null>(null);
	const [imageDefaultName, setImageDefaultName] = useState<string>(
		`image-${new Date().getTime().toString()}`
	);
	const [portfolioDefaultName, setPortfolioDefaultName] = useState<string>(
		`portfolio-${new Date().getTime().toString()}`
	);
	const [portfolioDescription, setPortfolioDescription] = useState<string>("");

	const menuItems = [
		{
			id: "new-image",
			label: "New Image",
			icon: <Plus className="mr-5" />,
		},
		{
			id: "new-portfolio",
			label: "New Portfolio",
			icon: <Folder className="mr-5" />,
		},
	];

	const handleNewImage = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleFileChange = async (event: any) => {
		event.preventDefault();
		console.log(imageDefaultName, portfolioDefaultName);
		if (imageDefaultName === "" || portfolioDefaultName === "") {
			alert("Please enter a name for the image and portfolio.");
			return;
		}
		const file = event.target.files[0];
		console.log(file);
		if (file) {
			const formData = new FormData();
			formData.append("image", file);
			formData.append("name", imageDefaultName);
			formData.append("portfolio", portfolioDefaultName);

			const response = await fetch(
				"http://localhost:3333/portfolio/new-image",
				{
					method: "POST",
					credentials: "include",
					body: formData,
				}
			);

			if (response.ok) {
				alert("Image uploaded successfully!");
				setOpenDialog(null);
			} else {
				alert("Image upload failed!");
			}
		}
	};

	const handleNewFolder = async () => {
		const response = await fetch(
			"http://localhost:3333/portfolio/new-portfolio",
			{
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: portfolioDefaultName,
					description: portfolioDescription,
				}),
			}
		);

		if (response.ok) {
			alert("Portfolio created successfully!");
			setOpenDialog(null);
		} else {
			alert("Portfolio creation failed!");
		}
	};

	return (
		<Menubar className="bg-yellow-400 border-2 size-14 flex justify-center rounded-full cursor-pointer">
			<MenubarMenu>
				<MenubarTrigger className="data-[state=open]:bg-transparent select-none focus:bg-transparent cursor-pointer">
					<Menu />
				</MenubarTrigger>
				<MenubarContent className="mt-2">
					{menuItems.map((item) => (
						<MenubarItem
							key={item.id}
							className="flex items-center focus:bg-yellow-400 active:bg-yellow-400 font-semibold cursor-pointer"
							onClick={() => setOpenDialog(item.id)}
						>
							{item.icon}
							<span className="ml-1 mr-3">{item.label}</span>
						</MenubarItem>
					))}
				</MenubarContent>
			</MenubarMenu>
			{menuItems.map((item) => (
				<Dialog
					key={item.id}
					open={openDialog === item.id}
					onOpenChange={() => setOpenDialog(null)}
				>
					<DialogContent className="sm:max-w-md">
						<DialogHeader>
							<DialogTitle>{item.label}</DialogTitle>
							<DialogDescription>
								Add a new {item.label.toLowerCase()} to your profile.
							</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							{openDialog === "new-image" && (
								<>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="image-name" className="text-right">
											Image Name
										</Label>
										<Input
											id="image-name"
											value={imageDefaultName}
											className="col-span-3"
											onChange={(e) => setImageDefaultName(e.target.value)}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="portfolio" className="text-right">
											Portfolio
										</Label>
										<Input
											id="portfolio"
											value={portfolioDefaultName}
											className="col-span-3"
											onChange={(e) => setPortfolioDefaultName(e.target.value)}
										/>
									</div>
								</>
							)}

							{openDialog === "new-portfolio" && (
								<>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label htmlFor="portfolio" className="text-right">
											Portfolio
										</Label>
										<Input
											id="portfolio"
											value={portfolioDefaultName}
											className="col-span-3"
											onChange={(e) => setPortfolioDefaultName(e.target.value)}
										/>
									</div>
									<div className="grid grid-cols-4 items-center gap-4">
										<Label
											htmlFor="portfolio-description"
											className="text-right"
										>
											Portfolio Description
										</Label>
										<textarea
											id="portfolio-description"
											value={portfolioDescription}
											className="col-span-3"
											onChange={(e) => setPortfolioDescription(e.target.value)}
										/>
									</div>
								</>
							)}
						</div>
						<DialogFooter>
							<Button
								onClick={
									item.id === "new-image" ? handleNewImage : handleNewFolder
								}
								className="hover:bg-yellow-400 hover:text-black"
							>
								{item.label}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			))}
			<input
				type="file"
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
		</Menubar>
	);
}
