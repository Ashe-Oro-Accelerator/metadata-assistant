interface RootLayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: RootLayoutProps) => {
  return <div>{children}</div>;
};
