"use client"
import Image from "next/image";
import React, { useRef, useState } from "react";
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

	const [isSending, setIsSending] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	// A ref, not state, so a fast double click can't start a second submission before re-render.
	const sendingRef = useRef(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (sendingRef.current) return;
		if (formData.firstName === "" || formData.lastName === "" || formData.email === "" || formData.phoneNumber === "" || formData.message === "") return;

		sendingRef.current = true;
		setIsSending(true);
		setErrorMessage("");

		let text = document.querySelector(".text");
		let send = document.querySelector(".send");
		let loader = document.querySelector(".loader");
		let success = document.querySelector(".success");

		// Start the sending animation (the loader takes about 1.8s to fill)
		text.classList.add("active");
		send.classList.add("active");
		loader.classList.add("active");
		const animationDone = new Promise((resolve) => setTimeout(resolve, 1700));

		let delivered = false;
		try {
			const token = await getCaptchaToken();
			if (!token) throw new Error("reCAPTCHA token unavailable");

			const apiUrl = process.env.NEXT_PUBLIC_API_URL;
			const response = await axios.post(`${apiUrl}/api/send-contact-info`, { ...formData, token });
			delivered = response?.data?.success === true;
		} catch (error) {
			console.error("Error sending form:", error);
		}

		await animationDone;
		loader.classList.remove("active");
		text.classList.remove("active");
		send.classList.remove("active");

		if (delivered) {
			// Show success only after the API confirmed the email was sent
			success.classList.add("active");
			setTimeout(function () {
				success.classList.remove("active");
			}, 2400);

			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phoneNumber: "",
				message: "",
			});
		} else {
			setErrorMessage("Sorry, your message could not be sent. Please try again later.");
		}

		sendingRef.current = false;
		setIsSending(false);
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
									<button type="submit" disabled={isSending} aria-busy={isSending} className="send  w-full sm:w-[inherit]">
										<div className="text font-[500] ">Send Message</div>
										<div className="loader text-[12px]"></div>
										{/* <div class="done">SUCCESS</div> */}
									</button>
									<div className="success absolute  -bottom-3 text-[#00A631] flex items-center gap-1">
										<Lottie loop={true} animationData={check} className="h-[25px] sm:h-[30px] w-[25px] sm:w-[30px]" />
										Success!!
									</div>
									{errorMessage && (
										<p role="alert" className="absolute left-0 right-0 -bottom-8 text-center text-[14px] text-[#D92D20]">
											{errorMessage}
										</p>
									)}
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
