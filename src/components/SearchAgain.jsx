"use client"
import Link from "next/link";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";

function SearchAgain() {
	const handleReload = () => {
		window.location.reload();
	};
	return (
		<div className="max-w-[1100px] mx-auto">
			<div className="h-[inherit] sm:h-[68px] self-start sm:self-auto sm:flex sm:items-center pt-[25px] sm:pt-10 ml-2.5 md:ml-0 mb-[30px] sm:mb-0">
				<Link
					href="/"
					onClick={handleReload}
					className="text-white text-center font-[400] text-[12px] md:text-[14px] flex items-center decoration-[1px]  underline underline-offset-4 "
				>
					<BiChevronLeft className="text-xl" /> SEARCH AGAIN
				</Link>
			</div>
		</div>
	);
}

export default SearchAgain;
