import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
    return (
        <div style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar />
            <div style={{ flex: 1 }}>
                <Header />
                <div style={{ marginTop: "60px", padding: "1rem" }}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default ProtectedLayout;