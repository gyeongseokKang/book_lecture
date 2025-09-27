// SearchDemo - useTransition 없이 느린 업데이트 예시
import React, { useMemo, useState } from "react";

function makeItems(n: number) {
  return Array.from(
    { length: n },
    (_, i) => `item ${i} - ${Math.random().toString(16).slice(2)}`
  );
}
const ALL = makeItems(30000);

function heavyFilter(items: string[], q: string) {
  // 데모를 위해 6~8ms 바쁜 대기를 넣었습니다.
  const t = performance.now();
  while (performance.now() - t < 8) {
    console.log("heavyFilter");
  }
  return q ? items.filter((i) => i.includes(q)) : items.slice(0, 1000);
}

export default function DemoUseTransition2() {
  const [query, setQuery] = useState("");
  const [list, setList] = useState<string[]>(ALL.slice(0, 1000));

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    console.log("onChange start", q);
    setQuery(q); // 입력값 업데이트
    // useTransition 없이 직접 실행 - 블로킹됩니다!
    setList(heavyFilter(ALL, q));
  };

  const label = useMemo(() => `${list.length}개 결과`, [list]);

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input
        value={query}
        onChange={onChange}
        placeholder="검색어를 입력했어요"
      />
      <div aria-live="polite">{label}</div>
      <ul
        style={{
          maxHeight: 260,
          overflow: "auto",
          border: "1px solid #e5e7eb",
          padding: 8,
        }}
      >
        {list.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}
