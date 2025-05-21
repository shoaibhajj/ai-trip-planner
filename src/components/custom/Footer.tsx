"use client";
import { BookText } from "lucide-react";

const contacts = [
  {
    id: "0",
    title: "Email",
    iconUrl: "/contact/email.svg",
    url: "mailto:shoaibhajhussen@gmail.com",
  },

  {
    id: "1",
    title: "linkedin",
    iconUrl: "/contact/linkedin.svg",
    url: "https://www.linkedin.com/in/shoaib-haj-hussen",
  },

  {
    id: "2",
    title: "github",
    iconUrl: "/contact/github.svg",
    url: "https://github.com/shoaibhajj",
  },
  {
    id: "3",
    title: "telegram",
    iconUrl: "/contact/telegram.svg",
    url: "https://t.me/Shoaib_hajj",
  },
  {
    id: "4",
    title: "whatsapp",
    iconUrl: "/contact/whatsapp.svg",
    url: "https://wa.me/963991420513",
  },
];

function Footer() {
  return (
    <section className="mt-50 py-5 lg:py-5 xl:py-5   border-t overflow-visible">
      <div className="font-semibold mb-5 text-xl  md:text-2xl text-center md:text-nowrap text-primary">
        Please Note that all images here is Fake until now, but when you click
        on it takes you to the real image on google app
      </div>
      <div className="container max-w-7xl flex flex-row  md:flex-col w-full  h-full justify-center items-center">
        <div className="flex flex-col md:flex-row  justify-between items-center w-full">
          {
            <p className="mx-5 mb-5 md:mb-0 body-1 text-gray-600 text-nowrap  dark:text-gray-400">
              © 2025 <span className="text-primary text-xl"> Shoaib Hajj</span>.
              All rights reserved.
            </p>
          }
          <ul className="flex gap-5 flex-row  flex-wrap mx-auto justify-center md:my-0  md:justify-end items-center w-full px-5 ">
            {contacts.map((item) => (
              <a
                href={item.url}
                key={item.id}
                target="_blank"
                className="flex items-center justify-center w-10  h-10 text-white bg-primary rounded-full transition-colors hover:bg-n-5 "
              >
                <img
                  src={item.iconUrl}
                  width={20}
                  height={20}
                  alt={item.title}
                  color="#ffffff"
                  className="text-white"
                  style={{
                    color: "#ffffff",
                  }}
                />
              </a>
            ))}
            <a
              href="/resume.pdf"
              download="Shoaib Hajj.pdf"
              className="flex items-center justify-center w-10  h-10 bg-primary text-white rounded-full transition-colors hover:bg-n-5 "
            >
              <BookText width={20} height={20} />
            </a>
          </ul>
          {/* {
            <p className="body-1 text-gray-600 text-nowrap my-10  dark:text-gray-400">
              © 2025 Shoaib Hajj. All rights reserved.
            </p>
          } */}
        </div>
      </div>
    </section>
  );
}

export default Footer;
