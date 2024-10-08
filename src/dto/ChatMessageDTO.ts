export class ChatMessageDTO {
    readonly sender: string;
    readonly message: string;
    readonly timestamp: Date;
    readonly locale: string;
    readonly type: string;

    constructor(body: ChatMessageDTO) {
        this.sender = body.sender;
        this.message = body.message;
        this.timestamp = body.timestamp;
        this.locale = 'pt-BR';
        this.type = body.type;

        if (body.timestamp == null) {
            this.timestamp = new Date();
            this.locale = 'Database';
        } else {
            this.timestamp = body.timestamp;
        }
    }
}
