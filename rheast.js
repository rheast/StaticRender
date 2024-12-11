// StaticRender v1.01 - Rheast.js

class RHEast {
    constructor() {
        this.forStyle();
        document.addEventListener('DOMContentLoaded', () => {
            this.forLoad();
        });
    }

    forStyle() {
        let style = document.createElement('style');
        style.textContent = '[_for] { visibility: hidden; }';
        document.querySelector('head').appendChild(style);
    }

    forLoad() {
        let name = '';
        this.forIterate((level) => {
            name += '[_for] ';
            this.forProcess(name, (item) => {
                item.setAttribute('_level', level);
            });
        });
        this.forProcess(`[_level="${0}"]`, (item) => {
            this.forClone(item);
        });
        this.forProcess('[_if]', (item) => {
            if (!this.forCheck(item)) {
                item.remove();
            }
        });
    }

    forCheck(div) {
        let attr = div.getAttribute('_if');
        try {
            attr = eval(attr);
            if (!attr && typeof (attr) != typeof (1)) {
                return false;
            }
        } catch (e) { }
        div.removeAttribute('_if');
        return true;
    }

    forIterate(processor) {
        let level = 0;
        while (true) {
            if (!processor(level)) {
                break;
            }
            level += 1;
        }
    }

    forProcess(selector, processor) {
        let box = document.querySelectorAll(selector);
        Array.from(box).forEach(item => {
            processor(item);
        });
        return box.length > 0;
    }

    forClean(div) {
        let attr = ['_for', '_level'];
        for (let a in attr) {
            div.removeAttribute(attr[a]);
        }
        return div;
    }

    forClone(div, data) {
        let target = div.getAttribute('_for');
        if (!data) {
            data = eval(target);
        } else {
            data = data[target];
        }
        for (let i in data) {
            let clone = div.cloneNode(true);
            this.forReplace(clone, data[i], i);
            this.forClean(clone);
            div.parentNode.insertBefore(clone, div);
        }
        div.remove();
    }

    forReplace(div, data, index) {
        Array.from(div.attributes).forEach((attr) => {
            attr.value = this.forBrackets(attr.value, data, index);
        });
        Array.from(div.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.nodeValue = this.forBrackets(node.nodeValue, data, index);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.getAttribute('_level')) {
                    this.forClone(node, data);
                } else {
                    this.forReplace(node, data, index);
                }
            }
        });
    }

    forBrackets(value, data, index) {
        if (typeof (data) != typeof ({})) {
            data = { _this: data, _value: data };
        }
        data._index = index;
        let rule = /(?<=\{).*?(?=\})/g;
        let match = value.match(rule);
        for (let i in match) {
            let text = match[i];
            let info = '';
            if (text in data) {
                info = data[text];
            }
            value = value.replaceAll(`{${text}}`, String(info));
        }
        return value;
    }

    href(name) {
        let data = new URL(window.location.href);
        return data.searchParams.get(name);
    }

    resize() {
        if (window.addEventListener) {
            window.addEventListener("resize", function () {
                location.reload();
            });
        } else if (window.attachEvent) {
            window.attachEvent("onresize", function () {
                location.reload();
            });
        }
    }
}

const rheast = new RHEast();