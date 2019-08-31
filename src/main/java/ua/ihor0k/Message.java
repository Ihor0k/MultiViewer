package ua.ihor0k;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Message {
    private MessageType type;
    private Double timestamp;
}
