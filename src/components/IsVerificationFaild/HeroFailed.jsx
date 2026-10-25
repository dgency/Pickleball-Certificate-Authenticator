"use client"
import React from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import alert from "../../../public/IsverifiedFaild/alert.json";
import SearchAgain from "../SearchAgain";

function HeroFailed() {
	return (
		<div className="w-full bg-[#161616ed]  bg-[url('/IsverifiedFaild/verification_failed.png')] bg-no-repeat bg-cover ">
			<SearchAgain />
			<div className="pb-[100px] pt-[50px] sm:pt-[80px] sm:pb-[160px]">
				<div className="g__mobile-container max-w-[850px] mx-auto text-center  ">
					<div className="flex justify-center mb-3 -mt-5">
						<Lottie loop={true} animationData={alert} className="h-[150px] w-[150px]" />
					</div>
					<h1>Signature verification failed</h1>
					<p className="text-[#b0b0b0] mt-2.5 text-base md:text-lg">Please make sure you have entered a valid serial number and try again.</p>
				</div>
			</div>
		</div>
	);
}

export default HeroFailed;
