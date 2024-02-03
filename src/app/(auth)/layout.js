import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function RootLayout({ children }) {
  // if (cookies().has('user')) {
  //   return redirect('/');
  // }
  return (
    <>
      <div className="bg-hero-home w-[100vw] h-[100vh] bg-no-repeat bg-cover">
        <div className="backdrop-brightness-50 backdrop-contrast-100 min-h-screen grid place-items-center">
          {children}
        </div>
      </div>
    </>
  );
}
