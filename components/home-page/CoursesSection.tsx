'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpenIcon, CalendarIcon, BanknoteIcon } from 'lucide-react';
import { Course, getCourseTypeDisplayName, decodeHtmlEntities } from '@/lib/wordpress';

interface CoursesSectionProps {
  courses: Course[];
}

export const CoursesSection = ({ courses }: CoursesSectionProps) => {
  // Helper to clean excerpt (strip HTML tags and decode entities)
  const cleanExcerpt = (text: string | null | undefined, maxLength: number = 100): string => {
    if (!text) return '';
    const decoded = decodeHtmlEntities(text);
    const plainText = decoded.replace(/<[^>]*>/g, '');
    const cleaned = plainText.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength) + '...';
  };

  // Helper to get the first category name
  const getCategoryName = (course: Course): string => {
    if (course.courseCategories?.nodes?.length > 0) {
      return course.courseCategories.nodes[0].name;
    }
    return getCourseTypeDisplayName(course.courseDetails?.courseType || []);
  };

  if (courses.length === 0) {
    return null;
  }

  return (
    <section id="courses" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-primary mb-2">
            Our Popular Courses
          </h2>
          <p className="text-gray-600">
            Accredited, hands-on, and values-based learning.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => {
            const featuredImage = course.featuredImage?.node?.sourceUrl || null;
            const category = getCategoryName(course);
            
            // Clean the excerpt
            const cleanedExcerpt = cleanExcerpt(course.excerpt) || 
              cleanExcerpt(course.courseDetails?.careerPathways, 100) || 
              'Professional course designed for career success';

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-gray-100 shadow-md overflow-hidden group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-48 w-full">
                  {featuredImage ? (
                    <Image
                      src={featuredImage}
                      alt={course.title}
                      fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-purple-100 flex items-center justify-center">
                      <BookOpenIcon className="w-12 h-12 text-primary/60" aria-hidden="true" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-orange-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-playfair text-xl font-bold text-primary mb-2 line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {cleanedExcerpt}
                  </p>
                  {course.courseDetails?.duration && (
                    <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <CalendarIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      Duration: {course.courseDetails.duration}
                    </p>
                  )}
                  {course.courseDetails?.fee && (
                    <p className="flex items-center gap-2 text-sm text-orange-700 font-semibold mb-3">
                      <BanknoteIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      {course.courseDetails.fee}
                    </p>
                  )}
                  <Link
                    href={`/courses/${course.slug}`}
                    className="mt-auto self-start bg-accent text-white hover:bg-accent/90 px-6 py-2 rounded-full font-medium transition-colors text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {/* View More Link */}
        <div className="text-center mt-8">
          <Link
            href="/courses"
            className="text-primary font-medium hover:underline"
          >
            View More Courses &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};