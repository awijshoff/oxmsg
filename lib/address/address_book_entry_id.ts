import {byteBufferAsUint8Array, makeByteBuffer, stringToAnsiArray} from "../utils/utils"

// MS-OXCDATA 2.2.5.2: Exchange address book provider UID
const EXCHANGE_ADDRESS_BOOK_PROVIDER_UID = [
    0xdc, 0xa7, 0x40, 0xc8, 0xc0, 0x42, 0x10, 0x1a, 0xb4, 0xb9, 0x08, 0x00, 0x2b, 0x2f, 0xe1, 0x82,
]
const ADDRESS_BOOK_ENTRY_ID_VERSION = 0x00000001
const ADDRESS_BOOK_TYPE_LOCAL_MAIL_USER = 0x00000000

/** Address Book EntryID (MS-OXCDATA 2.2.5.2) of an Exchange object, identified by its X500 DN. */
export class AddressBookEntryId {
    readonly x500Dn: string

    constructor(x500Dn: string) {
        this.x500Dn = x500Dn
    }

    toByteArray(): Uint8Array {
        const buf = makeByteBuffer()
        buf.writeUint32(0) // flags: long-term EntryID
        for (const byte of EXCHANGE_ADDRESS_BOOK_PROVIDER_UID) buf.writeUint8(byte)
        buf.writeUint32(ADDRESS_BOOK_ENTRY_ID_VERSION)
        buf.writeUint32(ADDRESS_BOOK_TYPE_LOCAL_MAIL_USER)
        buf.append(stringToAnsiArray(this.x500Dn)) // null-terminated
        return byteBufferAsUint8Array(buf)
    }
}
