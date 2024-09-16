import Navbar from '@/modules/admin/layout/components/Navbar';
import Sidebar from '@/modules/admin/layout/components/Sidebar';


interface AdminLayoutProps {
  children: React.ReactNode;
}

 function AdminLayout({ children }: AdminLayoutProps): JSX.Element {
  return (
    <div className="admin-layout">
      <Navbar />
      <div className="admin-sidebar">
        <Sidebar />
        <main className="pl-[300px] pt-[50px] pr-[50px]">{children}</main>
      </div>
    </div>
  );
} 
export default AdminLayout ;