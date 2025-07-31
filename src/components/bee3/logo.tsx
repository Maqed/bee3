import Image from "next/image";
import logo from "/public/logo.svg";

export function Logo() {
  return (
    <div
      dir="ltr"
      className="flex flex-row items-center justify-center gap-2 text-lg font-bold text-primary"
    >
      <Image src={logo} alt="logo" width={40} height={40} />
      <span>Bee3</span>
    </div>
  );
}

export default Logo;
