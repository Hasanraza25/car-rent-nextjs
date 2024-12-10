import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="md:bg-white">
      <div className="mx-auto max-w-[1600px] flex flex-wrap justify-between px-4 py-20 md:border-b">
        <div className="flex-shrink-0 w-full lg:w-auto mb-10 lg:mb-0">
          <Link href="/">
            <div className="text-[#3563E9] text-4xl font-semibold">MORENT</div>
          </Link>
          <p className="mt-10 text-[#90A3BF] w-full lg:w-[20rem] sm:pe-14 text-[1rem]">
            Our vision is to provide convenience and help increase your sales
            business.
          </p>
        </div>

        <div className="flex flex-wrap justify-between lg:justify-end w-full lg:w-auto md:-mr-52">
          <div className="flex flex-col w-full sm:w-[45%] md:w-[20rem] mb-10 md:mb-0">
            <h2 className="text-xl font-semibold">About</h2>
            <ul className="mt-10 space-y-7 text-[#90A3BF]">
              <li>How it works</li>
              <li>Featured</li>
              <li>Partnership</li>
              <li>Business Relation</li>
            </ul>
          </div>

          <div className="flex flex-col w-full sm:w-[45%] md:w-[20rem] mb-10 md:mb-0">
            <h2 className="text-xl font-semibold">Community</h2>
            <ul className="mt-10 space-y-7 text-[#90A3BF]">
              <li>Events</li>
              <li>Blog</li>
              <li>Podcast</li>
              <li>Invite a friend</li>
            </ul>
          </div>

          <div className="flex flex-col w-full sm:w-[45%] md:w-[20rem]">
            <h2 className="text-xl font-semibold">Socials</h2>
            <ul className="mt-10 space-y-7 text-[#90A3BF]">
              <li>Discord</li>
              <li>Instagram</li>
              <li>Twitter</li>
              <li>Facebook</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] flex flex-wrap items-center justify-between px-4 md:py-10 sm:pb-10 sm:flex-col-reverse">
        <span className="text-[#90A3BF] text-sm w-full lg:w-auto text-center lg:text-left sm:mt-5">
          ©2022 MORENT. All rights reserved
        </span>

        <div className="flex space-x-6 mt-4 lg:mt-0 w-full lg:w-auto justify-center lg:justify-end">
          <a href="#">Terms & Condition</a>
          <a href="#" className="">
            Privacy & Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
