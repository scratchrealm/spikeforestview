// import React from React;

export const toTitleCase = (text: string) => {
    return text.replace(/\w\S*/g, (t) => {
        return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
    })
}
