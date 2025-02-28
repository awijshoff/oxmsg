declare module 'oxmsg' {
  export interface EmailOptions {
    subject?: string;
    body?: string;
    from?: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
  }

  export class Email {
    constructor(options?: EmailOptions);
    
    setSubject(subject: string): void;
    setBody(body: string): void;
    setFrom(from: string): void;
    addTo(recipient: string): void;
    addCc(recipient: string): void;
    addBcc(recipient: string): void;
    addAttachment(filename: string, content: Buffer): void;
    
    generateMessage(): Buffer;
    save(filepath: string): void;
  }

  export default Email;
}