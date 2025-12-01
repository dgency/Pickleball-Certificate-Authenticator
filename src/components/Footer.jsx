import Image from "next/image";
import React from "react";
import logo from "../../public/footer_logo.svg";
import Link from "next/link";

function Footer() {
	return (
		<div className="bg-[url('/footerBG.png')] bg-black bg-no-repeat bg-cover">
			<div className="border-b-[1px] border-b-[#DDD7A8]">
				<div className="flex flex-col items-center max-w-[617px] mx-auto py-[50px] ">
					<Image src={logo} height={45} width={200} className="" alt="" />
					<p className="g__mobile-container  text-center text-[14px] text-[#b0b0b0] mt-[20px]">
						At Pickleball Certified Authentic, we are passionate about preserving the integrity of pickleball memorabilia. Founded by dedicated
						pickleball enthusiasts and experts, we understand the value that genuine pickleball memorabilia holds for players, collectors and fans
						alike.
					</p>
				</div>
			</div>
            <div className="g__container text-[#CECECE] text-[12px] md:text-[14px] flex flex-col sm:flex-row gap-3 items-center justify-between py-3">
                <p className="text-center sm:text-start">© {new Date().getFullYear()} Pickleball Certified Authentic. All Rights Reserved.</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-4 leading-4">
                    <Link href={"/contact"}>Contact Us</Link>
                    <span className="w-[6px] h-[6px] bg-[#CECECE] rounded-full"></span>
                    <Link href={'/terms-of-service'}>Terms of Service</Link>
                    <span className="w-[6px] h-[6px] bg-[#CECECE] rounded-full"></span>
                    <Link href={"/privacy-policy"}>Privacy Policy</Link>
                    <span className="w-[6px] h-[6px] bg-[#CECECE] rounded-full"></span>
                    <Link href={"https://certificate.thepickleballscoreboard.com/wp-admin"} target="__blank">Admin</Link>
                </div>
            </div>
		</div>
	);
}

export default Footer;
