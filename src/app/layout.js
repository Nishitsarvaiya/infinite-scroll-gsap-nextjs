import "./globals.css";
import { Montserrat } from "next/font/google";

const font = Montserrat({ subsets: ["latin"] });

export const metadata = {
	title: "Infinite Scroll of Finite Items | GSAP | NEXTJS | NISHIT SARVAIYA",
	description: "Inifinite Scrolling of Finite items in Nextjs using gsap.",
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<body className={font.className}>{children}</body>
		</html>
	);
}
