class Loc {
    static getMessage(code, replacer = {}) {
        let mess = (MESS[code]) ? MESS[code] : code;

        if(Object.keys(replacer).length > 0) {
            for (let i in replacer) {
                let reg = new RegExp(i);
                mess.replace(reg, replacer[i]);
            }
        }

        return mess;
    }
}