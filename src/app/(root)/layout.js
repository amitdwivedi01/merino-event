import { cookies } from 'next/headers';
import Brochure from './Brochure';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';

const Layout = ({ children }) => {
  // if (!cookies().has('user')) {
  //   return redirect('/login');
  // }
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
