import Image from "next/image"

const HeroSection = () => {
  return (
    <div className="relative h-screen flex items-center justify-center">
      <Image
        src="/hero-background.jpeg"
        alt="Colorful abstract background"
        layout="fill"
        objectFit="cover"
        quality={100}
        priority
      />
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">Welcome to RenderPro</h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-8">Experience lightning-fast rendering for your projects</p>
        <button className="bg-lime hover:bg-darklime hover:text-black text-black font-bold py-2 px-4 rounded-full transition duration-300 text-sm sm:text-base">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default HeroSection

