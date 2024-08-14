import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

export default function AuthComponent() {
	const [authOperation, setAuthOperation] = React.useState("login");

	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const router = useRouter();

	async function onSubmit(values: z.infer<typeof formSchema>, event: any) {
		event.preventDefault();
		let email = values.email;
		let password = values.password;

		let url = `http://localhost:3333/auth/${authOperation}`;

		let response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ email, password }),
		});

		console.log(response);

		if (response.ok) {
			router.push("/home");
		} else {
			console.log("Invalid credentials");
		}
	}

	return (
		<div className="flex flex-col w-full h-auto justify-center items-center mt-5">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-3/5 space-y-8"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="" htmlFor="email">
									Email
								</FormLabel>
								<Input id="email" type="email" {...field} />
								<FormDescription className="self-start text-xs">
									Enter your email address
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem className="flex flex-col items-center">
								<FormLabel className="self-start" htmlFor="password">
									Password
								</FormLabel>
								<Input id="password" type="password" {...field} />
								<FormDescription className="self-start text-xs">
									Enter your password
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						className="w-full mt-10 hover:bg-yellow-400 hover:text-black"
						type="submit"
					>
						{authOperation === "login" ? "Login" : "Register"}
					</Button>
				</form>
			</Form>
			<div className="flex flex-col items-center">
				<Button
					className="w-full mt-10 bg-transparent text-black border-r-2 border-l-2 hover:border-none border-black hover:bg-yellow-400 hover:text-black"
					onClick={() => {
						if (authOperation === "login") {
							setAuthOperation("register");
						} else {
							setAuthOperation("login");
						}
					}}
				>
					{authOperation === "login" ? "Register?" : "Login?"}
				</Button>
			</div>
		</div>
	);
}
