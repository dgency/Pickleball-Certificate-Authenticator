import React from "react";
import { Page, Text, View, Document, StyleSheet, Image, Font } from "@react-pdf/renderer";
import ReactPDF from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";

Font.register({ family: "Barlow", src: `${process.env.BASE_URL}/fonts/Barlow-Bold.ttf` });
Font.register({ family: "Roboto", src: `${process.env.BASE_URL}/fonts/Roboto-Regular.ttf` });
// Create styles
const styles = StyleSheet.create({
	wrapper: {
		position: "relative",
		height: "100%",
		width: "100%",
		objectFit: "cover",
		paddingTop: 30,
		paddingLeft: 30,
		paddingRight: 40,
	},
	backgroundImage: {
		position: "absolute", // Make the image a background
		top: 0,
		left: 0,

		width: "100%",
		height: "100%",
		zIndex: -1, // Send it to the background
	},

	header: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		marginTop: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: 700,
		fontFamily: "Barlow",
		marginTop: 10,
	},
	serialNumber: {
		fontSize: 18,
		fontWeight: 400,
		fontFamily: "Roboto",
		display: "flex",
		alignItems: "center",
		gap: 10,
	},
	section: {
		marginTop: 30,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 25,
	},
	item: {
		marginBottom: 15,
	},
	itemUnique: {
		marginBottom: 15,
		display: "flex",
		alignItems: "center",
	},
	label: {
		fontSize: 15,
		fontWeight: 600,
		color: "#212222",
		fontFamily: "Barlow",
	},
	text: {
		fontSize: 12,
		fontWeight: 400,
		color: "#565656",
		fontFamily: "Roboto",
		marginTop: 6,
		lineHeight: 1.4,
	},
	imageContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 8,
	},
	profileImage: {
		height: 40,
		width: 40,
		borderRadius: "50%",
	},
	profileDetails: {
		maxWidth: 150,
	},
	name: {
		fontSize: 12,
		fontWeight: 600,
		color: "#212222",
		fontFamily: "Roboto",
	},
	profession: {
		fontSize: 9,
		color: "#212222",
		fontFamily: "Roboto",
		marginTop: 2,
	},
	address: {
		position: "absolute",
		bottom: 22,
		left: "50%",
		transform: "translateX(-90%)",
	},
	textAddress: {
		fontSize: 12,
		fontWeight: 400,
		color: "#565656",
	},
	text_content: {
		flex: 3,
	},
	imageItemContainer: {
		flex: 2,
		marginTop: 10,
	},
	itemImage: {
		borderRadius: 15,
		height: 252,
		width: 212,
		marginBottom: 15,
	},
});

const MyDocument = ({ post }) => {
	// Format the signed date
	const signedDate = post?.signed_date ? new Date(post.signed_date) : null;
	const formattedDate = signedDate ? signedDate.toLocaleDateString("en-CA") : "";
	return (
		<Document>
			<Page size="LETTER" style={styles.container}>
				<View style={styles.wrapper}>
					<Image src={`${process.env.BASE_URL}/certificates-bg.jpg`} style={styles.backgroundImage} />
					{/* Header */}
					<View style={styles.header}>
						<Image src={`${process.env.BASE_URL}/certificatelogo.png`} style={{ width: 200, height: 46 }} />
						<Text style={styles.title}>
							Serial Number -{" "}
							<Text style={styles.serialNumber}>
								{post?.certificate_number} <Image src={`${process.env.BASE_URL}/check.png`} style={{ width: 13, height: 13, paddingTop: 4 }} />
							</Text>
						</Text>
					</View>

					{/* Content */}
					<View style={styles.section}>
						<View style={styles.text_content}>
							{/* Item Description */}
							<View style={styles.item}>
								<Text style={styles.label}>Item Description</Text>
								<Text style={styles.text}>{post?.item_description}</Text>
							</View>

							{/* Match Used */}
							<View style={styles.item}>
								<Text style={styles.label}>
									Match Used - <Text style={styles.text}>{post?.match_used}</Text>
								</Text>
							</View>

							{/* Match Details */}
							<View style={styles.item}>
								<Text style={styles.label}>Match Details</Text>
								<Text style={styles.text}>{post?.match_details}</Text>
							</View>

							{/* Item Details */}
							<View style={styles.item}>
								<Text style={styles.label}>Item Details</Text>
								<Text style={styles.text}>{post?.item_details}</Text>
							</View>

							{/* Date Signed */}
							<View style={styles.item}>
								<Text style={styles.label}>
									Date Signed - <Text style={styles.text}>{formattedDate}</Text>
								</Text>
							</View>
						</View>
						<View style={styles.imageItemContainer}>
							<Image src={post?.item_images} style={styles.itemImage} />
							{/* Signed By */}
							<View style={styles.item}>
								<Text style={styles.label}>Signed By</Text>
								<View style={styles.imageContainer}>
									<Image src={post?.signed_by_picture} style={styles.profileImage} />
									<View style={styles.profileDetails}>
										<Text style={styles.name}>{post?.signed_by_player_name}</Text>
										<Text style={styles.profession}>{post?.signed_by_profession}</Text>
									</View>
								</View>
							</View>
						</View>
					</View>

					<View style={styles.address}>
						<Text style={styles.textAddress}> pickleballcertifiedauthentic.com</Text>
					</View>
				</View>
			</Page>
		</Document>
	);
};

// const x =ReactPDF.renderToStream(<MyDocument />);

export async function GET(req, res) {
	// const stream = await renderToStream(<MyDocument/>);
	const url = new URL(req.url);

	const queryString = url.search.slice(1);
	try {
		const response = await fetch(`https://certificate.thepickleballscoreboard.com/wp-json/cac/v1/certificates/${queryString}`, {
			cache: "no-cache",
		});

		if (!response.ok) {
			return NextResponse.json({ error: "Failed to fetch certificate" }, { status: response.status });
		}

		const data = await response.json();
		

		const dynamicData = {
			title: "this is text",
		};

		const stream = await renderToStream(<MyDocument post={data} />);

		return new NextResponse(stream);
	} catch (error) {
		return new NextResponse.json({ error: "An error occurred" }, { status: 500 });
	}
}
