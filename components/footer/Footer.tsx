"use client";

import React, { useState, useEffect } from "react";
import {
  FacebookIcon,
  LinkedinIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const QUICK_LINKS: { label: string; href: string; external?: boolean }[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Courses", href: "/courses" },
  { label: "Admission", href: "/admission" },
  { label: "News", href: "/news" },
  { label: "Contact", href: "/contact" },
  { label: "Verify Certificate", href: "/verify" },
  { label: "Become an Author", href: "/become-an-author" },
  {
    label: "Student Portal",
    href: "https://moodle-200882-0.cloudclusters.net/",
    external: true,
  },
];

export const Footer = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close the newsletter modal with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleOpen = () => {
    setLoading(true);
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;

    const script = document.createElement("script");
    script.src = "https://js-eu1.hsforms.net/forms/embed/144428117.js";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      const check = setInterval(() => {
        const iframe = document.querySelector(".hs-form-frame iframe");
        if (iframe) {
          setLoading(false);
          clearInterval(check);
        }
      }, 200);
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [open]);

  return (
    <>
      {/* ================= FOOTER ================= */}
      <footer className="bg-primary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand */}
            <div>
              <h3 className="font-playfair text-xl font-bold mb-4">
                Africana College
              </h3>
              <p className="text-white/80 mb-4">
                Transforming lives through faith-based education and professional excellence.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/acop"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Africana College on Facebook"
                  className="text-white hover:text-accent transition-colors"
                >
                  <FacebookIcon size={20} aria-hidden="true" />
                </a>
                <a
                  href="https://www.linkedin.com/company/africana-college"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Africana College on LinkedIn"
                  className="text-white hover:text-accent transition-colors"
                >
                  <LinkedinIcon size={20} aria-hidden="true" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <nav aria-label="Footer">
              <h3 className="font-playfair text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-white/80 hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact */}
            <div>
              <h3 className="font-playfair text-xl font-bold mb-4">Contact Info</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPinIcon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span className="text-white/80">Kianjau House 4th Floor, Thika</span>
                </li>
                <li className="flex items-start gap-3">
                  <PhoneIcon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <a href="tel:+254756234165" className="text-white/80 hover:text-accent transition-colors">
                    +254 756 234165
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MailIcon size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <a href="mailto:info@acop.co.ke" className="text-white/80 hover:text-accent transition-colors">
                    info@acop.co.ke
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-playfair text-xl font-bold mb-4">Newsletter</h3>
              <p className="text-white/80 mb-4">
                Subscribe to receive updates on new courses and events.
              </p>
              <button
                onClick={handleOpen}
                className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-full font-medium w-full cursor-pointer transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>

          <div className="border-t border-white/20 mt-12 pt-6 text-center text-white/80 text-sm">
            © {new Date().getFullYear()} Africana College of Professionals – Educating in Truth and Light.
          </div> 
        </div>
      </footer>

      {/* ================= MODAL ================= */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Subscribe to our newsletter"
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
            
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <XIcon size={16} aria-hidden="true" />
            </button>

            {/* Modal Image */}
            <div className="w-full h-40 relative mb-4 rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://res.cloudinary.com/kwishi/image/upload/v1794830776/ACOP/newsletter_hhxij3.jpg"
                alt=""
                fill sizes="448px"
                className="object-cover"
              />
            </div>

            {/* Loading Spinner */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* HubSpot Form */}
            <div
              className={`hs-form-frame transition-all duration-300 ${
                loading ? "opacity-0" : "opacity-100"
              }`}
              data-region="eu1"
              data-form-id="0eb22cc9-fe0e-47ea-b629-64b41b9db2b2"
              data-portal-id="144428117"
            ></div>
          </div>
        </div>
      )}
    </>
  );
};