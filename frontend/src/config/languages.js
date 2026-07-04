export const LANGS = {
  python: { name: "Python 3", ext: "py", cat: "Programming", icon: "🐍", color: "#3776AB" },
  java: { name: "Java", ext: "java", cat: "Programming", icon: "☕", color: "#ED8B00" },
  cpp: { name: "C++", ext: "cpp", cat: "Programming", icon: "⚙️", color: "#00599C" },
  c: { name: "C", ext: "c", cat: "Programming", icon: "🔧", color: "#555" },
  javascript: { name: "JavaScript", ext: "js", cat: "Web", icon: "🟨", color: "#F7DF1E" },
  html: { name: "HTML", ext: "html", cat: "Web", icon: "🌐", color: "#E34F26" },
  css: { name: "CSS", ext: "css", cat: "Web", icon: "🎨", color: "#1572B6" },
  mysql: { name: "MySQL", ext: "sql", cat: "Database", icon: "🐬", color: "#4479A1" },
  postgresql: { name: "PostgreSQL", ext: "sql", cat: "Database", icon: "🐘", color: "#4169E1" },
  mongodb: { name: "MongoDB", ext: "js", cat: "Database", icon: "🍃", color: "#47A248" },
};

export const SYNTAX_KEYWORDS = {
  python: "def|class|if|else|elif|for|while|return|import|from|in|not|and|or|is|None|True|False|pass|break|continue|try|except|finally|with|as|lambda|self|yield|raise",
  java: "public|private|protected|static|void|int|boolean|String|class|return|new|if|else|for|while|null|true|false|this|super|import|extends|implements|throw|try|catch|final|abstract",
  cpp: "int|void|bool|char|float|double|string|class|struct|public|private|return|if|else|for|while|new|delete|nullptr|true|false|const|auto|vector|using|namespace|include|template|typename",
  c: "int|void|char|float|double|struct|return|if|else|for|while|NULL|sizeof|typedef|const|static|include|define|malloc|free|unsigned|long",
  javascript: "var|let|const|function|return|if|else|for|while|new|this|class|extends|import|export|default|async|await|null|undefined|true|false|typeof|instanceof|console|of",
  html: "html|head|body|div|span|p|a|img|link|script|style|meta|title|h1|h2|h3|h4|h5|h6|ul|ol|li|table|form|input|button|section|header|footer|nav",
  css: "color|background|margin|padding|border|font|display|flex|grid|position|width|height|top|left|right|bottom|transition|transform|opacity|z-index",
  mysql: "SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|JOIN|LEFT|RIGHT|ON|AND|OR|NOT|IN|ORDER|BY|GROUP|HAVING|LIMIT|AS|COUNT|SUM|AVG|MAX|MIN|NULL|IS|DISTINCT|DESC|ASC",
  postgresql: "SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|JOIN|LEFT|RIGHT|ON|AND|OR|NOT|IN|ORDER|BY|GROUP|HAVING|LIMIT|AS|COUNT|SUM|AVG|MAX|MIN|NULL|IS|DISTINCT|DESC|ASC",
  mongodb: "find|sort|limit|skip|aggregate|match|group|project|lookup|unwind|db|collection|insertOne|updateOne|deleteOne|findOne|count|distinct",
};
