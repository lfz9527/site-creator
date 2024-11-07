import { Button, Space } from "antd";

const Header = () => {
  // 保存页面
  const savePage = () => {};

  // 预览页面
  const previewPage = () => {};

  return (
    <div className="w-[100%] h-[100%]">
      <div className="flex flex-row-reverse px-[24px] items-center h-[50px]">
        <Space className="flex-1 flex justify-end">
          <Button size="middle" type="primary" onClick={previewPage}>
            预览
          </Button>
          <Button onClick={savePage} size="middle" type="primary">
            保存
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Header;
