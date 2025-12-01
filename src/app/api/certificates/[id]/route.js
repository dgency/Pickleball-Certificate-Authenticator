import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	const { id } = params;

	try {
		const response = await fetch(`https://certificate.thepickleballscoreboard.com/wp-json/cac/v1/certificates/${id}`, {
			cache: "no-cache",
		});

		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch certificate" }, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		return NextResponse.json({ error: "An error occurred" }, { status: 500 });
	}
}
