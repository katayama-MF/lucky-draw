/* @ds-bundle: {"format":4,"namespace":"DesignSystem_cd3c19","components":[{"name":"Button","sourcePath":"components/Button/Button.jsx"},{"name":"FaqItem","sourcePath":"components/content/FaqItem.jsx"},{"name":"SpeechBubble","sourcePath":"components/content/SpeechBubble.jsx"},{"name":"StatBadge","sourcePath":"components/content/StatBadge.jsx"},{"name":"VoiceCard","sourcePath":"components/content/VoiceCard.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"Disclaimer","sourcePath":"components/display/Disclaimer.jsx"},{"name":"SectionHeading","sourcePath":"components/display/SectionHeading.jsx"},{"name":"ComboFormula","sourcePath":"components/media/ComboFormula.jsx"},{"name":"ImagePlaceholder","sourcePath":"components/media/ImagePlaceholder.jsx"}],"sourceHashes":{"components/Button/Button.jsx":"a5849593d9ca","components/content/FaqItem.jsx":"b4a79a52d081","components/content/SpeechBubble.jsx":"42f03ec1414a","components/content/StatBadge.jsx":"42906da3ea96","components/content/VoiceCard.jsx":"0523d65e250b","components/display/Badge.jsx":"394b13f96cae","components/display/Card.jsx":"bc508a04dd63","components/display/Disclaimer.jsx":"26c1a5e1edba","components/display/SectionHeading.jsx":"3f4257574733","components/media/ComboFormula.jsx":"92ef9e921d50","components/media/ImagePlaceholder.jsx":"e5e931edd629","ui_kits/schooltop/SectionsBottom.jsx":"1aba1f5d5f49","ui_kits/schooltop/SectionsMid.jsx":"9e9fde5420b9","ui_kits/schooltop/SectionsTop.jsx":"4e33971fe25b"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.DesignSystem_cd3c19 = window.DesignSystem_cd3c19 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/Button/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * マグナ Button — the brand's call-to-action.
 * Rounded, bold, with a signature "pop" (hard-offset) shadow.
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  course,
  icon,
  note,
  fullWidth = false,
  as = "button",
  style = {},
  ...rest
}) {
  const sizes = {
    sm: {
      padding: "8px 16px",
      fontSize: 13
    },
    md: {
      padding: "13px 20px",
      fontSize: 15
    },
    lg: {
      padding: "16px 24px",
      fontSize: 16
    }
  };

  // course overrides variant colour when provided
  const courseGrad = {
    method: "var(--grad-method)",
    party: "var(--grad-party)",
    eiken: "var(--grad-eiken)"
  };
  const base = {
    boxSizing: "border-box",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    fontFamily: "var(--font-base)",
    fontWeight: 800,
    lineHeight: 1.3,
    textAlign: "center",
    textDecoration: "none",
    border: "none",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "transform .15s ease, box-shadow .15s ease, opacity .15s ease",
    width: fullWidth ? "100%" : "auto",
    ...sizes[size]
  };
  const variants = {
    primary: {
      background: "var(--grad-primary)",
      color: "#fff",
      boxShadow: "var(--shadow-pop-sm)"
    },
    course: {
      background: course ? courseGrad[course] : "var(--grad-primary)",
      color: "#fff",
      boxShadow: "var(--shadow-pop-sm)"
    },
    soft: {
      background: "var(--surface)",
      color: "var(--ink)",
      border: "2px solid var(--ink)",
      boxShadow: "var(--shadow-pop-ink)"
    },
    ghost: {
      background: "transparent",
      color: "var(--ink-2)",
      boxShadow: "none"
    }
  };
  const v = variant === "course" ? variants.course : variants[variant] || variants.primary;
  const Tag = as;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: "magna-btn",
    style: {
      ...base,
      ...v,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    }
  }, icon ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: "1.15em",
      lineHeight: 1
    }
  }, icon) : null, /*#__PURE__*/React.createElement("span", null, children)), note ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      whiteSpace: "nowrap",
      opacity: 0.95,
      background: variant === "soft" || variant === "ghost" ? "var(--bg-alt)" : "rgba(255,255,255,0.22)",
      padding: "2px 10px",
      borderRadius: "var(--radius-pill)",
      marginTop: 2
    }
  }, note) : null);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/Button/Button.jsx", error: String((e && e.message) || e) }); }

// components/content/FaqItem.jsx
try { (() => {
/** Accordion FAQ item (Q pill + expandable A). */
function FaqItem({
  q,
  children,
  defaultOpen = false,
  style = {}
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius)",
      overflow: "hidden",
      marginBottom: 10,
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setOpen(!open),
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      width: "100%",
      textAlign: "left",
      background: "none",
      border: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      padding: "13px 14px",
      fontSize: 13.5,
      fontWeight: 800,
      color: "var(--ink)",
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      width: 24,
      height: 24,
      borderRadius: "50%",
      background: "var(--magna-mint)",
      color: "#fff",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 800
    }
  }, "Q"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, q), /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      color: "var(--ink-3)",
      fontSize: 14,
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform .2s ease"
    }
  }, "\u25BE")), open ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "0 14px 14px 48px",
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.75
    }
  }, children) : null);
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/content/SpeechBubble.jsx
try { (() => {
/** Speech bubble with a tail — the LP's "friendly aside" voice device. */
function SpeechBubble({
  children,
  tone = "yellow",
  style = {}
}) {
  const tones = {
    yellow: {
      bg: "var(--yellow-soft)",
      bd: "#fde68a"
    },
    pink: {
      bg: "var(--pink-soft)",
      bd: "#fbcfe8"
    },
    mint: {
      bg: "var(--mint-soft)",
      bd: "#a7f3d0"
    },
    white: {
      bg: "var(--surface)",
      bd: "var(--line)"
    }
  };
  const t = tones[tone] || tones.yellow;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: "var(--font-base)",
      background: t.bg,
      border: `2px solid ${t.bd}`,
      borderRadius: "var(--radius-lg)",
      padding: "14px 16px",
      fontSize: 13.5,
      fontWeight: 700,
      lineHeight: 1.7,
      color: "var(--ink)",
      marginTop: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: -10,
      left: 28,
      width: 16,
      height: 16,
      background: t.bg,
      borderLeft: `2px solid ${t.bd}`,
      borderTop: `2px solid ${t.bd}`,
      transform: "rotate(45deg)"
    }
  }), children);
}
Object.assign(__ds_scope, { SpeechBubble });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SpeechBubble.jsx", error: String((e && e.message) || e) }); }

// components/content/StatBadge.jsx
try { (() => {
/**
 * Stat tile — gradient-text big number + unit, with label above and
 * description below. Always pair the group with <Disclaimer>.
 */
function StatBadge({
  label,
  value,
  unit,
  desc,
  featured = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      background: featured ? "var(--yellow-wash)" : "var(--surface)",
      border: featured ? "2px solid var(--magna-yellow)" : "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      padding: "14px 10px",
      textAlign: "center",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      color: featured ? "var(--magna-yellow-deeper)" : "var(--magna-mint)",
      letterSpacing: "0.04em",
      marginBottom: 4
    }
  }, label), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 34,
      fontWeight: 800,
      lineHeight: 1,
      background: "var(--grad-primary)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent"
    }
  }, value), unit ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 800,
      color: "var(--ink)",
      marginLeft: 2
    }
  }, unit) : null), desc ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.5,
      margin: "6px 0 0"
    }
  }, desc) : null);
}
Object.assign(__ds_scope, { StatBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatBadge.jsx", error: String((e && e.message) || e) }); }

// components/content/VoiceCard.jsx
try { (() => {
/**
 * Testimonial card: circular photo placeholder + course badge + who + quote.
 */
function VoiceCard({
  badge,
  badgeTone = "method",
  who,
  children,
  style = {}
}) {
  const tones = {
    method: {
      bg: "var(--yellow-soft)",
      fg: "var(--course-method-ink)"
    },
    party: {
      bg: "var(--pink-soft)",
      fg: "var(--course-party-ink)"
    },
    eiken: {
      bg: "var(--purple-soft)",
      fg: "var(--course-eiken-ink)"
    },
    parent: {
      bg: "var(--mint-soft)",
      fg: "var(--magna-mint-deep)"
    }
  };
  const t = tones[badgeTone] || tones.method;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      display: "flex",
      gap: 12,
      background: "var(--surface)",
      border: "1px solid var(--line)",
      borderRadius: "var(--radius-lg)",
      boxShadow: "var(--shadow-card)",
      padding: 14,
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      flexShrink: 0,
      borderRadius: "50%",
      border: "2px dashed var(--line-strong)",
      background: "var(--bg-alt)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 9,
      fontWeight: 800,
      color: "var(--ink-3)"
    }
  }, "\u5199\u771F"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, badge ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      fontSize: 10,
      fontWeight: 800,
      padding: "3px 10px",
      borderRadius: "var(--radius-pill)",
      background: t.bg,
      color: t.fg
    }
  }, badge) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: "var(--ink)",
      margin: "5px 0 3px"
    }
  }, who), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.65
    }
  }, children)));
}
Object.assign(__ds_scope, { VoiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/VoiceCard.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Pill badge — course tags, campaign tags, target tags. */
function Badge({
  children,
  tone = "neutral",
  outline = false,
  style = {},
  ...rest
}) {
  const tones = {
    neutral: {
      bg: "var(--bg-alt)",
      fg: "var(--ink-2)",
      bd: "var(--line)"
    },
    method: {
      bg: "var(--yellow-soft)",
      fg: "var(--course-method-ink)",
      bd: "#fde68a"
    },
    party: {
      bg: "var(--pink-soft)",
      fg: "var(--course-party-ink)",
      bd: "#fbcfe8"
    },
    eiken: {
      bg: "var(--purple-soft)",
      fg: "var(--course-eiken-ink)",
      bd: "#ddd6fe"
    },
    mint: {
      bg: "var(--mint-soft)",
      fg: "var(--magna-mint-deep)",
      bd: "#a7f3d0"
    },
    campaign: {
      bg: "var(--magna-red)",
      fg: "#fff",
      bd: "var(--magna-red)"
    },
    solid: {
      bg: "var(--ink)",
      fg: "#fff",
      bd: "var(--ink)"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: "inline-block",
      fontFamily: "var(--font-base)",
      fontSize: 11,
      fontWeight: 800,
      lineHeight: 1,
      padding: "5px 12px",
      borderRadius: "var(--radius-pill)",
      background: outline ? "transparent" : t.bg,
      color: t.fg,
      border: `1.5px solid ${t.bd}`,
      whiteSpace: "nowrap",
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Soft rounded surface card. `course` adds the colour-coded top border;
 * `tint` fills with the course's soft background.
 */
function Card({
  children,
  course,
  tint = false,
  pad = 18,
  radius = "var(--radius-lg)",
  style = {},
  ...rest
}) {
  const tops = {
    method: "var(--course-method)",
    party: "var(--course-party)",
    eiken: "var(--course-eiken)",
    mint: "var(--magna-mint)"
  };
  const tints = {
    method: "var(--course-method-soft)",
    party: "var(--course-party-soft)",
    eiken: "var(--course-eiken-soft)",
    mint: "var(--mint-soft)"
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      fontFamily: "var(--font-base)",
      background: tint && course ? tints[course] : "var(--surface)",
      borderRadius: radius,
      border: "1px solid var(--line)",
      borderTop: course ? `4px solid ${tops[course]}` : "1px solid var(--line)",
      boxShadow: "var(--shadow-card)",
      padding: pad,
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/Disclaimer.jsx
try { (() => {
/** Data-honesty disclaimer note (※…). Required under every stat/graph. */
function Disclaimer({
  children,
  align = "center",
  style = {}
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      fontFamily: "var(--font-base)",
      fontSize: "var(--fs-caption)",
      color: "var(--ink-3)",
      fontWeight: 600,
      lineHeight: 1.6,
      textAlign: align,
      margin: "8px 0 0",
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Disclaimer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Disclaimer.jsx", error: String((e && e.message) || e) }); }

// components/display/SectionHeading.jsx
try { (() => {
/**
 * Section heading block: English uppercase eyebrow + heavy JP title with
 * optional highlighted (marker) span + supporting lead.
 */
function SectionHeading({
  eyebrow,
  title,
  em,
  lead,
  align = "center",
  playful = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      textAlign: align,
      marginBottom: 20,
      ...style
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      fontSize: 11,
      fontWeight: 800,
      letterSpacing: playful ? "0.02em" : "var(--ls-eyebrow)",
      color: playful ? "var(--magna-pink-deep)" : "var(--magna-mint)",
      background: playful ? "var(--pink-soft)" : "transparent",
      padding: playful ? "4px 14px" : 0,
      borderRadius: "var(--radius-pill)",
      marginBottom: 8
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: "var(--fs-h2)",
      fontWeight: 900,
      lineHeight: 1.35,
      letterSpacing: "var(--ls-tight)",
      color: "var(--ink)"
    }
  }, title, em ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      background: "linear-gradient(transparent 62%, var(--magna-yellow) 62%, var(--magna-yellow) 92%, transparent 92%)"
    }
  }, em)) : null), lead ? /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13.5,
      color: "var(--ink-2)",
      fontWeight: 600,
      margin: "10px 0 0",
      lineHeight: 1.7
    }
  }, lead) : null);
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/media/ComboFormula.jsx
try { (() => {
/**
 * The "スクール × 専用アプリ" combo formula — two rotated tiles joined by ×,
 * with a conclusion pill. Core HOW-IT-WORKS device of the LP.
 */
function ComboFormula({
  left = {
    emoji: "👥",
    label: "スクール",
    freq: "週1回"
  },
  right = {
    emoji: "🎮",
    label: "専用アプリ",
    freq: "毎日"
  },
  conclusion,
  style = {}
}) {
  const tile = (item, color, bg, rotate) => /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      background: bg,
      border: `2px solid ${color}`,
      borderRadius: "var(--radius-lg)",
      padding: "14px 18px",
      textAlign: "center",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "var(--shadow-card)",
      minWidth: 104
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 30,
      lineHeight: 1
    }
  }, item.emoji), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      fontWeight: 900,
      color: "var(--ink)",
      marginTop: 6
    }
  }, item.label), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "inline-block",
      fontSize: 10,
      fontWeight: 800,
      color: "#fff",
      background: color,
      borderRadius: "var(--radius-pill)",
      padding: "2px 10px",
      marginTop: 5
    }
  }, item.freq));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-base)",
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 14
    }
  }, tile(left, "var(--magna-sky-deep)", "var(--sky-soft)", -1.5), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 24,
      fontWeight: 900,
      color: "var(--magna-pink)"
    }
  }, "\xD7"), tile(right, "var(--magna-mint)", "var(--mint-soft)", 1.5)), conclusion ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      textAlign: "center",
      background: "var(--grad-mint)",
      color: "#fff",
      borderRadius: "var(--radius)",
      padding: "10px 14px",
      fontSize: 13,
      fontWeight: 800,
      lineHeight: 1.6
    }
  }, conclusion) : null);
}
Object.assign(__ds_scope, { ComboFormula });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/ComboFormula.jsx", error: String((e && e.message) || e) }); }

// components/media/ImagePlaceholder.jsx
try { (() => {
/**
 * 差し替え-前提 image slot: diagonal-stripe wash + dashed border + 🖼 tag.
 * Every logo/photo/banner in mocks uses this until real assets arrive.
 */
function ImagePlaceholder({
  label,
  hint,
  tone = "neutral",
  circle = false,
  minHeight = 90,
  style = {}
}) {
  const tones = {
    neutral: {
      stripe: "rgba(100,116,139,.07)",
      grad: "linear-gradient(135deg,#f8fafc,#eef2f6)",
      bd: "var(--line-strong)",
      tag: "#64748b",
      ink: "var(--ink-2)"
    },
    method: {
      stripe: "rgba(217,119,6,.08)",
      grad: "linear-gradient(135deg,#fef3c7,#fde68a)",
      bd: "var(--magna-yellow-deeper)",
      tag: "var(--magna-yellow-deeper)",
      ink: "#92400e"
    },
    party: {
      stripe: "rgba(236,72,153,.08)",
      grad: "linear-gradient(135deg,#fdf2f8,#fce7f3)",
      bd: "var(--magna-pink)",
      tag: "var(--magna-pink)",
      ink: "#831843"
    },
    eiken: {
      stripe: "rgba(139,92,246,.08)",
      grad: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
      bd: "var(--magna-purple)",
      tag: "var(--magna-purple)",
      ink: "#4c1d95"
    }
  };
  const t = tones[tone] || tones.neutral;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      fontFamily: "var(--font-base)",
      background: `repeating-linear-gradient(45deg, ${t.stripe}, ${t.stripe} 8px, transparent 8px, transparent 16px), ${t.grad}`,
      border: `2px dashed ${t.bd}`,
      borderRadius: circle ? "50%" : "var(--radius)",
      minHeight: circle ? undefined : minHeight,
      width: circle ? minHeight : undefined,
      height: circle ? minHeight : undefined,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: circle ? 0 : "18px 10px 10px",
      overflow: "hidden",
      ...style
    }
  }, !circle ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 5,
      left: 5,
      background: t.tag,
      color: "#fff",
      fontSize: 9,
      fontWeight: 800,
      padding: "2px 8px",
      borderRadius: 8
    }
  }, "\uD83D\uDDBC \u5DEE\u3057\u66FF\u3048") : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: circle ? 9 : 12,
      fontWeight: 800,
      color: t.ink,
      lineHeight: 1.4
    }
  }, label), hint && !circle ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9.5,
      fontWeight: 600,
      color: t.ink,
      opacity: 0.75,
      marginTop: 4,
      lineHeight: 1.5
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { ImagePlaceholder });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/media/ImagePlaceholder.jsx", error: String((e && e.message) || e) }); }

// ui_kits/schooltop/SectionsBottom.jsx
try { (() => {
// schooltop LP v19 — lower sections: Courses (3 schools, no prices, ≤3 bullets), Media, FAQ, Final, StickyCTA
// v19: 長いキャンペーンセクションは撤去(FV直下のコンパクト帯へ移動)。英検チャレンジを復活。
const DS3 = window.DesignSystem_cd3c19;
function CourseCard({
  id,
  course,
  logoLabel,
  tagline,
  target,
  feats,
  ctaNote,
  extra
}) {
  return /*#__PURE__*/React.createElement(DS3.Card, {
    course: course,
    pad: 18,
    id: id,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(DS3.ImagePlaceholder, {
    tone: course,
    label: logoLabel,
    hint: "\u6B63\u898F\u30ED\u30B4\u753B\u50CF\u3092\u914D\u7F6E",
    minHeight: 90
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14.5,
      fontWeight: 900,
      color: "var(--ink)",
      margin: "12px 0 8px"
    }
  }, tagline), /*#__PURE__*/React.createElement(DS3.Badge, null, target), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "12px 0",
      padding: 0,
      listStyle: "none",
      display: "grid",
      gap: 7
    }
  }, feats.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: course === "method" ? "var(--course-method)" : course === "party" ? "var(--course-party)" : "var(--course-eiken)",
      fontWeight: 900,
      flexShrink: 0
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, f)))), extra ? extra : null, /*#__PURE__*/React.createElement(DS3.Button, {
    variant: "course",
    course: course,
    fullWidth: true,
    note: ctaNote,
    as: "a",
    href: "#"
  }, "\u8A73\u3057\u304F\u307F\u308B"));
}
function LpCourses() {
  return /*#__PURE__*/React.createElement("section", {
    id: "courses",
    style: {
      padding: "36px 16px"
    }
  }, /*#__PURE__*/React.createElement(DS3.SectionHeading, {
    eyebrow: "3 SCHOOLS",
    title: "\u304A\u5B50\u3055\u307E\u306B\u5408\u308F\u305B\u3066\u3001",
    em: "3\u3064\u306E\u5B66\u3073\u65B9",
    lead: "\u30DE\u30B0\u30CA\u306E\u30B9\u30AF\u30FC\u30EB\u306F3\u3064\u3002\u3069\u308C\u3082\u30D5\u30A1\u30F3\u30E9\u30FC\u30CB\u30F3\u30B0\u3067\u3064\u306A\u304C\u3063\u3066\u3044\u307E\u3059"
  }), /*#__PURE__*/React.createElement(CourseCard, {
    id: "method",
    course: "method",
    logoLabel: "\u30DE\u30B0\u30CA\u30E1\u30BD\u30C3\u30C9 \u30ED\u30B4",
    tagline: "\u30DE\u30A4\u30DA\u30FC\u30B9\u306B\u7D9A\u3051\u308B\u30011\u5BFE1\u30B3\u30FC\u30C1\u30F3\u30B0",
    target: "\u5C0F\u301C\u4E2D\u5B66\u751F / \u81EA\u5206\u306B\u5408\u3063\u305F\u5F62\u3067\u5B66\u3073\u305F\u3044\u5B50",
    feats: ["担当バイリンガル日本人コーチが1対1で伴走", "アプリの学習データに基づいた目標設定とアドバイス", "スクール生は1ヶ月平均320単語をマスター"],
    ctaNote: "\u7121\u6599\u4F53\u9A13\u3082\u53D7\u4ED8\u4E2D",
    extra: /*#__PURE__*/React.createElement(DS3.Disclaimer, {
      align: "left",
      style: {
        margin: "0 0 12px"
      }
    }, "\u203B\u5358\u8A9E\u6570\u306F\u30B5\u30F3\u30D7\u30EB\u5024\u3002\u5B9F\u30C7\u30FC\u30BF\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002")
  }), /*#__PURE__*/React.createElement(CourseCard, {
    id: "party",
    course: "party",
    logoLabel: "\u30DE\u30B0\u30CA\u30D1\u30FC\u30C6\u30A3 \u30ED\u30B4",
    tagline: "\u307F\u3093\u306A\u3067\u30EF\u30A4\u30EF\u30A4\u3001\u30B0\u30EB\u30FC\u30D7\u82F1\u4F1A\u8A71",
    target: "\u5C0F\u5B661\u301C6\u5E74\u751F / \u305F\u304F\u3055\u3093\u8A71\u3057\u305F\u3044\u5B50",
    feats: ["ネイティブ × バイリンガルのデュアル講師体制", "インプット→アウトプットのレッスンを繰り返すから伸びる", "「通じた!」「わかった!」成功体験の連続"],
    ctaNote: "\u7121\u6599\u30EC\u30C3\u30B9\u30F3\u958B\u50AC\u4E2D"
  }), /*#__PURE__*/React.createElement(CourseCard, {
    id: "eiken",
    course: "eiken",
    logoLabel: "\u82F1\u691C\xAE\u30C1\u30E3\u30EC\u30F3\u30B8 \u30ED\u30B4",
    tagline: "\u77ED\u671F\u96C6\u4E2D\u3067\u3001\u82F1\u691C\xAE\u306B\u6311\u6226",
    target: "\u5C0F\u301C\u4E2D\u5B66\u751F / \u76EE\u6A19\u3092\u6301\u3063\u3066\u6311\u6226\u3057\u305F\u3044\u5B50",
    feats: ["級別の短期集中カリキュラム", "アプリの模擬テスト・宝箱と連動して毎日対策", "合格というわかりやすい成功体験で自信がつく"],
    ctaNote: "\u6B21\u56DE\u65E5\u7A0B \u53D7\u4ED8\u4E2D"
  }));
}
function LpMedia() {
  const outlets = [/*#__PURE__*/React.createElement("span", null, "TBS", /*#__PURE__*/React.createElement("br", null), "THE TIME"), "NewsPicks", "SankeiBiz", /*#__PURE__*/React.createElement("span", null, "\u7D4C\u7523\u7701", /*#__PURE__*/React.createElement("br", null), "\u7D39\u4ECB"), /*#__PURE__*/React.createElement("span", null, "\u6587\u79D1\u7701", /*#__PURE__*/React.createElement("br", null), "\u7D39\u4ECB"), "フジテレビ"];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px",
      background: "var(--bg-alt)"
    }
  }, /*#__PURE__*/React.createElement(DS3.SectionHeading, {
    eyebrow: "MEDIA",
    title: /*#__PURE__*/React.createElement("span", null, "\u30A2\u30D7\u30EA\u304C", /*#__PURE__*/React.createElement("br", null), "\u30E1\u30C7\u30A3\u30A2\u3067\u7D39\u4ECB\u3055\u308C\u307E\u3057\u305F"),
    lead: "\u30B9\u30AF\u30FC\u30EB\u9023\u52D5\u30A2\u30D7\u30EA\u300C\u30DE\u30B0\u30CA\u3068\u3075\u3057\u304E\u306E\u5C11\u5973\u300D\u304C\u3001\u5404\u7A2E\u30E1\u30C7\u30A3\u30A2\u3067\u53D6\u308A\u4E0A\u3052\u3089\u308C\u307E\u3057\u305F\u3002"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 8
    }
  }, outlets.map((o, i) => /*#__PURE__*/React.createElement(DS3.ImagePlaceholder, {
    key: i,
    label: o,
    minHeight: 56,
    style: {
      padding: "14px 4px 8px"
    }
  }))), /*#__PURE__*/React.createElement(DS3.Disclaimer, null, "\u203B\u300C\u63A8\u85A6\u300D\u3067\u306F\u306A\u304F\u4E8B\u4F8B\u3068\u3057\u3066\u300C\u7D39\u4ECB\u300D\u3055\u308C\u305F\u3082\u306E\u3067\u3059"));
}
function LpFaq() {
  const faqs = [["英語がまったく初めてでも大丈夫ですか?", "はい、大丈夫です。アルファベットから始めるお子さまも多く、レベルに合わせて無理なくスタートできます。「楽しい」から自然に続けられる設計なので、英語が苦手なお子さまにもおすすめです。"], ["どのコースが自分の子に合っているか相談できますか?", "はい。マグナメソッド・マグナパーティ・英検®チャレンジそれぞれの無料体験・お申込み窓口でご相談いただけます。お子さまの年齢や英語経験、目的に合わせてご案内します。"], ["親がつきっきりでサポートする必要はありますか?", "最初の数回は接続のお手伝いがあると安心ですが、慣れればお子さま1人で取り組めます。専用アプリも直感的に操作できるので、保護者さまの負担は少なく続けられます。"], ["無料体験に参加したら入会しないといけませんか?", "いいえ、無料体験のみのご参加も大歓迎です。無理な勧誘は一切いたしませんので、安心してお試しください。"], ["レッスンを欠席した場合はどうなりますか?", "事前にご連絡いただければ振替などの対応が可能です。詳細は各コースのご案内でご確認ください。"]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px"
    }
  }, /*#__PURE__*/React.createElement(DS3.SectionHeading, {
    eyebrow: "FAQ",
    title: "\u3088\u304F\u3042\u308B\u3054\u8CEA\u554F"
  }), /*#__PURE__*/React.createElement("div", null, faqs.map(([q, a], i) => /*#__PURE__*/React.createElement(DS3.FaqItem, {
    key: i,
    q: q,
    defaultOpen: i === 0
  }, a))));
}
function LpFinal() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "40px 16px 90px",
      background: "var(--wash-playful)"
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      textAlign: "center",
      fontSize: 21,
      fontWeight: 900,
      color: "var(--ink)",
      margin: "0 0 6px",
      lineHeight: 1.4
    }
  }, "\u304A\u5B50\u3055\u307E\u306B\u5408\u3063\u305F", /*#__PURE__*/React.createElement("br", null), "\u5B66\u3073\u65B9\u3092\u59CB\u3081\u3088\u3046"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--ink-2)",
      margin: "0 0 18px"
    }
  }, "3\u3064\u306E\u30B9\u30AF\u30FC\u30EB\u304B\u3089\u3001\u304A\u5B50\u3055\u307E\u306B\u3074\u3063\u305F\u308A\u306E\u5B66\u3073\u65B9\u3092\u3002"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 14
    }
  }, [{
    course: "method",
    logo: "マグナメソッド ロゴ",
    desc: "担当バイリンガルコーチと1対1。データに基づいてマイペースに伸ばしたい子に。",
    note: "無料体験も受付中"
  }, {
    course: "party",
    logo: "マグナパーティ ロゴ",
    desc: "ネイティブ×バイリンガル講師と、インプット×アウトプットで楽しく話したい子に。",
    note: "無料レッスン開催中"
  }, {
    course: "eiken",
    logo: "英検®チャレンジ ロゴ",
    desc: "短期集中で英検®に挑戦。合格の成功体験で自信をつけたい子に。",
    note: "次回日程 受付中"
  }].map((c, i) => /*#__PURE__*/React.createElement(DS3.Card, {
    key: i,
    course: c.course,
    pad: 16
  }, /*#__PURE__*/React.createElement(DS3.ImagePlaceholder, {
    tone: c.course,
    label: c.logo,
    minHeight: 80
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.7,
      margin: "12px 0 14px"
    }
  }, c.desc), /*#__PURE__*/React.createElement(DS3.Button, {
    variant: "course",
    course: c.course,
    fullWidth: true,
    note: c.note,
    as: "a",
    href: "#"
  }, "\u8A73\u3057\u304F\u307F\u308B")))));
}
function LpStickyCta() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "sticky",
      bottom: 0,
      zIndex: 60,
      padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
      background: "rgba(255,255,255,.96)",
      backdropFilter: "blur(6px)",
      boxShadow: "var(--shadow-float)"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#courses",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      background: "var(--grad-primary)",
      color: "#fff",
      textDecoration: "none",
      fontFamily: "var(--font-base)",
      fontSize: 14.5,
      fontWeight: 800,
      borderRadius: "var(--radius)",
      padding: "14px 16px",
      boxShadow: "var(--shadow-pink)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 17
    }
  }, "\uD83D\uDCD6"), /*#__PURE__*/React.createElement("span", null, "\u30DE\u30B0\u30CA\u306E3\u3064\u306E\u30B9\u30AF\u30FC\u30EB\u3092\u30C1\u30A7\u30C3\u30AF"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18,
      opacity: .9
    }
  }, "\u203A")));
}
Object.assign(window, {
  LpCourses,
  LpMedia,
  LpFaq,
  LpFinal,
  LpStickyCta
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/schooltop/SectionsBottom.jsx", error: String((e && e.message) || e) }); }

// ui_kits/schooltop/SectionsMid.jsx
try { (() => {
// schooltop LP v19 — middle sections: Results (英検合格率+単語数比較+未来予言+narrative voices), HowItWorks (レッスン×自社開発アプリ + ゴールデンエイジ)
const DS2 = window.DesignSystem_cd3c19;
function LpResults() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px",
      background: "var(--bg-alt)"
    }
  }, /*#__PURE__*/React.createElement(DS2.SectionHeading, {
    eyebrow: "RESULTS",
    title: "\u30B9\u30AF\u30FC\u30EB\u751F\u306E\u5B9F\u7E3E\u304C\u3001",
    em: "\u7B54\u3048\u3067\u3059",
    lead: "\u4E00\u4EBA\u306E\u3059\u3054\u3044\u5B50\u3067\u306F\u306A\u304F\u3001\u305F\u304F\u3055\u3093\u306E\u30B9\u30AF\u30FC\u30EB\u751F\u306E\u6570\u5B57\u3067"
  }), /*#__PURE__*/React.createElement(DS2.Card, {
    pad: 18,
    style: {
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement(DS2.Badge, {
    tone: "eiken"
  }, "\u82F1\u691C\xAE\u5408\u683C\u7387"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-display)",
      fontSize: 64,
      fontWeight: 800,
      lineHeight: 1,
      background: "var(--grad-primary)",
      WebkitBackgroundClip: "text",
      backgroundClip: "text",
      color: "transparent"
    }
  }, "90"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: "var(--ink)"
    }
  }, "%")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 12.5,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, "\u30B9\u30AF\u30FC\u30EB\u751F\u306E\u82F1\u691C\xAE\u5408\u683C\u7387", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      color: "var(--ink-3)"
    }
  }, "\u53D7\u9A13\u3057\u305F\u30B9\u30AF\u30FC\u30EB\u751F\u5168\u4F53\u30FB\u5168\u7D1A\u5408\u8A08"))), /*#__PURE__*/React.createElement(DS2.Disclaimer, null, "\u203B\u30B5\u30F3\u30D7\u30EB\u5024\u3002\u5B9F\u30C7\u30FC\u30BF(\u7D1A\u5225\u5185\u8A33\u542B\u3080)\u306F\u78BA\u8A8D\u306E\u3046\u3048\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002"), /*#__PURE__*/React.createElement(DS2.Card, {
    pad: 16,
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 2px",
      fontSize: 13.5,
      fontWeight: 800,
      color: "var(--ink)"
    }
  }, "\uD83D\uDCDA 1\u30F6\u6708\u306B\u30DE\u30B9\u30BF\u30FC\u3057\u305F\u5358\u8A9E\u6570"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      fontSize: 11.5,
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, "\u30B9\u30AF\u30FC\u30EB\u751F\u3068\u3001\u30A2\u30D7\u30EA\u306E\u307F(\u975E\u4F1A\u54E1)\u306E\u5E73\u5747\u6BD4\u8F03"), [{
    label: /*#__PURE__*/React.createElement("span", null, "\u30B9\u30AF\u30FC\u30EB\u751F"),
    val: 320,
    pct: 100,
    member: true
  }, {
    label: /*#__PURE__*/React.createElement("span", null, "\u30A2\u30D7\u30EA\u306E\u307F", /*#__PURE__*/React.createElement("br", null), "(\u975E\u4F1A\u54E1)"),
    val: 95,
    pct: 30,
    member: false
  }].map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 62,
      flexShrink: 0,
      fontSize: 10,
      fontWeight: 800,
      color: "var(--ink-2)",
      lineHeight: 1.3,
      textAlign: "right"
    }
  }, r.label), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 26,
      background: "var(--bg)",
      borderRadius: "var(--radius-pill)",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: r.pct + "%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      paddingRight: 8,
      fontSize: 11,
      fontWeight: 800,
      color: "#fff",
      borderRadius: "var(--radius-pill)",
      background: r.member ? "var(--grad-mint)" : "#94a3b8",
      minWidth: 60
    }
  }, r.val, "\u8A9E")))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      fontSize: 11.5,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, "\u5358\u8A9E\u306F\u82F1\u8A9E\u5B66\u7FD2\u306E\u57FA\u672C\u3002\u5B66\u6821\u306E\u6210\u7E3E\u306B\u3082\u76F4\u7D50\u3057\u307E\u3059\u3002"), /*#__PURE__*/React.createElement(DS2.Disclaimer, {
    align: "left"
  }, "\u203B\u30A2\u30D7\u30EA\u5185\u5B66\u7FD2\u30C7\u30FC\u30BF\u304B\u3089\u306E\u30B5\u30F3\u30D7\u30EB\u5024\u3002\u5B9F\u30C7\u30FC\u30BF\u306F\u78BA\u8A8D\u306E\u3046\u3048\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002")), /*#__PURE__*/React.createElement(DS2.Card, {
    pad: 16,
    style: {
      marginTop: 14,
      background: "var(--yellow-wash)",
      border: "2px solid var(--magna-yellow)"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 12px",
      fontSize: 13.5,
      fontWeight: 900,
      color: "var(--ink)",
      textAlign: "center"
    }
  }, "\uD83D\uDD2E \u30B3\u30FC\u30C1\u306F\u304A\u5B50\u3055\u307E\u306E\u300C\u534A\u5E74\u5F8C\u300D\u3092\u4E88\u8A00\u3057\u307E\u3059"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "stretch",
      gap: 6
    }
  }, [{
    t: "いま",
    v: "100語",
    d: "1ヶ月で"
  }, {
    t: "半年後",
    v: "600語",
    d: "小学校卒業レベル"
  }, {
    t: "その先",
    v: "英検5級",
    d: "チャレンジ圏内"
  }].map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      alignSelf: "center",
      color: "var(--magna-yellow-deeper)",
      fontWeight: 900,
      fontSize: 16
    }
  }, "\u2192") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: "var(--surface)",
      borderRadius: "var(--radius)",
      padding: "10px 6px",
      textAlign: "center",
      boxShadow: "var(--shadow-pop-sm)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: "var(--magna-yellow-deeper)"
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: "var(--ink)",
      margin: "3px 0"
    }
  }, s.v), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 9.5,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.4
    }
  }, s.d))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "10px 0 0",
      fontSize: 11.5,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.65,
      textAlign: "center"
    }
  }, "\u300C\u7D9A\u3051\u308C\u3070\u3067\u304D\u308B\u3088\u3046\u306B\u306A\u308B\u300D\u3068\u672C\u4EBA\u304C\u4FE1\u3058\u3089\u308C\u308B \u2014", /*#__PURE__*/React.createElement("br", null), "\u305D\u308C\u304C\u30D5\u30A1\u30F3\u30E9\u30FC\u30CB\u30F3\u30B0\u306E\u4E00\u756A\u306E\u4FA1\u5024\u3067\u3059\u3002")), /*#__PURE__*/React.createElement(DS2.Disclaimer, null, "\u203B\u4E88\u8A00\u4F8B\u306F\u30B5\u30F3\u30D7\u30EB\u3002\u5B9F\u969B\u306F\u304A\u5B50\u3055\u307E\u306E\u5B66\u7FD2\u30C7\u30FC\u30BF\u306B\u57FA\u3065\u3044\u3066\u30B3\u30FC\u30C1\u304C\u3054\u6848\u5185\u3057\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 15.5,
      textAlign: "center",
      margin: "24px 0 4px",
      color: "var(--ink)",
      fontWeight: 800
    }
  }, "\u2728 \u7D9A\u3051\u3066\u3001\u5909\u308F\u3063\u305F\u5B50\u3069\u3082\u305F\u3061"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 10,
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement(DS2.VoiceCard, {
    badge: "\u82F1\u691C\xAE\u30C1\u30E3\u30EC\u30F3\u30B8",
    badgeTone: "eiken",
    who: "\u5C0F6\u30675\u7D1A \u2192 \u4E2D3\u30672\u7D1A A\u304F\u3093"
  }, "\u9A5A\u304F\u306E\u306F\u304B\u304B\u3063\u305F\u6642\u9593\u306E\u77ED\u3055\u3002\u308F\u305A\u304B1\u5E74\u30675\u7D1A\u21924\u7D1A\u21923\u7D1A\u3068\u99C6\u3051\u4E0A\u304C\u308A\u3001\u4E2D3\u30672\u7D1A\u306B\u5408\u683C\u3002\u300C\u6B21\u306F\u3053\u3053\u307E\u3067\u884C\u3051\u308B\u300D\u3068\u672C\u4EBA\u304C\u4FE1\u3058\u3066\u7D9A\u3051\u305F\u7D50\u679C\u3067\u3059\u3002"), /*#__PURE__*/React.createElement(DS2.VoiceCard, {
    badge: "\u4FDD\u8B77\u8005\u306E\u58F0",
    badgeTone: "parent",
    who: "\u5C0F\u5B664\u5E74\u751F\u306E\u4FDD\u8B77\u8005"
  }, "\u82F1\u691C\u306A\u3093\u3066\u53D7\u3051\u308B\u6C17\u306A\u304B\u3063\u305F\u306E\u306B\u3001\u672C\u4EBA\u304B\u3089\u300C\u53D7\u3051\u305F\u3044\u300D\u3068\u8A00\u3044\u51FA\u3057\u307E\u3057\u305F\u3002\u3053\u3093\u306A\u306B\u5909\u308F\u308B\u3068\u601D\u308F\u306A\u304B\u3063\u305F\u3067\u3059\u3002"), /*#__PURE__*/React.createElement(DS2.VoiceCard, {
    badge: "\u30DE\u30B0\u30CA\u30E1\u30BD\u30C3\u30C9",
    badgeTone: "method",
    who: "\u5C0F\u5B665\u5E74\u751F B\u3055\u3093"
  }, "\u30B3\u30FC\u30C1\u3068\u7ACB\u3066\u305F\u76EE\u6A19\u306B\u5411\u304B\u3063\u3066\u3001\u6BCE\u65E5\u81EA\u5206\u304B\u3089\u30A2\u30D7\u30EA\u3092\u958B\u304F\u3088\u3046\u306B\u3002\u300C\u534A\u5E74\u5F8C\u300D\u3092\u697D\u3057\u307F\u306B\u3057\u3066\u3044\u307E\u3059\u3002")), /*#__PURE__*/React.createElement(DS2.Disclaimer, null, "\u203B\u4E8B\u4F8B\u30FB\u30B3\u30E1\u30F3\u30C8\u306F\u30B5\u30F3\u30D7\u30EB\u3002\u5B9F\u969B\u306E\u53D7\u8B1B\u751F\u30FB\u4FDD\u8B77\u8005\u306E\u58F0\u3068\u5199\u771F\u306B\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002"));
}
function LpHowItWorks() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px"
    }
  }, /*#__PURE__*/React.createElement(DS2.SectionHeading, {
    eyebrow: "HOW IT WORKS",
    title: "\u30EC\u30C3\u30B9\u30F3/\u30B3\u30FC\u30C1\u30F3\u30B0 \xD7",
    em: "\u81EA\u793E\u958B\u767A\u30A2\u30D7\u30EA",
    lead: "\u81EA\u793E\u3067\u30A2\u30D7\u30EA\u3092\u958B\u767A\u3057\u3066\u3044\u308B\u82F1\u4F1A\u8A71\u30B9\u30AF\u30FC\u30EB\u306F\u3001\u4ED6\u306B\u3042\u308A\u307E\u305B\u3093"
  }), /*#__PURE__*/React.createElement(DS2.Card, {
    pad: 18
  }, /*#__PURE__*/React.createElement(DS2.ComboFormula, {
    left: {
      emoji: "👥",
      label: "レッスン/コーチング",
      freq: "週1回"
    },
    right: {
      emoji: "🎮",
      label: "自社開発アプリ",
      freq: "毎日"
    },
    conclusion: /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\u6BCE\u65E5\u82F1\u8A9E\u306B\u89E6\u308C\u3066\u3001\u90311\u3067\u4F38\u3070\u3059"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 600
      }
    }, "2\u3064\u3092\u7D44\u307F\u5408\u308F\u305B\u308B\u304B\u3089\u3001\u52B9\u679C\u304C\u51FA\u307E\u3059"))
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: "14px 0 0",
      padding: 0,
      listStyle: "none",
      display: "grid",
      gap: 7
    }
  }, ["学習目標に合わせて宝箱などゲーム内インセンティブを設計", "講師がアプリの学習状況を見てフィードバック", "自社開発チームが継続的にアップデート"].map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: "flex",
      gap: 8,
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "var(--magna-mint)",
      fontWeight: 900,
      flexShrink: 0
    }
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, f))))), /*#__PURE__*/React.createElement(DS2.Card, {
    pad: 16,
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 2px",
      fontSize: 13.5,
      fontWeight: 800,
      color: "var(--ink)"
    }
  }, "\uD83E\uDDE0 \u82F1\u8A9E\u3092\u899A\u3048\u308B\u306A\u3089\u3001\u8A18\u61B6\u529B\u304C\u9AD8\u3044\u300C\u4ECA\u300D"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 10px",
      fontSize: 11.5,
      fontWeight: 600,
      color: "var(--ink-2)"
    }
  }, "\u8133\u306E\u300C\u30B4\u30FC\u30EB\u30C7\u30F3\u30A8\u30A4\u30B8\u300D(4\u301C13\u6B73\u9803)\u306F\u3001\u591A\u304F\u306E\u523A\u6FC0\u306B\u89E6\u308C\u308B\u307B\u3069\u8133\u306E\u56DE\u8DEF\u304C\u6B8B\u308B\u6642\u671F\u3068\u3044\u308F\u308C\u307E\u3059\u3002"), /*#__PURE__*/React.createElement("img", {
    src: "../../assets/golden-age-reference.png",
    alt: "\u8133\u306E\u30B7\u30CA\u30D7\u30B9\u5BC6\u5EA6\u306E\u767A\u9054(\u53C2\u8003\u30B0\u30E9\u30D5)",
    style: {
      width: "100%",
      borderRadius: "var(--radius)",
      border: "1px solid var(--line)",
      display: "block"
    }
  }), /*#__PURE__*/React.createElement(DS2.Disclaimer, {
    align: "left"
  }, "\u203B\u53C2\u8003\u30A4\u30E1\u30FC\u30B8(\u30B5\u30F3\u30D7\u30EB)\u3002\u30A2\u30D7\u30EA\u4F53\u9A13\u4F1A\u8CC7\u6599\u306E\u6B63\u898F\u30B0\u30E9\u30D5\u306B\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002\u51FA\u3057\u65B9\u306F\u76E3\u4FEE(\u9AD8\u5C71\u5148\u751F)\u3068\u8981\u78BA\u8A8D\u3002")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      marginTop: 14,
      background: "var(--sky-wash)",
      borderRadius: "var(--radius-lg)",
      padding: 14,
      border: "1px solid #bfdbfe"
    }
  }, /*#__PURE__*/React.createElement(DS2.ImagePlaceholder, {
    circle: true,
    minHeight: 56,
    label: /*#__PURE__*/React.createElement("span", null, "\u9AD8\u5C71", /*#__PURE__*/React.createElement("br", null), "\u5148\u751F"),
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      fontWeight: 800,
      color: "var(--magna-blue)",
      marginBottom: 4
    }
  }, "\u6559\u80B2\u76E3\u4FEE\u30FB\u9AD8\u5C71\u5148\u751F(\u82F1\u8A9E\u6559\u80B2\u5C02\u9580\u5BB6)"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--ink-2)",
      lineHeight: 1.7
    }
  }, "\u300C\u82F1\u8A9E\u306F\u63A5\u89E6\u983B\u5EA6\u304C\u5B9A\u7740\u306E\u30AB\u30AE\u3002\u6BCE\u65E5\u30A2\u30D7\u30EA\u3067\u697D\u3057\u304F\u82F1\u8A9E\u306B\u89E6\u308C\u308B\u4ED5\u7D44\u307F\u3053\u305D\u304C\u3001\u5B50\u3069\u3082\u306E\u82F1\u8A9E\u3092\u4F38\u3070\u3059\u672C\u8CEA\u3067\u3059\u300D"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10.5,
      fontWeight: 600,
      color: "var(--ink-3)",
      marginTop: 4
    }
  }, "\u203B\u30EA\u30CB\u30E5\u30FC\u30A2\u30EB\u306B\u4F34\u3044\u76E3\u4FEE\u30B3\u30E1\u30F3\u30C8\u306F\u518D\u78BA\u8A8D\u4E88\u5B9A"))));
}
Object.assign(window, {
  LpResults,
  LpHowItWorks
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/schooltop/SectionsMid.jsx", error: String((e && e.message) || e) }); }

// ui_kits/schooltop/SectionsTop.jsx
try { (() => {
// schooltop LP v19 — upper sections: Nav, Hero(FV + compact campaign strip), Intro, Benefit
// v19: 3-school nav, FV sub-copy restored, parent-subject benefits (自己効力感), no 返金保証.
const DS1 = window.DesignSystem_cd3c19;
function LpNav() {
  const pill = (href, label, fg, bg) => /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      fontSize: 10.5,
      fontWeight: 800,
      textDecoration: "none",
      padding: "6px 9px",
      borderRadius: "var(--radius-pill)",
      color: fg,
      background: bg,
      whiteSpace: "nowrap"
    }
  }, label);
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 50,
      display: "flex",
      alignItems: "center",
      gap: 8,
      padding: "10px 12px",
      background: "rgba(255,255,255,.95)",
      backdropFilter: "blur(6px)",
      borderBottom: "1px solid var(--line)"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/magna-logo.png",
    alt: "\u30DE\u30B0\u30CA English School",
    style: {
      height: 32
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      display: "flex",
      gap: 5,
      justifyContent: "flex-end"
    }
  }, pill("#method", "メソッド", "var(--course-method-ink)", "var(--yellow-soft)"), pill("#party", "パーティ", "var(--course-party-ink)", "var(--pink-soft)"), pill("#eiken", "英検", "var(--course-eiken-ink)", "var(--purple-soft)")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      padding: 4,
      cursor: "pointer"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2.5,
      background: "var(--ink)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2.5,
      background: "var(--ink)",
      borderRadius: 2
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2.5,
      background: "var(--ink)",
      borderRadius: 2
    }
  })));
}
function LpHero() {
  // FV = official brand banner. v19: 二段目サブコピーを復活(バナー内に含まれる想定を明記)。
  return /*#__PURE__*/React.createElement("section", {
    id: "fv"
  }, /*#__PURE__*/React.createElement(DS1.ImagePlaceholder, {
    tone: "method",
    label: /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "\uD83D\uDDBC FV: \u516C\u5F0F\u30D0\u30CA\u30FC\u753B\u50CF (SP)", /*#__PURE__*/React.createElement("br", null), "\u300C\u904A\u3073\u304C\u6700\u9AD8\u306EEnglish\u30BF\u30A4\u30E0!\u300D"),
    hint: /*#__PURE__*/React.createElement("span", null, "fv_sp.webp \u2014 \u5B9F\u753B\u50CF\u306B\u5DEE\u3057\u66FF\u3048", /*#__PURE__*/React.createElement("br", null), "\u203B\u4E8C\u6BB5\u76EE\u30B5\u30D6\u30B3\u30D4\u30FC(\u5C02\u7528\u30A2\u30D7\u30EA\xD7\u30AA\u30F3\u30E9\u30A4\u30F3\u30EC\u30C3\u30B9\u30F3\u306E\u8AAC\u660E)\u3092\u542B\u3081\u308B\u3053\u3068"),
    minHeight: 230,
    style: {
      borderRadius: 0,
      borderLeft: "none",
      borderRight: "none",
      borderTop: "none"
    }
  }), /*#__PURE__*/React.createElement("a", {
    href: "#courses",
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      textDecoration: "none",
      background: "var(--magna-red)",
      color: "#fff",
      padding: "9px 12px",
      fontSize: 12.5,
      fontWeight: 800,
      fontFamily: "var(--font-base)"
    }
  }, /*#__PURE__*/React.createElement("span", null, "\uD83C\uDF89"), /*#__PURE__*/React.createElement("span", null, "\u590F\u306E\u30AD\u30E3\u30F3\u30DA\u30FC\u30F3\u5B9F\u65BD\u4E2D \u2014 \u5165\u4F1A\u91D1\u7121\u6599(\u301C7/31)"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .9
    }
  }, "\u203A")));
}
function LpIntro() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px 30px",
      background: "var(--wash-playful)"
    }
  }, /*#__PURE__*/React.createElement(DS1.SectionHeading, {
    playful: true,
    eyebrow: "\uD83C\uDF31 \u5C0F\u5B66\u751F\u306E\u304A\u5B50\u3055\u3093\u304C",
    title: /*#__PURE__*/React.createElement("span", null, "\u697D\u3057\u307F\u306A\u304C\u3089\u82F1\u8A9E\u3092", /*#__PURE__*/React.createElement("br", null), "\u8EAB\u306B\u3064\u3051\u3089\u308C\u308B\u79D8\u5BC6\u3001", /*#__PURE__*/React.createElement("br", null), "\u77E5\u3063\u3066\u3044\u307E\u3059\u304B?")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "flex-start",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement(DS1.ImagePlaceholder, {
    circle: true,
    minHeight: 64,
    label: /*#__PURE__*/React.createElement("span", null, "\u304A\u6BCD\u3055\u3093", /*#__PURE__*/React.createElement("br", null), "\u5199\u771F"),
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement(DS1.SpeechBubble, {
    tone: "white",
    style: {
      marginTop: 0,
      flex: 1
    }
  }, "\u300C\u3046\u3061\u306E\u5B50\u304C\u3053\u3093\u306A\u306B\u3084\u3063\u3066\u308B\u306A\u3093\u3066\u3001\u4FE1\u3058\u3089\u308C\u306A\u3044\u300D", /*#__PURE__*/React.createElement("span", {
    style: {
      display: "block",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--ink-3)",
      marginTop: 4
    }
  }, "\u2014 \u30DE\u30B0\u30CA\u306B\u901A\u3046\u5C0F3\u306E\u4FDD\u8B77\u8005(\u30B5\u30F3\u30D7\u30EB)"))), /*#__PURE__*/React.createElement(DS1.SpeechBubble, {
    tone: "yellow"
  }, "\u305D\u306E\u79D8\u5BC6\u304C\u3001\u30DE\u30B0\u30CA\u306E", /*#__PURE__*/React.createElement("strong", null, "\u300C\u30D5\u30A1\u30F3\u30E9\u30FC\u30CB\u30F3\u30B0\u300D"), "\u3002", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-2)",
      fontWeight: 600
    }
  }, "\u5B50\u3069\u3082\u81EA\u8EAB\u304C\u300C\u81EA\u5206\u306F\u82F1\u8A9E\u304C\u3067\u304D\u308B\u3088\u3046\u306B\u306A\u308B\u300D\u3068\u4FE1\u3058\u3089\u308C\u308B\u3088\u3046\u306B\u306A\u308B\u5B66\u3073\u65B9\u3067\u3059\u3002")));
}
function LpBenefit() {
  // v19: 自己効力感ベースの3便益。本文は削り、親の吹き出しで見せる。
  const benefits = [{
    icon: "🏃",
    tag: "フロー状態",
    title: /*#__PURE__*/React.createElement("span", null, "\u300C\u3084\u3081\u306A\u3055\u3044\u300D\u3068\u8A00\u3063\u3066\u3082\u3001", /*#__PURE__*/React.createElement("br", null), "\u52DD\u624B\u306B\u81EA\u5206\u3067\u8D70\u3063\u3066\u3044\u304F"),
    bubble: "やめなさいって言っても、やめないんです(笑)"
  }, {
    icon: "👏",
    tag: "褒めるきっかけ",
    title: /*#__PURE__*/React.createElement("span", null, "\u5B50\u3069\u3082\u3092\u8912\u3081\u308B\u304D\u3063\u304B\u3051\u304C\u3001", /*#__PURE__*/React.createElement("br", null), "\u305F\u304F\u3055\u3093\u751F\u307E\u308C\u308B"),
    bubble: "「こんなに単語覚えたの、すごいじゃん」って自然に言えるように。",
    contrast: true
  }, {
    icon: "🌟",
    tag: "自己効力感",
    title: /*#__PURE__*/React.createElement("span", null, "\u300C\u81EA\u5206\u306F\u5C06\u6765\u3001\u82F1\u8A9E\u304C", /*#__PURE__*/React.createElement("br", null), "\u3067\u304D\u308B\u3088\u3046\u306B\u306A\u308B\u300D\u3068\u4FE1\u3058\u3089\u308C\u308B\u5B50\u306B"),
    bubble: "今すぐペラペラにならなくても、本人が未来を楽しみにしています。"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "36px 16px"
    }
  }, /*#__PURE__*/React.createElement(DS1.SectionHeading, {
    eyebrow: "FOR PARENTS & KIDS",
    title: "\u30D5\u30A1\u30F3\u30E9\u30FC\u30CB\u30F3\u30B0\u3067\u5B66\u3076\u3068\u3001",
    em: "\u3053\u3093\u306A\u306B\u9055\u3046!"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gap: 12
    }
  }, benefits.map((b, i) => /*#__PURE__*/React.createElement(DS1.Card, {
    key: i,
    pad: 16
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 28,
      lineHeight: 1
    }
  }, b.icon), /*#__PURE__*/React.createElement(DS1.Badge, {
    tone: "mint"
  }, b.tag)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: "0 0 4px",
      fontSize: 15.5,
      fontWeight: 900,
      lineHeight: 1.45,
      color: "var(--ink)"
    }
  }, b.title), b.contrast ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      margin: "10px 0 2px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 11.5,
      fontWeight: 800,
      padding: "7px 6px",
      borderRadius: "var(--radius)",
      background: "var(--bg-alt)",
      color: "var(--ink-3)",
      textDecoration: "line-through"
    }
  }, "\xD7\u300C\u52C9\u5F37\u3057\u306A\u3055\u3044\u300D"), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      textAlign: "center",
      fontSize: 11.5,
      fontWeight: 800,
      padding: "7px 6px",
      borderRadius: "var(--radius)",
      background: "var(--mint-soft)",
      color: "var(--magna-mint-deep)"
    }
  }, "\u25CB\u300C\u4ECA\u65E5\u3082\u9811\u5F35\u3063\u3066\u308B\u306D\u300D")) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(DS1.ImagePlaceholder, {
    circle: true,
    minHeight: 44,
    label: "\u89AA",
    style: {
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      fontWeight: 700,
      color: "var(--ink-2)",
      lineHeight: 1.6
    }
  }, b.bubble))))), /*#__PURE__*/React.createElement(DS1.Disclaimer, null, "\u203B\u5439\u304D\u51FA\u3057\u30B3\u30E1\u30F3\u30C8\u306F\u30B5\u30F3\u30D7\u30EB\u3002\u5B9F\u969B\u306E\u4FDD\u8B77\u8005\u306E\u58F0\u30FB\u5199\u771F\u306B\u5DEE\u3057\u66FF\u3048\u4E88\u5B9A\u3002"));
}
Object.assign(window, {
  LpNav,
  LpHero,
  LpIntro,
  LpBenefit
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/schooltop/SectionsTop.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.SpeechBubble = __ds_scope.SpeechBubble;

__ds_ns.StatBadge = __ds_scope.StatBadge;

__ds_ns.VoiceCard = __ds_scope.VoiceCard;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Disclaimer = __ds_scope.Disclaimer;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.ComboFormula = __ds_scope.ComboFormula;

__ds_ns.ImagePlaceholder = __ds_scope.ImagePlaceholder;

})();
