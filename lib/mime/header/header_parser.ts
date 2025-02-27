import type {HeaderDict} from "./message_header.js"

export class HeaderParser {
    /**
     * Parse raw email header text into a dictionary of header names and their values
     * @param headerText Raw header text
     * @returns Record of header names to array of their values
     */
    static parseHeaders(headerText: string): HeaderDict {
        if (!headerText) return {};

        const headers: HeaderDict = {};
        let currentHeader = '';
        let currentValue: string[] = [];

        // Split headers into lines
        const lines = headerText.split(/\r?\n/);

        for (let line of lines) {
            // Skip empty lines
            if (!line.trim()) continue;

            // If line starts with whitespace, it's a continuation of previous header
            if (/^\s/.test(line)) {
                if (currentValue.length > 0) {
                    // Append to last value with a space
                    currentValue[currentValue.length - 1] += ' ' + line.trim();
                }
                continue;
            }

            // If we were building a header value, save it now
            if (currentHeader && currentValue.length > 0) {
                headers[currentHeader] = currentValue;
                currentValue = [];
            }

            // Parse new header line
            const match = line.match(/^([^:]+):\s*(.*)$/);
            if (match) {
                currentHeader = match[1].trim();
                if (match[2]) {
                    currentValue.push(match[2].trim());
                }
            }
        }

        // Save final header if exists
        if (currentHeader && currentValue.length > 0) {
            headers[currentHeader] = currentValue;
        }

        return headers;
    }
}
