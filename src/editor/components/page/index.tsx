import { useEffect, useState } from "react";
import { useDrop } from "@/editor/hooks";
import { CommonComponentProps } from "@editor/interface";
import { observeContainer } from "@editor/utils";

const Page: React.FC<CommonComponentProps> = (props) => {
  const { children, _id, _name } = props;
  const { drop, canDrop } = useDrop(_id, _name);
  const [style, setStyle] = useState({
    width: "100%",
    height: "100%",
  });

  useEffect(() => {
    const { resizeObserver, container } = observeContainer(
      (container) => {
        const { width } = container.getBoundingClientRect();
        setStyle((st) => ({ ...st, width: width + "px" }));
      },
      { containerId: "stage-container" }
    );
    return () => {
      if (container) {
        resizeObserver.unobserve(container);
      }
    };
  }, []);

  return (
    <div
      ref={drop}
      static-type="root-page"
      style={{
        ...style,
        transition: "width 0.1s ease",
        border: canDrop ? "1px solid #006cff" : "none",
      }}
      data-component-id={_id}
    >
      {children}
    </div>
  );
};

export default Page;
