import {x2} from "../utils/utils.js"

export class Strings {
    /**
     * returns the str as an escaped RTF string
     * @param str {string} string to escape
     */
    static escapeRtf(str: string): string {
        const rtfEscaped: string[] = []
        const escapedChars = ["{", "}", "\\"]

        for (const glyph of str) {
            const charCode = glyph.charCodeAt(0)
            if (charCode <= 31) continue // non-printables

            if (charCode <= 127) {
                // 7-bit ascii
                if (escapedChars.includes(glyph)) rtfEscaped.push("\\")
                rtfEscaped.push(glyph)
            } else if (charCode <= 255) {
                // 8-bit ascii
                rtfEscaped.push("\\'" + x2(charCode))
            } else {
                // unicode. may consist of multiple code points
                for (const codepoint of glyph.split("")) {
                    // TODO:
                    // RTF control words generally accept signed 16-bit numbers as arguments.
                    // For this reason, Unicode values greater than 32767 must be expressed as negative numbers.
                    rtfEscaped.push("\\u")
                    // @ts-ignore: something weird is happening here
                    rtfEscaped.push(codepoint.charCodeAt(0))
                    rtfEscaped.push("?")
                }
            }
        }

        return "{\\rtf1\\ansi\\ansicpg1252\\fromhtml1 {\\*\\htmltag1 " + rtfEscaped.join("") + " }}"
    }
}