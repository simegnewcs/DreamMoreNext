"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link, Image, Table,
  Type, Palette, Undo2, Redo2, Subscript, Superscript,
  RemoveFormatting, Quote, Code, ChevronDown
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Enter description...",
  minHeight = "300px"
}: RichTextEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showSizeMenu, setShowSizeMenu] = useState(false);
  const [showColorMenu, setShowColorMenu] = useState(false);
  const [showBgColorMenu, setShowBgColorMenu] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);

  const fontFamilies = [
    { label: "Default", value: "sans-serif" },
    { label: "Arial", value: "Arial, sans-serif" },
    { label: "Times New Roman", value: "Times New Roman, serif" },
    { label: "Georgia", value: "Georgia, serif" },
    { label: "Verdana", value: "Verdana, sans-serif" },
    { label: "Courier New", value: "Courier New, monospace" },
    { label: "Comic Sans MS", value: "Comic Sans MS, cursive" },
  ];

  const fontSizes = [
    { label: "Small", value: "1" },
    { label: "Normal", value: "3" },
    { label: "Large", value: "5" },
    { label: "Huge", value: "7" },
  ];

  const colors = [
    "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef",
    "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3", "#03a9f4", "#00bcd4",
    "#009688", "#4caf50", "#8bc34a", "#cddc39", "#ffeb3b", "#ffc107", "#ff9800", "#ff5722",
    "#ffffff", "#f4f4f4", "#ea4335", "#fbbc05", "#34a853", "#4285f4"
  ];

  const execCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
    updateActiveFormats();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const updateActiveFormats = () => {
    const formats = [];
    if (document.queryCommandState("bold")) formats.push("bold");
    if (document.queryCommandState("italic")) formats.push("italic");
    if (document.queryCommandState("underline")) formats.push("underline");
    if (document.queryCommandState("strikeThrough")) formats.push("strikeThrough");
    if (document.queryCommandState("justifyLeft")) formats.push("justifyLeft");
    if (document.queryCommandState("justifyCenter")) formats.push("justifyCenter");
    if (document.queryCommandState("justifyRight")) formats.push("justifyRight");
    if (document.queryCommandState("justifyFull")) formats.push("justifyFull");
    if (document.queryCommandState("insertUnorderedList")) formats.push("insertUnorderedList");
    if (document.queryCommandState("insertOrderedList")) formats.push("insertOrderedList");
    if (document.queryCommandState("subscript")) formats.push("subscript");
    if (document.queryCommandState("superscript")) formats.push("superscript");
    setActiveFormats(formats);
  };

  const insertTable = (rows: number, cols: number) => {
    let tableHTML = `<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">`;
    for (let i = 0; i < rows; i++) {
      tableHTML += "<tr>";
      for (let j = 0; j < cols; j++) {
        tableHTML += `<td style="border: 1px solid ${isDark ? '#444' : '#ccc'}; padding: 8px; min-width: 50px;">&nbsp;</td>`;
      }
      tableHTML += "</tr>";
    }
    tableHTML += "</table><br>";
    execCommand("insertHTML", tableHTML);
    setShowTableMenu(false);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      execCommand("insertImage", url);
    }
  };

  const clearFormatting = () => {
    execCommand("removeFormat");
  };

  const handleKeyUp = () => {
    updateActiveFormats();
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleBlur = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    value = "", 
    title,
    isActive = false
  }: { 
    icon: any, 
    command: string, 
    value?: string, 
    title: string,
    isActive?: boolean
  }) => (
    <button
      type="button"
      onClick={() => execCommand(command, value)}
      title={title}
      className={`p-2 rounded-lg transition-all ${
        isActive 
          ? isDark ? "bg-[#f47822]/20 text-[#f47822]" : "bg-[#f47822]/10 text-[#f47822]"
          : isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );

  const Dropdown = ({ 
    show, 
    setShow, 
    children, 
    label,
    width = "w-40"
  }: { 
    show: boolean, 
    setShow: (show: boolean) => void, 
    children: React.ReactNode,
    label: string,
    width?: string
  }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => { setShowFontMenu(false); setShowSizeMenu(false); setShowColorMenu(false); setShowBgColorMenu(false); setShowTableMenu(false); setShow(!show); }}
        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm ${
          isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        {label}
        <ChevronDown className="w-3 h-3" />
      </button>
      {show && (
        <div className={`absolute top-full left-0 mt-1 ${width} max-h-60 overflow-y-auto rounded-xl border ${
          isDark ? "bg-[#1a1a2e] border-white/10" : "bg-white border-gray-200"
        } shadow-lg z-50`}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className={`rounded-xl border ${isDark ? "border-white/10" : "border-gray-200"} overflow-hidden`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap items-center gap-1 p-2 border-b ${
        isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"
      }`}>
        {/* Font Family */}
        <Dropdown show={showFontMenu} setShow={setShowFontMenu} label="Font" width="w-48">
          {fontFamilies.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => { execCommand("fontName", font.value); setShowFontMenu(false); }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                isDark ? "text-white/80 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{ fontFamily: font.value }}
            >
              {font.label}
            </button>
          ))}
        </Dropdown>

        {/* Font Size */}
        <Dropdown show={showSizeMenu} setShow={setShowSizeMenu} label="Size" width="w-32">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              type="button"
              onClick={() => { execCommand("fontSize", size.value); setShowSizeMenu(false); }}
              className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                isDark ? "text-white/80 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {size.label}
            </button>
          ))}
        </Dropdown>

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Formatting */}
        <ToolbarButton icon={Bold} command="bold" title="Bold (Ctrl+B)" isActive={activeFormats.includes("bold")} />
        <ToolbarButton icon={Italic} command="italic" title="Italic (Ctrl+I)" isActive={activeFormats.includes("italic")} />
        <ToolbarButton icon={Underline} command="underline" title="Underline (Ctrl+U)" isActive={activeFormats.includes("underline")} />
        <ToolbarButton icon={Strikethrough} command="strikeThrough" title="Strikethrough" isActive={activeFormats.includes("strikeThrough")} />

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Colors */}
        <Dropdown show={showColorMenu} setShow={setShowColorMenu} label="Color" width="w-48">
          <div className="p-2 grid grid-cols-8 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { execCommand("foreColor", color); setShowColorMenu(false); }}
                className="w-6 h-6 rounded-md border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </Dropdown>

        <Dropdown show={showBgColorMenu} setShow={setShowBgColorMenu} label="BG" width="w-48">
          <div className="p-2 grid grid-cols-8 gap-1">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { execCommand("hiliteColor", color); setShowBgColorMenu(false); }}
                className="w-6 h-6 rounded-md border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </Dropdown>

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Alignment */}
        <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" isActive={activeFormats.includes("justifyLeft")} />
        <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" isActive={activeFormats.includes("justifyCenter")} />
        <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" isActive={activeFormats.includes("justifyRight")} />
        <ToolbarButton icon={AlignJustify} command="justifyFull" title="Justify" isActive={activeFormats.includes("justifyFull")} />

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Lists */}
        <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" isActive={activeFormats.includes("insertUnorderedList")} />
        <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" isActive={activeFormats.includes("insertOrderedList")} />

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Indent */}
        <ToolbarButton icon={() => <span className="font-bold text-sm">&gt;</span>} command="indent" title="Increase Indent" />
        <ToolbarButton icon={() => <span className="font-bold text-sm">&lt;</span>} command="outdent" title="Decrease Indent" />

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Insert */}
        <button
          type="button"
          onClick={insertLink}
          className={`p-2 rounded-lg transition-all ${
            isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Insert Link"
        >
          <Link className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={insertImage}
          className={`p-2 rounded-lg transition-all ${
            isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Insert Image"
        >
          <Image className="w-4 h-4" />
        </button>

        {/* Table */}
        <Dropdown show={showTableMenu} setShow={setShowTableMenu} label="Table" width="w-32">
          <div className="p-2">
            <p className={`text-xs mb-2 ${isDark ? "text-white/50" : "text-gray-500"}`}>Insert Table</p>
            <div className="grid grid-cols-3 gap-1">
              {[2, 3, 4].flatMap(rows => [2, 3, 4].map(cols => (
                <button
                  key={`${rows}-${cols}`}
                  type="button"
                  onClick={() => insertTable(rows, cols)}
                  className={`p-2 rounded text-xs ${isDark ? "hover:bg-white/10" : "hover:bg-gray-100"} ${
                    isDark ? "text-white/70" : "text-gray-600"
                  }`}
                >
                  {rows}×{cols}
                </button>
              )))}
            </div>
          </div>
        </Dropdown>

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Undo/Redo */}
        <ToolbarButton icon={Undo2} command="undo" title="Undo (Ctrl+Z)" />
        <ToolbarButton icon={Redo2} command="redo" title="Redo (Ctrl+Y)" />

        <div className={`w-px h-6 mx-1 ${isDark ? "bg-white/10" : "bg-gray-200"}`} />

        {/* Clear */}
        <button
          type="button"
          onClick={clearFormatting}
          className={`p-2 rounded-lg transition-all ${
            isDark ? "text-white/70 hover:text-white hover:bg-white/5" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          }`}
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>

        <ToolbarButton icon={Quote} command="formatBlock" value="blockquote" title="Quote" />
        <ToolbarButton icon={Code} command="formatBlock" value="pre" title="Code Block" />
        <ToolbarButton icon={Subscript} command="subscript" title="Subscript" isActive={activeFormats.includes("subscript")} />
        <ToolbarButton icon={Superscript} command="superscript" title="Superscript" isActive={activeFormats.includes("superscript")} />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onKeyUp={handleKeyUp}
        onMouseUp={updateActiveFormats}
        onBlur={handleBlur}
        onInput={handleKeyUp}
        className={`p-4 outline-none min-h-[300px] ${
          isDark 
            ? "bg-white/5 text-white prose-invert" 
            : "bg-white text-gray-900 prose"
        }`}
        style={{ minHeight }}
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />

      {/* Placeholder */}
      {!value && (
        <div className={`absolute left-4 top-16 pointer-events-none ${
          isDark ? "text-white/30" : "text-gray-400"
        }`}>
          {placeholder}
        </div>
      )}
    </div>
  );
}
