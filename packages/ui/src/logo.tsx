import Image from "next/image";
import logo from "./assets/logo.png";

interface LogoProps {
  className?: string;
  styles?: JSX.IntrinsicElements["img"]["style"];
  alt?: string;
}

export function Logo({ alt = "Logo" , ...props }: LogoProps) {
  return <Image src={logo} alt={alt} {...props} />;
}

