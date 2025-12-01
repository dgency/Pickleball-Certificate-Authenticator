"use client";
import Image from "next/image";
import React from "react";
import logo from "../../public/logo.svg";
import Link from "next/link";
import { useGlobalState } from "@/context/GlobalStateContext";

function Navbar() {
	const { updatePost } = useGlobalState();

	const handleReload = () => {
		updatePost(null);
	};

	return (
		<div className="text-red-400 text-xl py-3 bg-[#232323]">
			<div className="g__container">
				<Link href={"/"}>
					<Image src={logo} height={45} width={200} className="cursor-pointer" onClick={handleReload} alt="" />
				</Link>
			</div>
		</div>
	);
}

export default Navbar;
