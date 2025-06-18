import { Merriweather, Merriweather_Sans } from "next/font/google";
import { Alexandria } from "next/font/google";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["500"],
});

const merriweather = Merriweather({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather-sans",
});

export { merriweather, merriweatherSans, alexandria };
