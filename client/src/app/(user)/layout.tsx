import Footer from "@/modules/user/layout/components/Footer";
import Header from "@/modules/user/layout/components/Header";
import GoogleOAuthProviderWrapper from "@/providers/GoogleAuthProviderWrapper";
import RecoilProvider from "@/providers/RecoilProvider";
import ModalManager from "@/modules/user/layout/components/ModalManager";


interface LayoutProps {
  children: React.ReactNode;
}

 function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div >
      <Header/>
        <main>{children}</main>
      <Footer/>
    </div>
  );
} 
export default Layout ;