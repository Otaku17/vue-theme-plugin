import { ref as x, onMounted as b } from "vue";
function p(i) {
  const {
    defaultTheme: d = i.available[0],
    available: n,
    themes: u = {},
    key: r = "theme",
    storage: a = "local",
    detectTheme: h
  } = i, c = a === "local" ? localStorage : a === "session" ? sessionStorage : a === "none" ? null : a, l = x(d), f = (t) => {
    const e = u[t], s = document.documentElement;
    Object.values(u).forEach(({ class: o }) => {
      o && s.classList.remove(o);
    }), e != null && e.class && s.classList.add(e.class), e != null && e.dataTheme ? s.setAttribute("data-theme", e.dataTheme) : s.removeAttribute("data-theme");
  }, m = (t) => {
    n.includes(t) && l.value !== t && (l.value = t, f(t), c == null || c.setItem(r, t));
  }, T = () => {
    const e = (n.indexOf(l.value) + 1) % n.length;
    m(n[e]);
  };
  return b(() => {
    const t = c == null ? void 0 : c.getItem(r), e = t && n.includes(t), s = !e && h ? h() : null, o = e ? t : s && n.includes(s) ? s : d;
    m(o);
  }), {
    theme: l,
    themes: n,
    setTheme: m,
    toggleTheme: T
  };
}
export {
  p as useTheme
};
