import { ReactNode } from 'react';
import SideMenu from './SideMenu';

/**
 * Layout component props
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component
 * Provides the main layout structure with sidebar and content area
 * @param children - Child components to render in the main content area
 */
function Layout({ children }: LayoutProps) {
  return (
    <div className="flex w-full h-screen">
      <SideMenu />
      <main className="flex-1 p-5 ml-[250px] overflow-y-auto">{children}</main>
    </div>
  );
}

export default Layout;
