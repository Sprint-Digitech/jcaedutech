
"use client";
import dynamic from 'next/dynamic';

const CoursesPage3Component = dynamic(() => import('./CoursesPage3Component'), {
  ssr: false,
});

export default function Page() {
  return <CoursesPage3Component />;
}
