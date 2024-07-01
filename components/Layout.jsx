import styles from "../styles/Home.module.scss";
import Logo from "./Logo";
import { useSession, signIn, signOut } from "next-auth/react";

import Nav from "./Nav";
import { useState } from "react";

const Layout = ({ children }) => {
  const [showNav, setShowNav] = useState(false);
  const { data: session } = useSession();
  if (!session) {
    return (
      <>
        <div className={styles.main}>
          <div className={styles.main__box}>
            <button
              onClick={() => signIn("google")}
              className={styles.main__btn}
            >
              Zaloguj do Google
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className={styles.main__wrapper}>
      <div className={styles.main__menu}>
        <button
          className={styles.main__burgerone}
          onClick={() => setShowNav(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={styles.main__burger}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <div className={styles.main__logo}>
          <Logo />
        </div>
      </div>

      <div className={styles.main__google}>
        <Nav show={showNav} />
        <div className={styles.main__session}>{children}</div>
      </div>
    </div>
  );
};

export default Layout;
