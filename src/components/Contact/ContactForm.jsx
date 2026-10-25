"use client"
import Image from "next/image";
import React, { useState } from "react";
import contact from "../../../public/contact.svg";
import axios from "axios";
import { getCaptchaToken } from "@/server/utils/captcha";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
// import success from "../../../public/success.json"
import check from "../../../public/IsverifiedOk/check.json";

function ContactForm() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phoneNumber: "",
		message: "",
	});

	const [isSuccess, setIsSuccess] = useState(false);

	

	const handleSubmit = async (e) => {
		e.preventDefault();

		const token = await getCaptchaToken();
		const newData = { ...formData, token };

		let text = document.querySelector(".text");
		let send =document.querySelector(".send");
		let loader =document.querySelector(".loader");
		let success =document.querySelector(".success");


		if (formData.firstName !== "" && formData.lastName !== "" && formData.email !== "" && formData.phoneNumber !== "" && formData.message !== "") {
			// Add 'active' class to elements
			text.classList.add("active");
			send.classList.add("active");
			loader.classList.add("active");

			// Delay to add 'finished' class
			setTimeout(function () {
				loader.classList.remove("active");
				text.classList.remove("active");
				send.classList.remove("active");
				setIsSuccess(true);
			}, 1700);

			// Delay to add 'active' class to '.done' element
			setTimeout(function () {
				success.classList.add("active");
			}, 1600);

			setTimeout(function () {
				// document.querySelector(".done").classList.add("active");
				success.classList.remove("active");
			}, 4000);
		}

		try {
			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			await axios.post(`${apiUrl}/api/send-contact-info`, newData);

			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				message: "",
			});

		} catch (error) {
			console.error("Error sending form:", error);
		}
	};

	return (
		<div className="g__mobile-container ">
			<div className="bg-white relative rounded-md shadow-[0px_2px_5px_1px_#22222210] px-5 sm:px-16 pt-10 pb-32 sm:pb-14 max-w-[770px] mx-auto mb-[120px] space-y-5 sm:space-y-10">
				<form onSubmit={handleSubmit} className="space-y-5 sm:space-y-10">
					<div className="flex flex-col sm:flex-row gap-5">
						<div className="flex-1">
							<p className="font-[500] text-[#262626] pb-1">First Name</p>
							<input
								type="text"
								placeholder="John"
								value={formData.firstName}
								required
								onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
								className="w-full bg-[#F5F5F5] border-[1px] border-[#E6E6E6] py-1.5 rounded-md outline-none px-2.5"
							/>
						</div>
						<div className="flex-1">
							<p className="font-[500] text-[#262626] pb-1">Last Name</p>
							<input
								type="text"
								placeholder="Doe"
								value={formData.lastName}
								required
								onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
								className="w-full bg-[#F5F5F5] border-[1px] border-[#E6E6E6] py-1.5 px-2.5 rounded-md outline-none"
							/>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-5">
						<div className="flex-1">
							<p className="font-[500] text-[#262626] pb-1">Email</p>
							<input
								type="email"
								placeholder="demo@gmail.com"
								value={formData.email}
								required
								onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
								className="w-full bg-[#F5F5F5] border-[1px] border-[#E6E6E6] py-1.5 px-2.5 rounded-md outline-none"
							/>
						</div>
						<div className="flex-1">
							<p className="font-[500] text-[#262626] pb-1">Phone Number</p>
							<input
								type="number"
								placeholder="+1 012 3456 789"
								value={formData.phoneNumber}
								required
								onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
								className="w-full bg-[#F5F5F5] border-[1px] border-[#E6E6E6] py-1.5 px-2.5 rounded-md outline-none"
							/>
						</div>
					</div>
					<div>
						<p className="font-[500] text-[#262626] pb-1">Message</p>
						<textarea
							type="text"
							rows="10"
							placeholder="Write your message..."
							value={formData.message}
							required
							onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
							className="w-full bg-[#F5F5F5] border-[1px] border-[#E6E6E6] py-2 px-3 rounded-md resize-none outline-none"
						/>
						<div className="h-[70px]">
							<div className="mt-5 flex justify-end relative">
								<span className="relative w-full sm:w-[inherit]">
									<button type="submit" className="send  w-full sm:w-[inherit]">
										<div className="text font-[500] ">Send Message</div>
										<div className="loader text-[12px]"></div>
										{/* <div class="done">SUCCESS</div> */}
									</button>
									<div className="success absolute  -bottom-3 text-[#00A631] flex items-center gap-1">
										<Lottie loop={true} animationData={check} className="h-[25px] sm:h-[30px] w-[25px] sm:w-[30px]" />
										Success!!
									</div>
								</span>
							</div>
						</div>
					</div>
				</form>
				<Image
					src={contact}
					height={97}
					width={242}
					priority
					className="absolute bottom-4 left-[50%] translate-x-[-50%] sm:translate-x-0 sm:left-4"
					alt=""
				/>
			</div>
		</div>
	);
}

export default ContactForm;
