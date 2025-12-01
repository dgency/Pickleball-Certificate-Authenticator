"use client"
import React from "react";
import dynamic from "next/dynamic";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import witness from "../../../public/home/eye.json";
import Authenticity from "../../../public/home/Authenticity.json";
import verify from "../../../public/home/verify.json";

function PurchaseIncludes() {
	return (
		<div className="g__container pt-[80px] md:pt-[120px] pb-[50px] md:pb-[70px]">
			<h2 className="text-[#212222] max-w-[660px] mx-auto text-center">Purchase of a Pickleball Certified Authentic Includes</h2>
			<div className="mt-[40px] grid grid-cols-1 sm:grid-cols-3 place-items-center gap-10 sm:gap-5 max-w-[1000px] mx-auto ">
				<div className="text-center max-w-[360px] ">
					<div className="flex justify-center ">
						<Lottie loop={true} animationData={witness} className=" w-20" />
					</div>
					
					<p className="font-barlow py-2.5 font-[600] text-[20px]">Witnessing</p>
					<p className="">Pickleball Certified Authentic works directly with the athletes to obtain the item and/or autographs.</p>
				</div>
				<div className="text-center  max-w-[360px]">
					<div className="flex justify-center ">
						<Lottie loop={true} animationData={Authenticity} className=" w-20" />
					</div>
					<p className="font-barlow py-2.5 font-[600] text-[20px]">Authenticity</p>
					<p className="">Pickleball Certified Authentic affixes a tamper evident security hologram to protect the value of the certified item.</p>
				</div>
				<div className="text-center  max-w-[360px] ">
					<div className="flex justify-center ">
						<Lottie loop={true} animationData={verify} className=" w-20" />
					</div>
					<p className="font-barlow py-2.5 font-[600] text-[20px]">Security</p>
					<p className="">
						Verify the authenticity of the item. Simply enter the serial number to confirm authenticity to make sure you have an authentic item.
					</p>
				</div>
			</div>
		
		</div>
	);
}

export default PurchaseIncludes;
