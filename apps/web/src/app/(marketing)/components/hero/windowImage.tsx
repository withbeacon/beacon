import Image from "next/image";

import appWindow from "~/assets/window.png";
import shadow from "~/assets/shadow.svg";
import doodle from "~/assets/doodle.svg";

export default function WindowImage() {
  return (
    <div className="relative h-full w-full px-8 max-w-md md:max-w-2xl lg:max-w-6xl select-none flex items-center mt-10 mb-14 mx-auto">
      <Image
        src={appWindow}
        alt="Beacon App"
        className="z-10"
      />
      <Image
        src={doodle}
        alt="Beacon App Doodle"
        className="absolute inset-x-2 -inset-y-6 z-20 h-8 w-8 invert-0 hidden md:block"
      />
      <Image
        src={shadow}
        alt="Beacon App Shadow"
        className="absolute inset-y-0 inset-x-8 z-0 opacity-80 blur-xl hidden lg:block"
      />
    </div>
  );
}
