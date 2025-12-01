import React from "react";
import SearchBar from "../SearchBar";
import Lottie from "lottie-react";
import alert from "../../../public/IsverifiedFaild/alert.json";

function FailedMessage({ input }) {
	return (
		<div>
			<div className="bg-[#EDEDED] py-5">
				<div className="g__container">
					<div className="text-[24px] sm:text-[40px] font-barlow font-[600] flex">
						Serial Number - <span className="font-[400] flex items-center gap-3">{input} <Lottie loop={true} animationData={alert} className="h-[30px] sm:h-[40px] w-[30px] sm:w-[40px]" /></span>
					</div>
				</div>
			</div>
			<div className="pt-[80px] pb-[120px]">
				<div className="g__mobile-container  max-w-[630px] mx-auto ">
					<SearchBar />
				</div>
				<div className="g__mobile-container  max-w-[770px] mx-auto mt-[50px]">
					<p className="text-[36px] font-[600] font-barlow text-[#212222]">Instructions to Search Again</p>
					<ul className="pt-3">
						<li className="text-[#565656]">
							* Please allow up to 21 days after the conclusion of the event for Pickleball Authentic Certified to upload all the certified items.
						</li>
						<li className="text-[#565656]">
							* If your search results do not show up after 30 days, please submit your serial number through our Contact Us form and we will get back
							to you.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

export default FailedMessage;
