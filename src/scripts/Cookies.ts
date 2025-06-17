export function getCookie(cookieName: string) {
    let name = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function setCookie({ name, value, expireDays }: { name: string, value: any, expireDays?: number }) {
    let expireDate = new Date()
    expireDate.setDate(new Date().getDate() + (expireDays || 1)) // add {expireDays} day to actual date
    document.cookie = `${name}=${value};expires=${expireDate};path='/'`
}

export default function deleteToken({name}:{name:string}){
    
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC `
}