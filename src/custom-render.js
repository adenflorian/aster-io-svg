

export function createElement(tag, props, ...children) {
  if (typeof tag === "function") return tag(props, ...children);
  const element = isSvgTag(tag)
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);

  Object.entries(props || {}).forEach(([name, value]) => {
    if (name.startsWith("on") && name.toLowerCase() in window) {
      element.addEventListener(name.toLowerCase().substr(2), value);
    } else {
      element.setAttribute(name, value.toString());
    }
  });

  children.forEach(child => {
    appendChild(element, child);
  });

  return element;
};

export function createFragment(props, ...children) {
  return children
}

function appendChild(parent, child) {
  if (Array.isArray(child))
    child.forEach(nestedChild => appendChild(parent, nestedChild));
  else
    parent.appendChild(child.nodeType ? child : document.createTextNode(child));
};

function isSvgTag(tag) {
  return ['svg', 'path'].includes(tag)
}