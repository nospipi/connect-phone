import Image from "next/image"
import logo from "@/public/logo.png"
import PulsingRingProvider from "@/app/providers/PulsingRingProvider.client"

//---------------------------------------------------------

const Loading = () => {
  return (
    <div className="flex h-full justify-center">
      <PulsingRingProvider color="blue" ringCount={3} size={2} speed={3}>
        <Image
          src={logo}
          alt="logo"
          width={30}
          height={30}
          className="transition-all duration-200 dark:invert"
        />
      </PulsingRingProvider>
    </div>
  )
}

export default Loading
