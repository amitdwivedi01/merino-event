'use client';
// import { cookies } from 'next/headers';
import Brochure from './Brochure';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

const Layout = ({ children }) => {
  const Router = useRouter();

  // if (!cookies().has('user')) {
  //   return redirect('/login');
  // }
  let userId;
  if (typeof window !== 'undefined') {
    try {
      let userID = localStorage.getItem('user');
      userID = JSON.parse(userID);
      if (!userID?._id) {
        Router.push('/login');
      }
    } catch (error) {
      console.log('error while fetching user from localstorage: ', error);
    }
  }
  return (
    <div>
      {/* <div className="absolute z-20 w-full">
        <Header />
      </div> */}
      {/* <Brochure /> */}
      {children}
    </div>
  );
};
export default Layout;
