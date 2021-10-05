const colors = [
    '#143d77',
    '#d2002d',
    '#42a62a',
    '#f3971d',
    '#a5027c'
];

export function getColor (nick = '') {
    let sum = 0;
    for (let i = 0; i < nick.length; i++) sum += nick.charCodeAt(i);
    return colors[sum % colors.length];
}
