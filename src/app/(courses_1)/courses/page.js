
"use client";
import dynamic from 'next/dynamic';

const CoursesComponent = dynamic(() => import('./CoursesComponent'), {
  ssr: false,
});

export default function Page() {
  return <CoursesComponent />;
}
