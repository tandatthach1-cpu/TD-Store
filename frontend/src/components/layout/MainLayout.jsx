import Header from './Header';
import Footer from './Footer';
import NotificationCenter from './NotificationCenter';
import SupportChatWidget from './SupportChatWidget';

const MainLayout = ({ children }) => {
  return (
    <>
      <Header />
      <NotificationCenter />
      <main>{children}</main>
      <Footer />
      <SupportChatWidget />
    </>
  );
};

export default MainLayout;
