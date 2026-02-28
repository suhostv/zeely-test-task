import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from "./Sidebar";

const App = () => {
  return (
    <SidebarProvider
      defaultOpen={false}
      className="justify-center items-center"
    >
      <Sidebar />
    </SidebarProvider>
  );
};

export default App;
