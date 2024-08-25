(function () {
    if (!HTMLFormElement.prototype.reportValidity) {
        HTMLFormElement.prototype.reportValidity = function () {
            if (this.checkValidity()) return true;
            const btn = document.createElement('button');
            this.appendChild(btn);
            btn.click();
            this.removeChild(btn);
            return false;
        }
    }
})();

