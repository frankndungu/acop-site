"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FaLinkedin, FaInstagram, FaYoutube, FaPlay, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { SiX } from "react-icons/si";
import Link from "next/link";
import { formatDate, getNewsTypeDisplayName, NewsArticle, decodeHtmlEntities } from "@/lib/wordpress";

interface NewsSectionProps {
  newsArticles: NewsArticle[];
}

// Helper to clean excerpt
const cleanExcerpt = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text) return '';
  const decoded = decodeHtmlEntities(text);
  const plainText = decoded.replace(/<[^>]*>/g, '');
  const cleaned = plainText.replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
};

export const NewsSection = ({ newsArticles }: NewsSectionProps) => {
  const [open, setOpen] = useState(false);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Array of images for the promo card carousel
  const promoImages = [
    { src: "https://res.cloudinary.com/kwishi/image/upload/v1794831463/ACOP/acopseptember_ddhmk7.jpg", alt: "Campus Highlights" },
    { src: "https://res.cloudinary.com/kwishi/image/upload/v1794830786/ACOP/Septemberintake2026_nl6m5g.webp", alt: "September 2026 Intake - Apply Now" },
  ];

  // Close the video modal with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [promoImages.length]);

  const nextPromoImage = () => {
    setCurrentPromoIndex((prev) => (prev + 1) % promoImages.length);
  };

  const prevPromoImage = () => {
    setCurrentPromoIndex((prev) => (prev - 1 + promoImages.length) % promoImages.length);
  };

  return (
    <section className="py-16 bg-lavender">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
            Campus Life & Highlights
          </h2>
          <p className="text-gray-600">
            Discover the stories shaping our community of professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FEATURED VIDEO CARD */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <button
              type="button"
              className="relative aspect-video w-full block cursor-pointer"
              onClick={() => setOpen(true)}
              aria-label="Play video: A glimpse into Africana's purpose-driven learning"
            >
              <Image
                src="https://res.cloudinary.com/kwishi/image/upload/v1794829070/ACOP/banner2_b8tiys.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                <div className="bg-white rounded-full p-4 shadow-lg animate-color-spread">
                  <FaPlay size={30} className="text-primary" aria-hidden="true" />
                </div>
              </div>
            </button>

            <div className="p-5 flex flex-col gap-3">
              <h3 className="font-playfair text-xl font-bold mb-1">
                A Glimpse into Africana&apos;s Purpose-Driven Learning
              </h3>
              <p className="text-sm text-gray-600">
                Experience the unique blend of faith and academic excellence that
                defines Africana College.
              </p>

              <div className="border-t border-gray-200 pt-3 flex flex-col gap-2">
                <h4 className="font-semibold">Dr. Susan Gitau</h4>
                <p className="text-sm text-gray-600">
                  Director, Africana College of Professionals
                </p>

                <div className="flex gap-4 mt-2">
                  <a
                    href="https://www.linkedin.com/in/susan-gitau-phd-7a80b0117/"
                    aria-label="Dr. Susan Gitau on LinkedIn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <FaLinkedin size={20} color="#0077B5" />
                  </a>
                  <a
                    href="https://x.com/DrSusanGitau"
                    aria-label="Dr. Susan Gitau on X"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <SiX size={20} color="#1DA1F2" />
                  </a>
                  <a
                    href="https://www.instagram.com/dr.susangitau/"
                    aria-label="Dr. Susan Gitau on Instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <FaInstagram size={20} color="#C13584" />
                  </a>
                  <a
                    href="https://www.youtube.com/@dr.susangitau662"
                    aria-label="Dr. Susan Gitau on YouTube"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <FaYoutube size={20} color="#FF0000" />
                  </a>
                </div>

                <p className="text-sm text-gray-600 mt-2">
                  Watch Dr. Susan Gitau talk about Africana College of Professionals.
                </p>

                <Link
                  href="/about"
                  className="mt-3 inline-block bg-primary text-white hover:bg-primary/90 px-5 py-2 rounded-full text-center font-medium transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>

          {/* NEWS CARDS */}
          <div className="space-y-6">
            {newsArticles.map((article) => {
              const featuredImage = article.featuredImage?.node?.sourceUrl || null;
              const newsType = getNewsTypeDisplayName(article.newsMetadata?.newsType || []);
              
              const excerpt = article.excerpt 
                ? cleanExcerpt(article.excerpt, 100)
                : cleanExcerpt(article.newsMetadata?.body || '', 100);

              return (
                <div
                  key={article.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden flex hover:shadow-lg transition-shadow"
                >
                  <div className="relative w-24 h-24 shrink-0">
                    <Image
                      src={featuredImage || "https://res.cloudinary.com/kwishi/image/upload/v1794830776/ACOP/news-og_fj1mvz.png"}
                      alt={article.title}
                      fill sizes="96px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-orange-700 uppercase">
                        {newsType}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.date)}
                      </span>
                    </div>
                    <h3 className="font-medium text-primary mb-1 line-clamp-1">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {excerpt}
                    </p>
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-xs font-medium text-accent hover:text-accent/80 mt-2 inline-block"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PROMO CARD WITH AUTO-SCROLL CAROUSEL */}
          <div className="rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 h-full relative group">
            <div className="relative w-full h-full min-h-[400px] md:min-h-[500px]">
              <Image
                src={promoImages[currentPromoIndex].src}
                alt={promoImages[currentPromoIndex].alt}
                fill sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition-opacity duration-500"
                unoptimized
                priority
              />

              {/* Whole card links to the application page */}
              <Link
                href="/get-started"
                aria-label="Apply now for the September 2026 intake"
                className="absolute inset-0 z-10"
              />

              {/* Bottom fade behind the CTA */}
              <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-accent/90 via-accent/50 to-transparent pointer-events-none" />

              {/* CTA (visual; the link above handles the click) */}
              <div className="absolute bottom-6 left-0 right-0 z-10 px-4 flex justify-center pointer-events-none">
                <span className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-sm md:text-base shadow-lg inline-flex items-center gap-2">
                  Apply Now
                  <FaChevronRight size={14} aria-hidden="true" />
                </span>
              </div>

              {/* Carousel controls sit above the link; always visible on touch,
                  revealed on hover/focus on desktop */}
              <button
                type="button"
                onClick={prevPromoImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                aria-label="Previous image"
              >
                <FaChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={nextPromoImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-opacity md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 cursor-pointer"
                aria-label="Next image"
              >
                <FaChevronRight size={18} aria-hidden="true" />
              </button>

              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {promoImages.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPromoIndex(index)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      index === currentPromoIndex ? "w-8 bg-white" : "w-2 bg-white/60 hover:bg-white"
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video"
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative bg-black rounded-xl shadow-xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 bg-gray-800 text-white rounded-full p-2 shadow-xl hover:bg-gray-700 transition z-10 cursor-pointer"
              aria-label="Close video"
            >
              ✕
            </button>

            <div className="relative pb-[56.25%]">
              <iframe
                title="Africana College of Professionals video"
                src="https://www.youtube.com/embed/63CvxPVPMTs?autoplay=1&controls=1&rel=0"
                className="absolute top-0 left-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="cursor-pointer w-full text-center bg-primary text-white py-3 font-medium hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};