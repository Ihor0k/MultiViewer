package ua.ihor0k;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

@ServerEndpoint(
        value = "/api",
        encoders = MessageEncoder.class,
        decoders = MessageDecoder.class
)
public class ViewerEndpoint {
    private static Set<ViewerEndpoint> endpoints = new CopyOnWriteArraySet<>();

    private Session session;

    @OnOpen
    public void onOpen(Session session) {
        System.out.println("open");
        this.session = session;
        endpoints.add(this);
    }

    @OnMessage
    public void onMessage(Session session, Message message) {
        System.out.println("message");
        broadcast(message);
    }

    @OnClose
    public void onClose(Session session) {
        System.out.println("close");
        endpoints.remove(this);
    }

    @OnError
    public void onError(Throwable error) {
        error.printStackTrace();
    }

    private static void broadcast(Message message) {
        for (ViewerEndpoint endpoint : endpoints) {
            synchronized (endpoint) {
                try {
                    endpoint.session.getBasicRemote().sendObject(message);
                } catch (IOException | EncodeException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
