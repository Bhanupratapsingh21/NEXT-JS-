import { Message } from "postcss";

export interface ApiResponse{
    success : boolean;
    message: string;
    isAccesptingMessages?:boolean;
    messages? : Array<Message>
}
