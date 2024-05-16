import Sidebar from "../../components/layout/sidebar";
import Content from "../../components/layout/content";
import Footer from "../../components/layout/footer";
import { Outlet } from "react-router-dom";

import styles from "./styles.module.css";

export default function Root() {
    return (
        <div className="flex-col">
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <Content>
                    <Outlet />
                </Content>

            </div>
            <Footer />        
        </div>
        
    );
}