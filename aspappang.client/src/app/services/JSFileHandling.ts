export function addJSFile(src: string) {
  let node = document.createElement("script");
  node.src = src;

  document.querySelector("head")?.appendChild(node);
}

export function removeJSFile(src: string) {
  const el = document.querySelector(`head script[src='${src}']`);
  el?.remove();
}
