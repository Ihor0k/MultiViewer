package ua.ihor0k;

import lombok.Data;

@Data
public class Message {
    private MessageType type;
    private long timestamp;
}
