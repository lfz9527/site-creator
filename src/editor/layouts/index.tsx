import React, { useRef, useEffect, useState } from "react";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

import { ComponentConfig } from "@/editor/interface";
import { useComponentConfigStore } from "@/editor/stores";

import { Spin } from "antd";
import Header from "./header";
import Material from "./material";
import Setting from "./setting";
import Stage from "./stage";

const Layout: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const componentConfigRef = useRef<any>({});
  const { setComponentConfig } = useComponentConfigStore();

  useEffect(() => {
    loadComponentConfig();
  }, []);

  // 注册组件
  const registerComponent = (
    name: string,
    componentConfig: ComponentConfig
  ) => {
    componentConfigRef.current[name] = componentConfig;
  };

  // 加载组件配置
  const loadComponentConfig = async () => {
    // 加载组件配置模块代码
    const modules = import.meta.glob("../components/*/register.ts", {
      eager: true,
    });

    const tasks = Object.values(modules).map((module: any) => {
      if (module?.default) {
        // 执行组件配置里的方法，把注册组件方法传进去
        return module.default({ registerComponent });
      }
    });

    // 等待所有组件配置加载完成
    await Promise.all(tasks);
    // 注册组件到全局
    setComponentConfig(componentConfigRef.current);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-[300px]">
        <Spin />
      </div>
    );
  }

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
