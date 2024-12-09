import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="py-6 bg-white border-b">
      <div className="mx-auto max-w-[1700px] px-4 flex items-center justify-between md:flex-row flex-col">
        <div className="w-full flex items-center justify-between md:hidden mb-4">
          {/* Logo */}
          <Link href="/">
            <div className="text-[#3563E9] text-4xl font-semibold">MORENT</div>
          </Link>

          {/* Profile Icon */}
          <Image
            src="/images/profile.svg"
            alt="Profile Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>

        <div className="w-full flex items-center justify-between md:justify-start">
          {/* Logo for Laptop */}
          <Link href="/">
            <div className="hidden md:block text-[#3563E9] text-4xl font-semibold">
              MORENT
            </div>
          </Link>

          {/* Search Field */}
          <div className="relative w-full lg:w-[550px] md:w-[350px] ml-0 lg:ml-28 md:ml-10 flex items-center sm:mt-5">
            {/* Search Icon */}
            <div className="absolute top-0 left-5 flex items-center h-full text-gray-500">
              <Image
                src="/images/search-icon.svg"
                alt="Search Logo"
                width={25}
                height={25}
              />
            </div>

            {/* Input Field */}
            <input
              type="text"
              placeholder="Search something here"
              className="w-full h-12 pl-16 pr-10 rounded-full sm:rounded-xl sm:text-sm sm:pr-0 py-8 bg-white text-[#596780] border focus:outline-none tracking-wider font-[500]"
            />
            <div className="sm:hidden absolute flex items-center right-5">
              <Image
                src="/images/volume-icon.svg"
                alt="Volume Logo"
                width={25}
                height={25}
              />
            </div>
          </div>

          {/* Volume Icon for Mobile */}
          <div className="md:hidden flex items-center ml-4 border p-4 rounded-xl sm:mt-5">
            <Image
              src="/images/volume-icon.svg"
              alt="Volume Logo"
              width={35}
              height={35}
            />
          </div>
        </div>

        <div className="hidden md:flex space-x-3">
          {/* Heart Icon */}
          <div className="p-3 border border-gray-300 rounded-full flex items-center justify-center">
            <Image
              src="/images/heart.svg"
              alt="Heart Logo"
              width={35}
              height={30}
            />
          </div>

          {/* Notification Icon with Badge */}
          <div className="relative">
            <div className="p-3 border border-gray-300 rounded-full flex items-center justify-center">
              <Image
                src="/images/notification.svg"
                alt="Notification Logo"
                width={40}
                height={40}
              />
            </div>
            {/* Red Circle */}
            <div className="absolute top-0 right-0 w-[0.9rem] h-[0.9rem] bg-red-500 rounded-full border border-white"></div>
          </div>

          {/* Settings Icon */}
          <div className="border border-gray-300 rounded-full flex items-center justify-center w-[4.3rem]">
            <Image
              src="/images/setting.svg"
              alt="Setting Logo"
              width={30}
              height={30}
            />
          </div>

          <Image
            src="/images/profile.svg"
            alt="Profile Logo"
            width={60}
            height={60}
            className="rounded-full"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
