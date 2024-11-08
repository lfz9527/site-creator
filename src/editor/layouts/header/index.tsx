import { Button, Space } from "antd";

const Header = () => {
  // 保存页面
  const savePage = () => {};

  // 预览页面
  const previewPage = () => {};

  return (
    <div className="w-[100%] h-[100%] bg-white ">
      <div className="flex flex-row-reverse px-[24px] py-[6px] items-center">
        <Space className="flex-1 flex justify-end">
          <Button size="small"className="text-xs"  type="primary" onClick={previewPage}>
            预览
          </Button>
          <Button onClick={savePage} size="small" className="text-xs" type="primary">
            保存
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default Header;
