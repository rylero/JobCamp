export const isMobilePhone = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

export const schoolEmailCheck = (schoolEmailDomain: string) => {
    return new RegExp('^[A-Za-z0-9._%+-]+'+schoolEmailDomain+'$');
}