"use client"
import React from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import check from "../../../public/IsverifiedOk/check.json";
import SearchAgain from "../SearchAgain";

function Hero() {
	return (
		<div className="w-full bg-[#161616ed] bg-[url('/IsverifiedOk/verified_hero.png')] bg-no-repeat bg-cover ">
			<SearchAgain />
			<div className="pb-[100px] pt-[50px] sm:pt-[80px] sm:pb-[160px]">
				<div className="g__mobile-container  max-w-[750px] mx-auto text-center ">
					<div className="flex justify-center mb-6">
						<Lottie loop={true} animationData={check} className="h-[150px] w-[150px]" />
					</div>
					<h1>Signature Verified</h1>
					<p className="text-[#b0b0b0] mt-2.5 text-base md:text-lg">
						Verify the authenticity of your autographed item. Simply enter the serial number provided by Pickleball Certified Authentic in the box
						below to confirm its legitimacy.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Hero;
