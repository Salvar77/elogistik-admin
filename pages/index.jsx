import Layout from "@/components/Layout";
import classes from "../styles/Index.module.scss";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className={classes.index}>
        <h2>
          Hey, Hi, Hello <b>{session?.user?.email}</b>
        </h2>

        <div className={classes.indexBox}>
          <img
            src={session?.user?.image}
            alt=""
            className={classes.index__img}
          ></img>
          <span className={classes.index__span}> {session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
