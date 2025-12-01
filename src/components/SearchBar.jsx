"use client";
import React, { useEffect, useState } from "react";
import { ReactTyped } from "react-typed";
import Lottie from "lottie-react";
import search from "../../public/home/search.json";
import { useGlobalState } from "@/context/GlobalStateContext";
import Image from "next/image";
import ball from "../../public/favicon.svg";

function SearchBar() {
	const { post, updatePost, setInput } = useGlobalState();
	const [certificateNumber, setCertificateNumber] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleGetCertificate = async () => {
		setIsLoading(true);
		setInput(certificateNumber);

		try {
			const certificate = await fetch(`/api/certificates/${certificateNumber}`, {
				cache: "no-cache",
			});

			if (!certificate.ok) {
				throw new Error("Failed to fetch certificate");
			}

			const finalData = await certificate.json();
			updatePost(finalData);
		} catch (error) {
			console.error("Error:", error);
			updatePost(undefined);
		} finally {
			setIsLoading(false);
		}
	};

	// console.log(certificateNumber);

	return (
		<div>
			<div className="flex">
				<ReactTyped strings={["Type your serial number", "1234567"]} typeSpeed={40} backSpeed={50} attr="placeholder" loop className=" w-full">
					<input
						type="text"
						value={certificateNumber}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleGetCertificate();
							}
						}}
						onChange={(e) => setCertificateNumber(e.target.value)}
						maxLength="7"
						className={`${
							post === undefined ? "bg-[#F5F5F5]" : ""
						} w-full py-[14px] px-2.5 sm:px-5 cursor-text rounded-l-md outline-none text-base sm:text-[18px]`}
					/>
				</ReactTyped>

				<div
					onClick={handleGetCertificate}
					className={`group btn_click flex-none relative bg-[#FA9D00]  px-3 sm:px-8 -ml-2  flex justify-center items-center gap-1 font-[500] sm:text-[20px] rounded-r-md cursor-pointer `}
				>
					<span className={`${isLoading ? "opacity-0 " : "group-hover:scale-110 duration-300"} `}>Search</span>
					<Lottie loop={true} animationData={search} className={`${isLoading ? "opacity-0 " : "group-hover:scale-125 duration-300"} h- w-[40px] `} />
					{/* {!isLoading && <LoadingAnimation />} */}
					{isLoading && <Image src={ball} height={30} width={40} alt="" className="animate-spin absolute " />}
				</div>
			</div>
			<p className="text-[#D9D9D9] text-start font-[400] pt-2.5">(You can try: 1234567)</p>
		</div>
	);
}

export default SearchBar;
