"use client";
import { Document, Page, Text, View, Image, StyleSheet, Font, renderToStream } from "@react-pdf/renderer";

// Register fonts
// Font.register({
// 	family: "Barlow",
// 	src: "https://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3b8pddoU.woff2",
// });

// Font.register({
// 	family: "Roboto",
// 	src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5WZLCzYlKw.woff2",
// });

// Define styles
const styles = StyleSheet.create({
	container: {
		maxWidth: 850,
		margin: "0 auto",
		padding: 10,
		backgroundColor: "#fff",
		backgroundImage: "url('/certificates.png')",
		backgroundRepeat: "no-repeat",
		backgroundSize: "100% 100%",
		backgroundPosition: "center",
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
		// fontFamily: "Barlow",
		marginTop: 4,
	},
	serialNumber: {
		fontSize: 18,
		fontWeight: 400,
		// fontFamily: 'Roboto',
		display: "flex",
		alignItems: "center",
		gap: 10,
	},
	section: {
		marginTop: 8,
		paddingBottom: 350,
	},
	item: {
		marginBottom: 8,
	},
	label: {
		fontSize: 18,
		fontWeight: 600,
		color: "#212222",
		// fontFamily: "Barlow",
	},
	text: {
		fontSize: 14,
		fontWeight: 400,
		color: "#262626",
		// fontFamily: 'Roboto',
		marginTop: 2,
	},
	imageContainer: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginTop: 3,
	},
	profileImage: {
		height: 60,
		width: 60,
		borderRadius: "50%",
	},
	profileDetails: {
		maxWidth: 200,
	},
	name: {
		fontSize: 16,
		fontWeight: 500,
		color: "#262626",
		// fontFamily: 'Roboto',
	},
	profession: {
		fontSize: 12,
		color: "#262626",
		// fontFamily: 'Roboto',
	},
});

const PdfTemplet = ({ post }) => {
	const date = (dateStr) => {

		const date = new Date(dateStr);

		if (isNaN(date.getTime())) {
			return "Invalid Date"; // Handle invalid dates
		}

		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();

		return `${month}/${day}/${year}`; // MM/DD/YYYY format
	};

	return (
		<Document>
			<Page size="A4" style={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Image src="/certificatelogo.png" style={{ width: 270, height: 46 }} />
					<Text style={styles.title}>
						Serial Number - <Text style={styles.serialNumber}>{post?.certificate_number}</Text>
					</Text>
				</View>

				{/* Content */}
				<View style={styles.section}>
					{/* Item Description */}
					<View style={styles.item}>
						<Text style={styles.label}>Item Description</Text>
						<Text style={styles.text}>{post?.item_description}</Text>
					</View>

					{/* Match Used */}
					<View style={styles.item}>
						<Text style={styles.label}>Match Used -</Text>
						<Text style={styles.text}>{post?.match_used}</Text>
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
						<Text style={styles.label}>Date Signed -</Text>
						<Text style={styles.text}>{date(post?.signed_date)}</Text>
					</View>

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
			</Page>
		</Document>
	);
};

export default PdfTemplet;
