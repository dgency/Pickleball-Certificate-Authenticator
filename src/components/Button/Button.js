"use client";
import gsap, { Elastic, Power3 } from "gsap";
import React, { useEffect, useState } from "react";

function Button({ certificateNumber }) {
	const [isDownloading, setIsDownloading] = useState(false);

	useEffect(() => {
		async function fetchPDF() {
			const button = document.querySelector(".button");

			const duration = 2500;
			const svg = button.querySelector("svg");
			const svgPath = new Proxy(
				{ y: null, smoothing: null },
				{
					set(target, key, value) {
						target[key] = value;
						if (target.y !== null && target.smoothing !== null) {
							svg.innerHTML = getPath(target.y, target.smoothing, null);
						}
						return true;
					},
				}
			);

			button.style.setProperty("--duration", duration);

			svgPath.y = 20;
			svgPath.smoothing = 0;

			function getPoint(point, i, a, smoothing) {
				const cp = (current, previous, next, reverse) => {
					const p = previous || current;
					const n = next || current;
					const o = {
						length: Math.sqrt(Math.pow(n[0] - p[0], 2) + Math.pow(n[1] - p[1], 2)),
						angle: Math.atan2(n[1] - p[1], n[0] - p[0]),
					};
					const angle = o.angle + (reverse ? Math.PI : 0);
					const length = o.length * smoothing;
					return [current[0] + Math.cos(angle) * length, current[1] + Math.sin(angle) * length];
				};

				const cps = cp(a[i - 1], a[i - 2], point, false);
				const cpe = cp(point, a[i - 1], a[i + 1], true);
				return `C ${cps[0]},${cps[1]} ${cpe[0]},${cpe[1]} ${point[0]},${point[1]}`;
			}

			function getPath(update, smoothing, pointsNew) {
				const points = pointsNew
					? pointsNew
					: [
							[4, 12],
							[12, update],
							[20, 12],
					  ];
				const d = points.reduce((acc, point, i, a) => (i === 0 ? `M ${point[0]},${point[1]}` : `${acc} ${getPoint(point, i, a, smoothing)}`), "");
				return `<path d="${d}" />`;
			}

			setIsDownloading(true);

			//download certificate
			const response = await fetch(`/api/pdf?${certificateNumber}`);
			if (!response.ok) {
				throw new Error("Failed to download the PDF.");
			}

			if (response.ok) {
				setIsDownloading(false);
			}

			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			
			

			

			button.addEventListener("click", (e) => {
				e.preventDefault();
				if (!button.classList.contains("loading")) {
					button.classList.add("loading");
					const text = document.querySelector(".text");
					const D_completed = document.querySelector(".D_completed");

					gsap.to(svgPath, {
						smoothing: 0.3,
						duration: (duration * 0.065) / 1000,
					});

					gsap.to(svgPath, {
						y: 12,
						duration: (duration * 0.265) / 1000,
						delay: (duration * 0.065) / 1000,
						ease: Elastic.easeOut.config(1.12, 0.4),
					});

					setTimeout(() => {
						//download link
						const link = document.createElement("a");
						link.href = url;
						link.setAttribute("download", `pickleballcertified-authentic-${certificateNumber}.pdf`);
						document.body.appendChild(link);
						link.click();
						link.remove();
						window.URL.revokeObjectURL(url);

						//

						svg.innerHTML = getPath(0, 0, [
							[3, 14],
							[8, 19],
							[21, 6],
						]);

						gsap.to(text, {
							y: -40,
							duration: 0.6,
							ease: Power3.easeOut,
						});
						gsap.to(D_completed, {
							y: 0,
							duration: 0.6,
							ease: Power3.easeIn,
						});

						setTimeout(() => {
							button.classList.remove("loading");

							svg.innerHTML = ""; // Regenerate with your initial path

							svgPath.y = 20;
							svgPath.smoothing = 0;

							gsap.to(text, {
								y: 0,
								duration: 0.6,
								ease: Power3.easeIn,
							});
							gsap.to(D_completed, {
								y: 40,
								duration: 0.6,
								ease: Power3.easeOut,
							});
						}, 4000);
					}, duration / 2);
				}
			});
		}

		fetchPDF()
		
	}, []);

	// const handleDownload = async () => {
	// 	if (!isDownloading) {
	// 		try {
	// 			const response = await fetch(`/pdf?${certificateNumber}`);
	// 			if (!response.ok) {
	// 				throw new Error("Failed to download the PDF.");
	// 			}

	// 			if (response.ok) {
	// 				const blob = await response.blob();
	// 				const url = window.URL.createObjectURL(blob);

	// 				const link = document.createElement("a");
	// 				link.href = url;
	// 				link.setAttribute("download", `pickleballcertified-authentic-${certificateNumber}.pdf`);
	// 				document.body.appendChild(link);
	// 				link.click();
	// 				link.remove();
	// 				window.URL.revokeObjectURL(url);
	// 			}
	// 		} catch (error) {
	// 			console.error(error.message);
	// 		}
	// 	}
	// };

	return (
		<div className="container">
			<a
				className="button dark-single flex items-center cursor-pointer"
				// onClick={(e) => {
				// 	e.preventDefault();
				// 	handleDownload();
				// }}
			>
				{" "}
				<span className=" bg-[#fca91c] relative h-full pl-8 pr-4 flex items-center text-white">
					<span className={`text ${isDownloading ? "translate-y-[-40px]" : "translate-y-0"}`}>Download Your Certificate</span>
					<span className="D_completed absolute translate-y-[40px]">Download Completed</span>
					<span
						className={`D_loading absolute left-[50%] translate-x-[-50%] duration-300  ${isDownloading ? "translate-y-0" : "translate-y-[40px]"}`}
					>
						Please Wait...
					</span>
				</span>
				<div className="inner">
					<svg viewBox="0 0 24 24"></svg>
				</div>
			</a>
		</div>
	);
}

export default Button;
