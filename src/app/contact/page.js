import ContactForm from "@/components/Contact/ContactForm";
import React from "react";

function page() {
	return (
		<div>
			<div className="g__mobile-container  text-center mt-[60px]">
				<h1 className="text-[#212222]">Contact Us</h1>
				<p className="pt-5 pb-10">Questions or Concerns, contact us via the form below</p>
			</div>
            <ContactForm />
		</div>
	);
}

export default page;
