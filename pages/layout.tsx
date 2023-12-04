import Footer from "./component/FootComponent";
import Header from "./component/HeadComponent";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col ">
      {/* <header className="sticky top-0 z-50">
        <Header />
      </header> */}

      <main className="relative">{children}</main>

      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
