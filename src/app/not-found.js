import Image from "next/image";
import React from "react";
import image from "@/../../public/404.jpg";
import Link from "next/link";

function NotFound() {
	return (
		<div>
			<div className="w-full bg-[#161616ed] sm:bg-[url('/404.jpg')] bg-no-repeat bg-[length:auto_80%] sm:bg-cover  bg-center ">
				<div className=" sm:h-[100vh] relative">
					<Image src={image} height={500} width={800} alt="" className="h-[600px] w-full object-cover sm:hidden" />
					<h1 className="absolute top-12 sm:top-14 text-[28px] sm:text-[36px] px-2.5 left-[50%] w-full translate-x-[-50%] text-center" >Oops! sorry page does not found...</h1>
                    <Link href={"/"} className="px-10 py-3 rounded-md font-[500] bg-[#FA9D00] absolute bottom-12 sm:bottom-28 left-[50%] translate-x-[-50%]">Go Home</Link>
				</div>
			</div>
		</div>
	);
}

export default NotFound;
