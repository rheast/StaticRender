// StaticRender v1.02 - Rheast.js

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
        const box = Array.from(document.querySelectorAll('[_for]')).filter(
            element => !Array.from(document.querySelectorAll('[_for] [_for]')).includes(element)
        );
        Array.from(box).forEach(item => {
            this.forClone(item);
        });
    }

    forClone(div, data) {
        if (typeof (div) == typeof ('N')) {
            div = document.querySelector(div);
        }
        data = this.forData(div, data);
        if (!div || !data) {
            return false;
        }
        for (let i in data) {
            let clone = div.cloneNode(true);
            clone.removeAttribute('_for');
            this.forReplace(clone, this.forValue(data[i], i), i);
            clone.querySelectorAll('[_retard]').forEach(item => {
                item.remove();
            });
            div.parentNode.insertBefore(clone, div);
        }
        div.remove();
    }

    forData(div, data) {
        try {
            let target = div.getAttribute('_for');
            if (!target) {
                return data;
            } else if (/^\[.*\]$|^\{.*\}$/.test(target)) {
                return JSON.parse(target);
            } else if (data && target in data) {
                return data[target];
            } else if (target in window) {
                return window[target];
            } else {
                return data;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    forValue(data, index) {
        if (typeof (data) != typeof ({})) {
            data = { _this: data, _value: data };
        }
        data._index = index;
        return data;
    }

    forReplace(div, data) {
        Array.from(div.attributes).forEach((attr) => {
            if (['_if', '_else'].includes(attr.name)) {
                let value = data[attr.value];
                value = typeof (value) == typeof (1) || value;
                if ((attr.name == '_if' && value) || (attr.name == '_else' && !value)) {
                    div.removeAttribute(attr.name);
                } else {
                    div.setAttribute('_retard', true);
                }
            } else {
                attr.value = this.forBrackets(attr.value, data);
            }
        });
        Array.from(div.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.nodeValue = this.forBrackets(node.nodeValue, data);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.getAttribute('_for')) {
                    this.forClone(node, data);
                } else {
                    this.forReplace(node, data);
                }
            }
        });
    }

    forBrackets(value, data) {
        let match = value.match(/(?<=\{).*?(?=\})/g);
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