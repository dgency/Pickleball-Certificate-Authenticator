import Image from "next/image";
import React from "react";
import gallery1 from "../../../public/home/gallery/1.png";
import gallery2 from "../../../public/home/gallery/2.png";
import gallery3 from "../../../public/home/gallery/3.png";
import gallery4 from "../../../public/home/gallery/4.png";
import gallery5 from "../../../public/home/gallery/5.png";
import gallery6 from "../../../public/home/gallery/6.png";
import about from "../../../public/home/about us.png";

function AboutAndGallery({handleClik}) {
	return (
		<div className="   relative ">
			<div className="absolute inset-0 bg-[url('/home/aboutBG.png')] bg-no-repeat bg-cover opacity-60 z-10"></div>
			<div className="g__container flex flex-col md:flex-row items-center gap-6 sm:gap-10 pt-16">
				<div className="flex-1 relative z-20">
					<h2>About Us</h2>
					<p className="pt-[25px] pb-[20px]">
						At Pickleball Certified Authentic, we are passionate about preserving the integrity of pickleball memorabilia. Founded by dedicated
						pickleball enthusiasts and experts, we understand the value that genuine pickleball memorabilia holds for players, collectors and fans
						alike.
					</p>
					<p className=" pb-[20px]">
						Our mission is to provide a reliable and trustworthy service for verifying the authenticity of pickleball memorabilia. We work directly
						with the athletes to obtain the pickleball memorabilia and certify the items immediately.
					</p>
					<p className=" pb-[20px]">
						We believe in fostering a community of trust and transparency within the pickleball world. Each certified item receives a unique serial
						number, allowing collectors to easily verify authenticity online. Our commitment to excellence means that you cann showcase or sell your
						pickleball memorabilia with confidence, knowing that it has been thoroughly vetted by our team.
					</p>
					<p className=" pb-[20px]">
						When you obtain a pickleball memorabilia item that has a Pickleball Certified Authentic tamper evident security hologram, you know your
						investment is protected and authentic.
					</p>
				</div>
				<div className="flex-1 max-w-[500px]">
					<Image src={about} height={600} width={500} className=" h-[600px] w-auto object-cover" alt="" />
				</div>
			</div>
			
			<div className="pb-[120px] pt-[80px] sm:pt-[120px] ">
				<h2 className="text-center sm:hidden">Gallery</h2>
				<div className=" pt-[25px] grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-10  relative z-30 overflow-hidden">
					<div className="overflow-hidden">
						<Image src={gallery1} height={300} width={460} className="w-full h-full object-cover hover:scale-105 duration-500" alt="" />
					</div>
					<div className="overflow-hidden">
						<Image src={gallery2} height={600} width={500} className="w-full hover:scale-105 duration-500" alt="" />
					</div>
					<div className="overflow-hidden">
						<Image src={gallery3} height={600} width={500} className="w-full hover:scale-105 duration-500" alt="" />
					</div>
					<div className="overflow-hidden">
						<Image src={gallery4} height={600} width={500} className="w-full hover:scale-105 duration-500" alt="" />
					</div>
					<div className="overflow-hidden">
						<Image src={gallery5} height={600} width={500} className="w-full hover:scale-105 duration-500" alt="" />
					</div>
					<div className="overflow-hidden">
						<Image src={gallery6} height={600} width={500} className="w-full hover:scale-105 duration-500" alt="" />
					</div>
				</div>
			</div>
			<div className="h-[60px] w-full bg-gradient-to-b from-white to-transparent absolute -top-0 z-10"></div>
			{/* <button onClick={handleClik} className="relative z-20">click</button> */}
		</div>
	);
}

export default AboutAndGallery;
