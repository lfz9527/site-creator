import { Allotment } from "allotment";
import "allotment/dist/style.css";

import React from "react";
import Header from "./header";
import Material from "./material";
import Setting from "./setting";
import Stage from "./stage";

const Layout: React.FC = () => {
  return (
    <div className="h-[100vh] flex flex-col">
      <div className="h-[60px] flex items-center border-solid border-b-[1px] border-[#ccc]">
        <Header />
      </div>
      <Allotment>
        <Allotment.Pane preferredSize={200} maxSize={400} minSize={200}>
          <Material />
        </Allotment.Pane>
        <Allotment.Pane>
          <Stage />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={200} maxSize={400} minSize={200}>
          <Setting />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
};

export default Layout;
