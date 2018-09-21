package ch.puzzle.ln.pos.config;

import org.lightningj.lnd.wrapper.Message;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpInputMessage;
import org.springframework.http.HttpOutputMessage;
import org.springframework.http.MediaType;
import org.springframework.http.converter.AbstractHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.converter.HttpMessageNotWritableException;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.util.List;

@Configuration
public class MessageConverterConfiguration implements WebMvcConfigurer {

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        converters.add(0, new MessageConverter());
    }

    public static class MessageConverter extends AbstractHttpMessageConverter<Message<?>> {

        public MessageConverter() {
            super(MediaType.ALL, MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON_UTF8);
        }

        @Override
        protected boolean supports(Class<?> clazz) {
            boolean result = Message.class.isAssignableFrom(clazz);
            return result;
        }

        @Override
        protected Message<?> readInternal(Class<? extends Message<?>> clazz, HttpInputMessage inputMessage) throws IOException, HttpMessageNotReadableException {
            return null;
        }

        @Override
        protected void writeInternal(Message<?> message, HttpOutputMessage outputMessage) throws IOException, HttpMessageNotWritableException {
            outputMessage.getHeaders().setContentType(MediaType.APPLICATION_JSON_UTF8);
            outputMessage.getBody().write(message.toJsonAsString(false).getBytes());
            outputMessage.getBody().close();
        }
    }
}
