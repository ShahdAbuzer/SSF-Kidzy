import ProtectedLayout from './ProtectedLayout';
import UserLoader from './UserLoader';

export default function Layout({ children }) {
  return <><UserLoader/> <ProtectedLayout>{children}</ProtectedLayout></> 
  
  ;
}
