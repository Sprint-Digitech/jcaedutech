
"use client";
import dynamic from 'next/dynamic';

const CoursesPage2Component = dynamic(() => import('./CoursesPage2Component'), {
  ssr: false,
});

export default function Page() {
  return <CoursesPage2Component />;
}
