
"use client";
import dynamic from 'next/dynamic';

const AboutUsComponent = dynamic(() => import('./AboutUsComponent'), {
  ssr: false,
});

export default function Page() {
  return <AboutUsComponent />;
}
