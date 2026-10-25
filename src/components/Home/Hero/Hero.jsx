import React from "react";
import SearchBar from "@/components/SearchBar";

function Hero() {
	return (
		<div className="w-full relative pb-[100px] sm:pb-[200px] pt-[100px] sm:pt-[170px] bg-[#161616ed] bg-[url('/home/hero.png')] bg-no-repeat bg-cover bg-[top_center]">
			<div className="g__mobile-container max-w-[650px] mx-auto text-center relative z-10 ">
				<h1>Pickleball Certified Authentic Verification</h1>
				<p className="text-[#b0b0b0] mt-2.5 text-lg">
					Verify the authenticity of your item. Simply enter the serial number provided by Pickleball Certified Authentic in the box below to confirm
					its legitimacy.
				</p>
				<div className=" mt-[50px]">
					<SearchBar />
				</div>
			</div>
			<div className="absolute left-0 top-0 bg-[#232323] h-full w-full mix-blend-multiply "></div>
		</div>
	);
}

export default Hero;
