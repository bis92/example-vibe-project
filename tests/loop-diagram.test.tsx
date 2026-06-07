import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LoopDiagram } from "@/components/LoopDiagram";

describe("LoopDiagram 툴팁", () => {
  it("6개의 노드 버튼이 렌더링된다", () => {
    render(<LoopDiagram />);
    const nodes = screen.getAllByRole("button");
    expect(nodes).toHaveLength(6);
  });

  it("초기 상태에서 툴팁이 표시되지 않는다", () => {
    render(<LoopDiagram />);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("노드에 마우스 호버 시 툴팁이 표시된다", () => {
    render(<LoopDiagram />);
    const firstNode = screen.getAllByRole("button")[0];

    fireEvent.mouseEnter(firstNode);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip).toBeDefined();
    expect(tooltip.textContent).toContain("1. 프롬프트");
  });

  it("마우스가 노드를 떠나면 툴팁이 사라진다", () => {
    render(<LoopDiagram />);
    const firstNode = screen.getAllByRole("button")[0];

    fireEvent.mouseEnter(firstNode);
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.mouseLeave(firstNode);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("Tab 키로 노드에 포커스하면 툴팁이 표시된다", () => {
    render(<LoopDiagram />);
    const secondNode = screen.getAllByRole("button")[1];

    fireEvent.focus(secondNode);

    const tooltip = screen.getByRole("tooltip");
    expect(tooltip.textContent).toContain("2. 컨텍스트 수집");
  });

  it("포커스가 벗어나면 툴팁이 사라진다", () => {
    render(<LoopDiagram />);
    const secondNode = screen.getAllByRole("button")[1];

    fireEvent.focus(secondNode);
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.blur(secondNode);
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("ESC 키를 누르면 툴팁이 닫힌다", () => {
    render(<LoopDiagram />);
    const thirdNode = screen.getAllByRole("button")[2];

    fireEvent.mouseEnter(thirdNode);
    expect(screen.getByRole("tooltip")).toBeDefined();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("각 노드 호버 시 해당 단계의 툴팁 내용이 표시된다", () => {
    render(<LoopDiagram />);
    const nodes = screen.getAllByRole("button");

    const expectedLabels = [
      "1. 프롬프트",
      "2. 컨텍스트 수집",
      "3. 변경 제안",
      "4. 권한 요청",
      "5. 실행",
      "6. 결과 관찰",
    ];

    nodes.forEach((node, i) => {
      fireEvent.mouseEnter(node);
      const tooltip = screen.getByRole("tooltip");
      expect(tooltip.textContent).toContain(expectedLabels[i]);
      fireEvent.mouseLeave(node);
    });
  });

  it("노드에 접근성 속성(aria-label, aria-describedby)이 설정된다", () => {
    render(<LoopDiagram />);
    const firstNode = screen.getAllByRole("button")[0];

    expect(firstNode.getAttribute("aria-label")).toContain("1. 프롬프트");

    fireEvent.mouseEnter(firstNode);
    expect(firstNode.getAttribute("aria-describedby")).toBe("tooltip-0");
  });
});
