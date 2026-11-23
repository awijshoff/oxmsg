import {Address} from "./address"
import type {AddressType} from "../enums"
import {TopLevelProperties} from "../streams/top_level_properties"
import {PropertyTags} from "../property_tags"
import {OneOffEntryId} from "./one_off_entry_id"
import {AddressBookEntryId} from "./address_book_entry_id"
import {stringToAnsiArray} from "../utils/utils"

/**
 * The mailbox the message is sent on behalf of. With an X500 DN it is written as an
 * Exchange address book entry (EX), which Exchange needs for "Send on Behalf".
 */
export class Representing extends Address {
    readonly smtpAddress: string | null

    constructor(email: string, displayName: string, addressType: AddressType = "SMTP", smtpAddress: string | null = null) {
        super(email, displayName, addressType)
        this.smtpAddress = smtpAddress
    }

    writeProperties(stream: TopLevelProperties) {
        const entryId = this.addressType === "EX"
            ? new AddressBookEntryId(this.email).toByteArray()
            : new OneOffEntryId(this.email, this.displayName, this.addressType).toByteArray()
        // MS-OXCDATA 2.2.1: "<ADDRTYPE>:<EMAIL>", upper case
        const searchKey = stringToAnsiArray(`${this.addressType}:${this.email}`.toUpperCase())

        stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_ENTRYID, entryId)
        stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_SEARCH_KEY, searchKey)
        stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_EMAIL_ADDRESS_W, this.email)
        stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_NAME_W, this.displayName)
        stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_ADDRTYPE_W, this.addressType)
        if (this.smtpAddress != null) stream.addProperty(PropertyTags.PR_SENT_REPRESENTING_SMTP_ADDRESS_W, this.smtpAddress)
    }
}
