/**
 * SK2FACE — Forensic Composite Sketch Builder
 *
 * Feature library assets are loaded from /public/Face Sketch Elements/.
 * See src/data/featureLibrary.js for the complete mapping.
 */

import { useState, useRef, useCallback, useEffect, memo } from "react";
import Dashboard from "../components/Dashboard";
import FEATURE_LIBRARY from "../data/featureLibrary";
import useCanvasHistory from "../hooks/useCanvasHistory";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  primary: "#0B1F3A",
  bg: "#FFFFFF",
  accent: "#C5A047",
  text: "#2C2C2C",
  lightBg: "#F4F6F9",
  success: "#2E7D32",
  warning: "#EDB100",
  danger: "#C62828",
  border: "#D0D7E3",
  muted: "#6B7A99",
};

// ─── Default canvas size per category ────────────────────────────────────────
const CAT_SIZE = {
  "face-shape": [220, 270],
  hair: [200, 155],
  eyes: [155, 55],
  eyebrows: [145, 38],
  nose: [80, 100],
  lips: [120, 52],
  more: [100, 80],
  mustach: [120, 60],
};

// Natural layer ordering (lower = behind)
const CAT_ZLAYER = {
  "face-shape": 1,
  hair: 2,
  eyebrows: 5,
  eyes: 6,
  nose: 7,
  lips: 8,
  more: 9,
  mustach: 10,
};

// Use the imported library
const LIBRARY = FEATURE_LIBRARY;

// ─── Unique ID factory ────────────────────────────────────────────────────────
let _counter = 1;
const nextId = () => `el_${_counter++}`;

// ══════════════════════════════════════════════════════════════════════════════
// ContextMenu
// ══════════════════════════════════════════════════════════════════════════════
const ContextMenu = memo(function ContextMenu({ x, y, onForward, onBackward, onDelete, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [onClose]);

  const menuItems = [
    { label: "Bring Forward", icon: "↑", fn: onForward, col: C.primary },
    { label: "Send Backward", icon: "↓", fn: onBackward, col: C.primary },
    { label: "Delete Element", icon: "✕", fn: onDelete, col: C.danger },
  ];

  // Clamp so menu stays on screen
  const ww = window.innerWidth, wh = window.innerHeight;
  const menuW = 172, menuH = 118;
  const cx = x + menuW > ww ? ww - menuW - 8 : x;
  const cy = y + menuH > wh ? wh - menuH - 8 : y;

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: cx,
        top: cy,
        zIndex: 999999,
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 7,
        boxShadow: "0 8px 28px rgba(11,31,58,0.2)",
        minWidth: menuW,
        overflow: "hidden",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      <div style={{
        padding: "5px 12px 4px",
        fontSize: 9,
        fontWeight: 800,
        color: C.muted,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        background: C.lightBg,
        borderBottom: `1px solid ${C.border}`,
      }}>
        Element Options
      </div>
      {menuItems.map(({ label, icon, fn, col }) => (
        <button
          key={label}
          onMouseDown={(e) => { e.stopPropagation(); fn(); onClose(); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "9px 14px",
            border: "none",
            background: "transparent",
            color: col,
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            transition: "background 0.1s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = col === C.danger ? "#FFF5F5" : C.lightBg; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ width: 16, textAlign: "center", fontSize: 13 }}>{icon}</span>
          {label}
        </button>
      ))}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// CanvasElement — draggable, resizable, right-clickable
// ══════════════════════════════════════════════════════════════════════════════
const CanvasElement = memo(function CanvasElement({ el, isSelected, onSelect, onUpdate, onContextMenu, onDragEnd, onResizeEnd }) {
  const dragging = useRef(false);
  const resizing = useRef(false);
  const didMove = useRef(false);
  const didResize = useRef(false);

  // Move handler
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.currentTarget !== e.target && e.target.dataset.handle) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect(el.id);

    dragging.current = true;
    didMove.current = false;
    const ox = e.clientX - el.x, oy = e.clientY - el.y;

    const onMove = (me) => {
      if (!dragging.current) return;
      didMove.current = true;
      onUpdate(el.id, { x: me.clientX - ox, y: me.clientY - oy });
    };
    const onUp = () => {
      dragging.current = false;
      if (didMove.current && onDragEnd) onDragEnd();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [el, onSelect, onUpdate, onDragEnd]);

  // Proportional resize from bottom-right corner
  const handleResizeDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    didResize.current = false;

    const sx = e.clientX, sy = e.clientY;
    const sw = el.w, sh = el.h;
    const ar = sw / sh;

    const onMove = (me) => {
      if (!resizing.current) return;
      didResize.current = true;
      const dx = me.clientX - sx;
      const dy = me.clientY - sy;
      // Use whichever delta is larger to determine scale
      const delta = Math.abs(dx) >= Math.abs(dy) ? dx : dy;
      const nw = Math.max(30, sw + delta);
      const nh = Math.max(20, nw / ar);
      onUpdate(el.id, { w: nw, h: nh });
    };
    const onUp = () => {
      resizing.current = false;
      if (didResize.current && onResizeEnd) onResizeEnd();
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  }, [el, onUpdate, onResizeEnd]);

  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect(el.id);
    onContextMenu(e.clientX, e.clientY, el.id);
  }, [el, onSelect, onContextMenu]);

  // Corner handle positions
  const handles = [
    { key: "br", style: { bottom: -6, right: -6 }, cursor: "nwse-resize", isResize: true },
    { key: "bl", style: { bottom: -6, left: -6 }, cursor: "nesw-resize", isResize: false },
    { key: "tr", style: { top: -6, right: -6 }, cursor: "nesw-resize", isResize: false },
    { key: "tl", style: { top: -6, left: -6 }, cursor: "nwse-resize", isResize: false },
  ];

  return (
    <div
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      style={{
        position: "absolute",
        left: el.x,
        top: el.y,
        width: el.w,
        height: el.h,
        zIndex: el.zIndex,
        cursor: "move",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <img
        src={el.src}
        alt={el.featureId}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          display: "block",
          pointerEvents: "none",
          imageRendering: "high-quality",
        }}
      />

      {/* Selection overlay */}
      {isSelected && (
        <>
          <div style={{
            position: "absolute",
            inset: -1,
            border: `1.5px dashed ${C.accent}`,
            borderRadius: 2,
            pointerEvents: "none",
          }} />
          {handles.map(({ key, style, cursor, isResize }) => (
            <div
              key={key}
              data-handle="1"
              onMouseDown={isResize ? handleResizeDown : (e) => { e.preventDefault(); e.stopPropagation(); }}
              style={{
                position: "absolute",
                ...style,
                width: 11,
                height: 11,
                background: C.accent,
                border: `1.5px solid ${C.primary}`,
                borderRadius: 2,
                cursor,
                zIndex: 20,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// FeatureItem — library thumbnail
// ══════════════════════════════════════════════════════════════════════════════
const FeatureItem = memo(function FeatureItem({ item, catId }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("fid", item.id);
        e.dataTransfer.setData("fsrc", item.src);
        e.dataTransfer.setData("fcat", catId);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.label}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "7px 4px 5px",
        borderRadius: 6,
        cursor: "grab",
        border: `1px solid ${hovered ? C.accent : C.border}`,
        background: hovered ? "#FDF8EC" : "#fff",
        userSelect: "none",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? "0 3px 10px rgba(197,160,71,0.2)" : "none",
        transition: "all 0.13s",
      }}
    >
      {imgError ? (
        <div style={{
          width: 58, height: 42,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: C.muted, textAlign: "center",
          background: C.lightBg, borderRadius: 3, padding: 2,
          lineHeight: 1.3,
        }}>
          {item.id}
          <br /><span style={{ color: C.warning, fontSize: 8 }}>PNG missing</span>
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.id}
          draggable={false}
          onError={() => setImgError(true)}
          style={{ width: 58, height: 42, objectFit: "contain", objectPosition: "center", imageRendering: "high-quality" }}
        />
      )}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// CategorySection
// ══════════════════════════════════════════════════════════════════════════════
const CategorySection = memo(function CategorySection({ cat }) {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ marginBottom: 6 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 10px",
          background: C.primary,
          color: "#fff",
          border: "none",
          borderRadius: 5,
          cursor: "pointer",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontFamily: "inherit",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 13 }}>{cat.icon}</span>
          {cat.id}
        </span>
        <span style={{ fontSize: 9, color: C.accent }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, padding: "7px 2px" }}>
          {cat.items.map((item) => <FeatureItem key={item.id} item={item} catId={cat.id} />)}
        </div>
      )}
    </div>
  );
});

// ══════════════════════════════════════════════════════════════════════════════
// FeaturePanel
// ══════════════════════════════════════════════════════════════════════════════
function FeaturePanel() {
  const [search, setSearch] = useState("");

  const filtered = LIBRARY.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      !search ||
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      cat.id.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <aside style={{
      width: "25%",
      background: C.lightBg,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "12px 10px 9px", background: C.primary, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
          Feature Library
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search features…"
          style={{
            width: "100%",
            padding: "6px 10px",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 5,
            color: "#fff",
            fontSize: 11,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      {/* Asset notice */}
      <div style={{ padding: "7px 8px 0", flexShrink: 0 }}>
        <div style={{
          background: "#FFFBEA",
          border: `1px solid ${C.warning}`,
          borderRadius: 5,
          padding: "5px 8px",
          fontSize: 9.5,
          color: "#6B4700",
          lineHeight: 1.45,
        }}>
          📁 Place PNG files in:<br />
          <code style={{ fontFamily: "monospace", fontSize: 9 }}>/public/Face Sketch Elements/[category]/</code>
        </div>
      </div>

      {/* Scrollable list */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px", scrollbarWidth: "thin", scrollbarColor: `${C.border} transparent` }}>
        {filtered.map((cat) => <CategorySection key={cat.id} cat={cat} />)}
      </div>
    </aside>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SketchCanvas
// ══════════════════════════════════════════════════════════════════════════════
const CANVAS_W = 500, CANVAS_H = 560;

function SketchCanvas({ elements, selectedId, onSelect, onUpdate, onContextMenu, onDrop, canvasRef, onDragEnd, onResizeEnd }) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const fid = e.dataTransfer.getData("fid");
    const fsrc = e.dataTransfer.getData("fsrc");
    const fcat = e.dataTransfer.getData("fcat");
    if (!fid || !fsrc) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const dx = e.clientX - rect.left;
    const dy = e.clientY - rect.top;
    onDrop({ fid, src: fsrc, catId: fcat, dropX: dx, dropY: dy });
  }, [canvasRef, onDrop]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Label */}
      <div style={{ fontSize: 11, color: C.muted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12, alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ color: C.accent }}>◈</span> Composite Sketch Canvas
      </div>

      {/* Drop zone */}
      <div
        ref={canvasRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={(e) => { if (e.target === e.currentTarget) onSelect(null); }}
        style={{
          position: "relative",
          width: CANVAS_W,
          height: CANVAS_H,
          background: "#FFFFFF",
          border: `2px solid ${dragOver ? C.accent : C.border}`,
          borderRadius: 4,
          boxShadow: dragOver
            ? `0 0 0 4px rgba(197,160,71,0.18), 0 8px 32px rgba(11,31,58,0.12)`
            : `0 4px 20px rgba(11,31,58,0.08)`,
          overflow: "hidden",
          transition: "border-color 0.15s, box-shadow 0.15s",
          flexShrink: 0,
        }}
      >
        {/* Grid */}
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04 }} width={CANVAS_W} height={CANVAS_H}>
          <defs>
            <pattern id="cgrid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M25 0L0 0 0 25" fill="none" stroke={C.primary} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cgrid)" />
        </svg>

        {/* Centerlines */}
        <svg style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04 }} width={CANVAS_W} height={CANVAS_H}>
          <line x1={CANVAS_W / 2} y1={0} x2={CANVAS_W / 2} y2={CANVAS_H} stroke={C.primary} strokeWidth="1" strokeDasharray="4 4" />
          <line x1={0} y1={CANVAS_H / 2} x2={CANVAS_W} y2={CANVAS_H / 2} stroke={C.primary} strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {/* Empty state */}
        {elements.length === 0 && !dragOver && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", pointerEvents: "none", gap: 10 }}>
            <div style={{ fontSize: 54, opacity: 0.1 }}>⬡</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.muted, opacity: 0.6 }}>Drag facial features here</div>
            <div style={{ fontSize: 11, color: C.muted, opacity: 0.35 }}>Start with a face shape, then layer features on top</div>
          </div>
        )}

        {/* Drop highlight */}
        {dragOver && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(197,160,71,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.accent, fontWeight: 700, pointerEvents: "none" }}>
            ↓ Drop to Place Feature
          </div>
        )}

        {/* Elements — sorted by zIndex so DOM order matches visual */}
        {[...elements].sort((a, b) => a.zIndex - b.zIndex).map((el) => (
          <CanvasElement
            key={el.id}
            el={el}
            isSelected={selectedId === el.id}
            onSelect={onSelect}
            onUpdate={onUpdate}
            onContextMenu={onContextMenu}
            onDragEnd={onDragEnd}
            onResizeEnd={onResizeEnd}
          />
        ))}
      </div>

      {/* Status line */}
      <div style={{ marginTop: 8, fontSize: 11, color: C.muted, alignSelf: "flex-start" }}>
        {elements.length} element{elements.length !== 1 ? "s" : ""} placed
        {selectedId ? "  ·  Right-click element for options" : "  ·  Click canvas background to deselect"}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ControlsPanel
// ══════════════════════════════════════════════════════════════════════════════
function ControlsPanel({ matchState, matchResult, onExport, onClear, onMatchNow, onUndo, onRedo, canUndo, canRedo }) {
  return (
    <aside style={{
      width: "25%",
      background: C.lightBg,
      borderLeft: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ background: C.primary, padding: "12px 14px 10px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Actions & Tools
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px", display: "flex", flexDirection: "column", gap: 8, scrollbarWidth: "thin", scrollbarColor: `${C.border} transparent` }}>
        {/* Match Now */}
        <button
          onClick={onMatchNow}
          disabled={matchState === "loading"}
          style={{
            width: "100%",
            padding: "12px",
            background: matchState === "loading" ? C.muted : C.primary,
            border: `2px solid ${C.accent}`,
            borderRadius: 7,
            color: C.accent,
            fontSize: 13,
            fontWeight: 800,
            cursor: matchState === "loading" ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            letterSpacing: "0.06em",
            fontFamily: "inherit",
            transition: "opacity 0.2s",
          }}
        >
          {matchState === "loading" ? (
            <>
              <span style={{ display: "inline-block", width: 14, height: 14, border: `2px solid rgba(197,160,71,0.3)`, borderTopColor: C.accent, borderRadius: "50%", animation: "sk2spin 0.7s linear infinite" }} />
              Matching…
            </>
          ) : "🔍 Match Now"}
        </button>

        {/* Undo / Redo */}
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={{
              ...btnStyle("#fff", C.primary, C.primary),
              flex: 1,
              opacity: canUndo ? 1 : 0.4,
              cursor: canUndo ? "pointer" : "not-allowed",
            }}
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            style={{
              ...btnStyle("#fff", C.primary, C.primary),
              flex: 1,
              opacity: canRedo ? 1 : 0.4,
              cursor: canRedo ? "pointer" : "not-allowed",
            }}
          >
            ↷ Redo
          </button>
        </div>

        {/* Export */}
        <button onClick={onExport} style={btnStyle("#fff", C.primary, C.primary)}>
          ⬇ Export as PNG
        </button>

        {/* Clear */}
        <button onClick={onClear} style={btnStyle("#fff", C.danger, C.danger)}>
          ✕ Clear Canvas
        </button>

        <Divider />

        {/* Case Details */}
        <Card title="Current Case">
          {[
            ["Case ID", "24-10945", true],
            ["Investigator", "Agent Smith", false],
            ["Date", "Oct 26, 2024", false],
            ["Status", "Active", false],
          ].map(([k, v, mono]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11 }}>
              <span style={{ color: C.muted, fontWeight: 500 }}>{k}</span>
              <span style={{ color: C.text, fontWeight: 700, fontFamily: mono ? "monospace" : "inherit", textAlign: "right" }}>
                {k === "Status"
                  ? <span style={{ background: "#E8F5E9", color: C.success, padding: "1px 7px", borderRadius: 4, fontSize: 10, fontFamily: "inherit" }}>{v}</span>
                  : v}
              </span>
            </div>
          ))}
        </Card>

        {/* Notes */}
        <textarea
          placeholder="Investigation notes…"
          style={{
            width: "100%",
            height: 72,
            padding: "8px 10px",
            background: "#fff",
            border: `1px solid ${C.border}`,
            borderRadius: 6,
            color: C.text,
            fontSize: 11,
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />

        <Divider />

        {/* Tips */}
        <Card title="Quick Tips">
          {[
            "Drag PNG features onto canvas",
            "Click element → select & resize from corners",
            "Right-click → bring forward / send back / delete",
            "Start with face shape for best layering",
            "Delete key → remove selected element",
            "Arrow keys → nudge selected element",
            "Ctrl+Z / Ctrl+Y → undo / redo",
          ].map((tip, i) => (
            <div key={i} style={{ fontSize: 10, color: C.muted, marginBottom: 5, display: "flex", gap: 7 }}>
              <span style={{ color: C.accent, fontWeight: 800, flexShrink: 0 }}>{i + 1}.</span>
              {tip}
            </div>
          ))}
        </Card>

        {/* Match Results */}
        {matchResult && (
          <Card title="🎯 Match Results" titleBg={C.success} titleColor="#fff">
            {matchResult.candidates.map((c, i) => (
              <div key={c.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 0",
                borderBottom: i < matchResult.candidates.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: i === 0 ? C.accent : C.lightBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: i === 0 ? C.primary : C.muted, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.text, fontFamily: "monospace" }}>{c.id}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{c.region}</div>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? C.success : C.muted, textAlign: "right" }}>{c.confidence}%</div>
                  <div style={{ width: 46, height: 5, background: C.lightBg, borderRadius: 3, marginTop: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${c.confidence}%`, background: i === 0 ? C.success : C.muted, borderRadius: 3 }} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Status bar */}
      <div style={{ padding: "8px 14px", borderTop: `1px solid ${C.border}`, fontSize: 10, color: C.muted, display: "flex", alignItems: "center", gap: 6, flexShrink: 0, background: "#fff" }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.success, display: "inline-block", boxShadow: `0 0 5px ${C.success}55` }} />
        System Ready · Last saved 2m ago
      </div>
    </aside>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function btnStyle(bg, borderColor, color) {
  return {
    width: "100%",
    padding: "9px 12px",
    background: bg,
    border: `1.5px solid ${borderColor}`,
    borderRadius: 6,
    color: color,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    fontFamily: "inherit",
    transition: "background 0.13s",
  };
}

function Card({ title, titleBg, titleColor, children }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${C.border}`, borderRadius: 6, overflow: "hidden" }}>
      <div style={{ background: titleBg || C.primary, padding: "6px 12px", fontSize: 10, fontWeight: 800, color: titleColor || C.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
        {title}
      </div>
      <div style={{ padding: "10px 12px" }}>{children}</div>
    </div>
  );
}

function Divider() {
  return <hr style={{ border: "none", borderTop: `1px solid ${C.border}`, margin: "2px 0" }} />;
}

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null;
  const bg = { success: C.success, error: C.danger, info: C.primary }[toast.type] || C.primary;
  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      padding: "10px 22px",
      borderRadius: 8,
      background: bg,
      color: "#fff",
      fontSize: 13,
      fontWeight: 700,
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
      zIndex: 9999999,
      display: "flex",
      alignItems: "center",
      gap: 8,
      animation: "sk2fade 0.2s ease",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      whiteSpace: "nowrap",
    }}>
      {{ success: "✓", error: "⚠", info: "ℹ" }[toast.type]} {toast.msg}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ROOT — SK2FACE App
// ══════════════════════════════════════════════════════════════════════════════
export default function Canvas() {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [ctxMenu, setCtxMenu] = useState(null);   // { x, y, id }
  const [matchState, setMatchState] = useState("idle"); // idle | loading | done | error
  const [matchResult, setMatchResult] = useState(null);
  const [toast, setToast] = useState(null);
  const canvasRef = useRef(null);
  const topZRef = useRef(10);

  // ── History (undo / redo)
  const { pushState, undo, redo, canUndo, canRedo } = useCanvasHistory(setElements);

  // Ref that always mirrors the latest elements so keyboard handler is never stale
  const elementsRef = useRef(elements);
  useEffect(() => { elementsRef.current = elements; }, [elements]);

  const selectedIdRef = useRef(selectedId);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  // ── Toast helper
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  // ── Drop new element onto canvas
  const handleDrop = useCallback(({ fid, src, catId, dropX, dropY }) => {
    const [dw, dh] = CAT_SIZE[catId] || [100, 80];
    const zBase = CAT_ZLAYER[catId] || 5;
    topZRef.current = Math.max(topZRef.current, zBase) + 1;

    const newEl = {
      id: nextId(),
      featureId: fid,
      src,
      catId,
      x: dropX - dw / 2,
      y: dropY - dh / 2,
      w: dw,
      h: dh,
      zIndex: topZRef.current,
    };

    setElements((prev) => {
      const next = [...prev, newEl];
      pushState(next);
      return next;
    });
  }, [pushState]);

  // ── Update element properties
  const handleUpdate = useCallback((id, patch) => {
    setElements((prev) => prev.map((el) => el.id === id ? { ...el, ...patch } : el));
  }, []);

  // ── Drag / Resize end → push history once
  const handleInteractionEnd = useCallback(() => {
    // Read the latest elements and push a snapshot
    pushState(elementsRef.current);
  }, [pushState]);

  // ── Select
  const handleSelect = useCallback((id) => {
    setSelectedId(id);
    setCtxMenu(null);
  }, []);

  // ── Context menu
  const handleContextMenu = useCallback((x, y, id) => {
    setCtxMenu({ x, y, id });
  }, []);

  const closeCtx = useCallback(() => setCtxMenu(null), []);

  const bringForward = useCallback(() => {
    if (!ctxMenu?.id) return;
    topZRef.current += 1;
    setElements((prev) => {
      const next = prev.map((e) => e.id === ctxMenu.id ? { ...e, zIndex: topZRef.current } : e);
      pushState(next);
      return next;
    });
  }, [ctxMenu, pushState]);

  const sendBackward = useCallback(() => {
    if (!ctxMenu?.id) return;
    setElements((prev) => {
      const el = prev.find((e) => e.id === ctxMenu.id);
      if (!el) return prev;
      const newZ = Math.max(1, el.zIndex - 1);
      const next = prev.map((e) => e.id === ctxMenu.id ? { ...e, zIndex: newZ } : e);
      pushState(next);
      return next;
    });
  }, [ctxMenu, pushState]);

  const deleteElement = useCallback((id) => {
    setElements((prev) => {
      const next = prev.filter((e) => e.id !== id);
      pushState(next);
      return next;
    });
    setSelectedId(null);
  }, [pushState]);

  const deleteCtxElement = useCallback(() => {
    if (!ctxMenu?.id) return;
    deleteElement(ctxMenu.id);
  }, [ctxMenu, deleteElement]);

  // ── Clear
  const clearCanvas = useCallback(() => {
    setElements([]);
    pushState([]);
    setSelectedId(null);
    setMatchResult(null);
    showToast("Canvas cleared", "info");
  }, [showToast, pushState]);

  // ── Keyboard handler (Delete, Arrow keys, Ctrl+Z/Y)
  useEffect(() => {
    const NUDGE = 3; // px per arrow key press

    const handleKeyDown = (e) => {
      // Ignore if user is typing in an input / textarea
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      // ── Ctrl+Z  →  Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        undo();
        return;
      }
      // ── Ctrl+Y  →  Redo
      if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
        return;
      }

      const selId = selectedIdRef.current;
      if (!selId) return;

      // ── Delete key
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        deleteElement(selId);
        return;
      }

      // ── Arrow keys → nudge
      const arrows = { ArrowLeft: [-NUDGE, 0], ArrowRight: [NUDGE, 0], ArrowUp: [0, -NUDGE], ArrowDown: [0, NUDGE] };
      const delta = arrows[e.key];
      if (delta) {
        e.preventDefault();
        setElements((prev) => {
          const next = prev.map((el) =>
            el.id === selId ? { ...el, x: el.x + delta[0], y: el.y + delta[1] } : el
          );
          pushState(next);
          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, deleteElement, pushState]);

  // ── Render elements to an offscreen canvas (native Canvas 2D API)
  const renderToCanvas = useCallback(async (scale = 2) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = CANVAS_W * scale;
    offscreen.height = CANVAS_H * scale;
    const ctx = offscreen.getContext("2d");

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, offscreen.width, offscreen.height);
    ctx.scale(scale, scale);

    // Sort by zIndex so drawing order matches visual layering
    const sorted = [...elements].sort((a, b) => a.zIndex - b.zIndex);

    // Load all images in parallel
    const imgPromises = sorted.map(
      (el) =>
        new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve({ el, img, ok: true });
          img.onerror = () => resolve({ el, img: null, ok: false });
          img.src = el.src;
        })
    );
    const loaded = await Promise.all(imgPromises);

    // Draw each image at its exact canvas position and size
    for (const { el, img, ok } of loaded) {
      if (!ok || !img) continue;

      // Replicate object-fit: contain behaviour
      const elAR = el.w / el.h;
      const imgAR = img.naturalWidth / img.naturalHeight;
      let dw, dh, dx, dy;

      if (imgAR > elAR) {
        // Image is wider — fit to width, center vertically
        dw = el.w;
        dh = el.w / imgAR;
        dx = el.x;
        dy = el.y + (el.h - dh) / 2;
      } else {
        // Image is taller — fit to height, center horizontally
        dh = el.h;
        dw = el.h * imgAR;
        dx = el.x + (el.w - dw) / 2;
        dy = el.y;
      }

      ctx.drawImage(img, dx, dy, dw, dh);
    }

    return offscreen;
  }, [elements]);

  // ── Export
  const exportImage = useCallback(async () => {
    if (elements.length === 0) { showToast("Add features to canvas first", "error"); return; }
    try {
      setSelectedId(null);
      const offscreen = await renderToCanvas(2);
      const link = document.createElement("a");
      link.download = `sk2face_${Date.now()}.png`;
      link.href = offscreen.toDataURL("image/png", 1.0);
      link.click();
      showToast("Sketch exported as PNG!", "success");
    } catch (err) {
      console.error(err);
      showToast("Export failed — check console", "error");
    }
  }, [elements, renderToCanvas, showToast]);

  // ── Match Now
  const handleMatchNow = useCallback(async () => {
    if (elements.length === 0) { showToast("Add features to canvas first", "error"); return; }
    setMatchState("loading");
    setMatchResult(null);

    try {
      setSelectedId(null);
      const offscreen = await renderToCanvas(2);
      const blob = await new Promise((res) => offscreen.toBlob(res, "image/png"));

      const fd = new FormData();
      fd.append("sketch", blob, "sketch.png");

      // ── Replace this block with: const res = await fetch("/match", { method: "POST", body: fd }); const data = await res.json();
      await new Promise((r) => setTimeout(r, 1800));
      const data = {
        candidates: [
          { id: "C-2024-0891", confidence: 87, region: "North District" },
          { id: "C-2024-0445", confidence: 71, region: "East District" },
          { id: "C-2023-1102", confidence: 58, region: "Central" },
        ]
      };
      // ── End mock

      setMatchResult(data);
      setMatchState("done");
      showToast("Match complete — results below", "success");
    } catch (err) {
      console.error(err);
      setMatchState("error");
      showToast("Match failed. Ensure /match endpoint is available.", "error");
    }
  }, [elements, renderToCanvas, showToast]);

  return (
    <Dashboard>
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: C.bg,
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: C.text,
        overflow: "hidden",

      }}>




        {/* ── MAIN ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <FeaturePanel />

          <main
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "20px", background: C.bg, overflow: "auto" }}
            onClick={(e) => { if (e.target === e.currentTarget) { setSelectedId(null); setCtxMenu(null); } }}
          >
            <SketchCanvas
              elements={elements}
              selectedId={selectedId}
              onSelect={handleSelect}
              onUpdate={handleUpdate}
              onContextMenu={handleContextMenu}
              onDrop={handleDrop}
              canvasRef={canvasRef}
              onDragEnd={handleInteractionEnd}
              onResizeEnd={handleInteractionEnd}
            />
          </main>

          <ControlsPanel
            matchState={matchState}
            matchResult={matchResult}
            onExport={exportImage}
            onClear={clearCanvas}
            onMatchNow={handleMatchNow}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>

        {/* Context Menu */}
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x}
            y={ctxMenu.y}
            onForward={bringForward}
            onBackward={sendBackward}
            onDelete={deleteCtxElement}
            onClose={closeCtx}
          />
        )}

        <Toast toast={toast} />

        <style>{`
        @keyframes sk2spin { to { transform: rotate(360deg); } }
        @keyframes sk2fade { from { opacity: 0; transform: translateX(-50%) translateY(8px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }
        img { -webkit-user-drag: none; user-select: none; }
      `}</style>
      </div>
    </Dashboard>
  );
}