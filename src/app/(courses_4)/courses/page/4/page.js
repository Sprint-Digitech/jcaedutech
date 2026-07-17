
"use client";
import dynamic from 'next/dynamic';

const CoursesPage4Component = dynamic(() => import('./CoursesPage4Component'), {
  ssr: false,
});

export default function Page() {
  return <CoursesPage4Component />;
}
