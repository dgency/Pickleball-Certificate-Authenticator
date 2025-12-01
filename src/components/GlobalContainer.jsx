"use client";
import React, { useEffect } from "react";
import Hero from "./Home/Hero/Hero";
import PurchaseIncludes from "./Home/PurchaseIncludes";
import AboutAndGallery from "./Home/AboutAndGallery";
import BodyContent from "./IsVerifiedOk/BodyContent";
import HeroOk from "./IsVerifiedOk/HeroOk";
import HeroFailed from "./IsVerificationFaild/HeroFailed";
import FailedMessage from "./IsVerificationFaild/FailedMessage";
import { useGlobalState } from "@/context/GlobalStateContext";

function GlobalContainer() {
	const { post, input } = useGlobalState();

	useEffect(() => {
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 200);
	},[ ,post]);
	// const handleClik = ()=>{
	// 	window.scrollTo(0, 0);

	// }

	return (
		<div>
			<div className="">
				{post === null && (
					<div>
						<Hero />
						<PurchaseIncludes />
						<AboutAndGallery />
					</div>
				)}

				{/* --------verification ok ----------- */}
				{post !== null && post !== undefined && (
					<div>
						<HeroOk />
						<BodyContent post={post} />
					</div>
				)}

				{/* ------------verification faild-------------- */}

				{post === undefined && (
					<div>
						<HeroFailed />
						<FailedMessage input={input} />
					</div>
				)}
			</div>
		</div>
	);
}

export default GlobalContainer;
