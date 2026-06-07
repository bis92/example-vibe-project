"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type Step = {
  label: string;
  detail: string;
  tooltip: string;
};

const STEPS: Step[] = [
  {
    label: "1. 프롬프트",
    detail: "사용자가 자연어로 의도 전달",
    tooltip:
      "사용자가 터미널에서 자연어로 작업 의도를 입력합니다. 명확할수록 좋지만, 모호해도 Claude가 추가 질문을 통해 의도를 파악합니다.",
  },
  {
    label: "2. 컨텍스트 수집",
    detail: "CLAUDE.md · 파일 · 도구 출력 읽기",
    tooltip:
      "CLAUDE.md, 소스 코드, git 이력, 이전 도구 출력 등 관련 정보를 자동으로 수집합니다. 이 단계의 품질이 이후 제안의 정확도를 결정합니다.",
  },
  {
    label: "3. 변경 제안",
    detail: "diff 또는 명령 형태로 제시",
    tooltip:
      "수집된 컨텍스트를 기반으로 코드 변경(diff), 셸 명령, 또는 파일 생성을 제안합니다. Plan Mode에서는 실행 전에 전체 계획을 먼저 보여줍니다.",
  },
  {
    label: "4. 권한 요청",
    detail: "Allow / Ask / Deny 정책에 따라",
    tooltip:
      "사람이 개입할 수 있는 유일한 체크포인트입니다. 권한 설정(Allow/Ask/Deny)에 따라 자동 승인되거나 사용자 확인을 요청합니다.",
  },
  {
    label: "5. 실행",
    detail: "도구 호출 또는 파일 쓰기",
    tooltip:
      "승인된 작업을 실제로 수행합니다. 파일 읽기/쓰기, 셸 명령 실행, 외부 도구 호출 등이 이 단계에서 일어납니다.",
  },
  {
    label: "6. 결과 관찰",
    detail: "에러·테스트·로그를 다시 컨텍스트로",
    tooltip:
      "실행 결과(에러, 테스트 출력, 로그)를 관찰하고 다음 사이클의 컨텍스트로 피드백합니다. 이 루프가 닫혀야 self-correction이 가능합니다.",
  },
];

export function LoopDiagram() {
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const radius = 150;
  const cx = 200;
  const cy = 200;

  const positions = STEPS.map((_, i) => {
    const angle = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius,
    };
  });

  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeTooltip !== null) {
        setActiveTooltip(null);
      }
    },
    [activeTooltip],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [handleEsc]);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[400px_1fr]">
      <svg
        viewBox="0 0 400 400"
        className="mx-auto w-full max-w-[400px]"
        role="img"
        aria-label="에이전트 루프 다이어그램"
      >
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
          </linearGradient>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
          </marker>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#ring)"
          strokeWidth="1.5"
          strokeDasharray="6 4"
        />
        {positions.map((p, i) => {
          const next = positions[(i + 1) % positions.length];
          const midAngle =
            ((i + 0.5) / STEPS.length) * Math.PI * 2 - Math.PI / 2;
          const arcRadius = radius;
          const sx = cx + Math.cos(midAngle - 0.3) * arcRadius;
          const sy = cy + Math.sin(midAngle - 0.3) * arcRadius;
          const ex = cx + Math.cos(midAngle + 0.3) * arcRadius;
          const ey = cy + Math.sin(midAngle + 0.3) * arcRadius;
          return (
            <path
              key={`arc-${i}`}
              d={`M ${sx} ${sy} A ${arcRadius} ${arcRadius} 0 0 1 ${ex} ${ey}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              markerEnd="url(#arrow)"
              opacity="0.7"
              style={{
                ...(next ? {} : {}),
              }}
            />
          );
        })}
        {positions.map((p, i) => (
          <g key={`node-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r="28"
              fill="#11111a"
              stroke="#a855f7"
              strokeWidth="1.5"
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="#e7e7f0"
              fontSize="13"
              fontWeight="600"
            >
              {i + 1}
            </text>
          </g>
        ))}
        <text
          x={cx}
          y={cy - 8}
          textAnchor="middle"
          fill="#9897a8"
          fontSize="11"
    <div
      ref={containerRef}
      className="grid items-center gap-10 md:grid-cols-[400px_1fr]"
    >
      <div className="relative mx-auto w-full max-w-[400px]">
        <svg
          viewBox="0 0 400 400"
          className="relative z-0 w-full"
          role="img"
          aria-label="에이전트 루프 다이어그램"
        >
          <defs>
            <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.7" />
            </linearGradient>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="url(#ring)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          {positions.map((_p, i) => {
            const midAngle =
              ((i + 0.5) / STEPS.length) * Math.PI * 2 - Math.PI / 2;
            const arcRadius = radius;
            const sx = cx + Math.cos(midAngle - 0.3) * arcRadius;
            const sy = cy + Math.sin(midAngle - 0.3) * arcRadius;
            const ex = cx + Math.cos(midAngle + 0.3) * arcRadius;
            const ey = cy + Math.sin(midAngle + 0.3) * arcRadius;
            return (
              <path
                key={`arc-${i}`}
                d={`M ${sx} ${sy} A ${arcRadius} ${arcRadius} 0 0 1 ${ex} ${ey}`}
                fill="none"
                stroke="#06b6d4"
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
                opacity="0.7"
              />
            );
          })}
          {positions.map((p, i) => (
            <g
              key={`node-${i}`}
              tabIndex={0}
              role="button"
              aria-label={`${STEPS[i].label}: ${STEPS[i].detail}`}
              aria-describedby={
                activeTooltip === i ? `tooltip-${i}` : undefined
              }
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActiveTooltip(i)}
              onMouseLeave={() => setActiveTooltip(null)}
              onFocus={() => setActiveTooltip(i)}
              onBlur={() => setActiveTooltip(null)}
            >
              {/* 투명 히트 영역 — 노드 사이 빈 틈에서도 호버 유지 */}
              <circle cx={p.x} cy={p.y} r="40" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r="28"
                fill="#11111a"
                stroke={activeTooltip === i ? "#06b6d4" : "#a855f7"}
                strokeWidth={activeTooltip === i ? 2.5 : 1.5}
                className="transition-all duration-150"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fill="#e7e7f0"
                fontSize="13"
                fontWeight="600"
                pointerEvents="none"
              >
                {i + 1}
              </text>
            </g>
          ))}
          <text
            x={cx}
            y={cy - 8}
            textAnchor="middle"
            fill="#9897a8"
            fontSize="11"
          >
            Agent Loop
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fill="#e7e7f0"
            fontSize="14"
            fontWeight="600"
          >
            반복 사이클
          </text>
        </svg>

        {activeTooltip !== null && (
          <div
            id={`tooltip-${activeTooltip}`}
            role="tooltip"
            className="pointer-events-none absolute z-50 w-64 rounded-lg border border-[var(--color-border)] bg-[#1a1a2e] p-4 shadow-xl"
            style={{
              left: `${(positions[activeTooltip].x / 400) * 100}%`,
              top: `${(positions[activeTooltip].y / 400) * 100}%`,
              transform:
                positions[activeTooltip].y < cy
                  ? "translate(-50%, -100%) translateY(-12px)"
                  : "translate(-50%, 12px)",
            }}
          >
            <p className="mb-1 text-sm font-semibold text-[var(--color-fg)]">
              {STEPS[activeTooltip].label}
            </p>
            <p className="text-xs leading-relaxed text-[var(--color-muted)]">
              {STEPS[activeTooltip].tooltip}
            </p>
          </div>
        )}
      </div>

      <ol className="space-y-3">
        {STEPS.map((step) => (
          <li key={step.label} className="surface px-4 py-3">
            <p className="text-sm font-semibold">{step.label}</p>
            <p className="text-xs text-[var(--color-muted)]">{step.detail}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
