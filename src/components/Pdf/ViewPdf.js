"use client";
import { PDFDownloadLink, PDFViewer, renderToStream } from "@react-pdf/renderer";
import PdfTemplet from "./PdfTemplet";
import { useEffect, useState } from "react";




function ViewPdf() {
	const [isClient, setIsClient] = useState(false);
    const [logoBase64, setLogoBase64] = useState(null);



	useEffect(() => {
		setIsClient(true);
	},[]);

    

	return isClient? (
		// <PDFDownloadLink document={<PdfTemplet post={post} certificatelogo={logoBase64} />} fileName="certificate.pdf">
		// 	{({ blob, url, loading, error }) => (loading ? "Loading document..." : "Download now!")}
		// </PDFDownloadLink>
        // <PDFViewer style={{width:'100%', height:'500px'}}  >
        //     <PdfTemplet post={post} />
        // </PDFViewer>
        <>
        {/* <PdfTemplet post={post}  /> */}
        
        
        </>
	):<div>Loading.......</div>;
}

export default ViewPdf;
