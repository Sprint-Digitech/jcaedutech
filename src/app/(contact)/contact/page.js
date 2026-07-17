
"use client";
import dynamic from 'next/dynamic';

const ContactComponent = dynamic(() => import('./ContactComponent'), {
  ssr: false,
});

export default function Page() {
  return <ContactComponent />;
}
