package ch.puzzle.ln.pos.config;

import org.lightningj.lnd.wrapper.MacaroonContext;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.net.URI;
import java.net.URISyntaxException;

/**
 * Properties specific to LnPos.
 * <p>
 * Properties are configured in the application.yml file.
 * See {@link io.github.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application", ignoreUnknownFields = false)
public class ApplicationProperties {

    private String memoPrefix;
    private String currencyTicker;
    private Double taxMultiplier;

    private Lnd lnd = new Lnd();
    private Bitcoin bitcoin = new Bitcoin();
    private Mail mail = new Mail();
    private Twitter twitter = new Twitter();

    public String getMemoPrefix() {
        return memoPrefix;
    }

    public void setMemoPrefix(String memoPrefix) {
        this.memoPrefix = memoPrefix;
    }

    public String getCurrencyTicker() {
        return currencyTicker;
    }

    public void setCurrencyTicker(String currencyTicker) {
        this.currencyTicker = currencyTicker;
    }

    public Double getTaxMultiplier() {
        return taxMultiplier;
    }

    public void setTaxMultiplier(Double taxMultiplier) {
        this.taxMultiplier = taxMultiplier;
    }

    public Lnd getLnd() {
        return lnd;
    }

    public Bitcoin getBitcoin() {
        return bitcoin;
    }

    public Mail getMail() {
        return mail;
    }

    public Twitter getTwitter() {
        return twitter;
    }

    public static class Lnd {

        private String host;
        private int port;
        private String certPath;
        private String invoiceMacaroonHex;
        private String readonlyMacaroonHex;
        private Long invoiceExpirySeconds;

        public String getHost() {
            return host;
        }

        public void setHost(String host) {
            this.host = host;
        }

        public int getPort() {
            return port;
        }

        public void setPort(int port) {
            this.port = port;
        }

        public String getCertPath() {
            return certPath;
        }

        public void setCertPath(String certPath) {
            this.certPath = certPath;
        }

        public String getInvoiceMacaroonHex() {
            return invoiceMacaroonHex;
        }

        public MacaroonContext getInvoiceMacaroonContext() {
            return () -> invoiceMacaroonHex;
        }

        public void setInvoiceMacaroonHex(String invoiceMacaroonHex) {
            this.invoiceMacaroonHex = invoiceMacaroonHex;
        }

        public String getReadonlyMacaroonHex() {
            return readonlyMacaroonHex;
        }

        public MacaroonContext getReadonlyMacaroonContext() {
            return () -> readonlyMacaroonHex;
        }

        public void setReadonlyMacaroonHex(String readonlyMacaroonHex) {
            this.readonlyMacaroonHex = readonlyMacaroonHex;
        }

        public Long getInvoiceExpirySeconds() {
            return invoiceExpirySeconds;
        }

        public void setInvoiceExpirySeconds(Long invoiceExpirySeconds) {
            this.invoiceExpirySeconds = invoiceExpirySeconds;
        }
    }

    public static class Bitcoin {

        private String tickerUrl;
        private Integer connectTimeout;
        private Integer readTimeout;
        private String restUrl;

        public String getTickerUrl() {
            return tickerUrl;
        }

        public URI getTickerUri() throws URISyntaxException {
            return new URI(tickerUrl);
        }

        public void setTickerUrl(String tickerUrl) {
            this.tickerUrl = tickerUrl;
        }

        public Integer getConnectTimeout() {
            return connectTimeout;
        }

        public void setConnectTimeout(Integer connectTimeout) {
            this.connectTimeout = connectTimeout;
        }

        public Integer getReadTimeout() {
            return readTimeout;
        }

        public void setReadTimeout(Integer readTimeout) {
            this.readTimeout = readTimeout;
        }

        public String getRestUrl() {
            return restUrl;
        }

        public URI getRestUri() throws URISyntaxException {
            return new URI(restUrl);
        }

        public void setRestUrl(String restUrl) {
            this.restUrl = restUrl;
        }
    }

    public static class Mail {

        private boolean processorEnabled = false;
        private boolean send = false;
        private String recipient = "";
        private String subject = "";
        private String paymentText = "";

        public boolean isProcessorEnabled() {
            return processorEnabled;
        }

        public void setProcessorEnabled(boolean processorEnabled) {
            this.processorEnabled = processorEnabled;
        }

        public boolean isSend() {
            return send;
        }

        public void setSend(boolean send) {
            this.send = send;
        }

        public String getRecipient() {
            return recipient;
        }

        public void setRecipient(String recipient) {
            this.recipient = recipient;
        }

        public String getSubject() {
            return subject;
        }

        public void setSubject(String subject) {
            this.subject = subject;
        }

        public String getPaymentText() {
            return paymentText;
        }

        public void setPaymentText(String paymentText) {
            this.paymentText = paymentText;
        }
    }

    public static class Twitter {

        private boolean processorEnabled = false;
        private String consumerKey;
        private String consumerSecret;
        private String accessToken;
        private String accessTokenSecret;

        public boolean isProcessorEnabled() {
            return processorEnabled;
        }

        public void setProcessorEnabled(boolean processorEnabled) {
            this.processorEnabled = processorEnabled;
        }

        public String getConsumerKey() {
            return consumerKey;
        }

        public void setConsumerKey(String consumerKey) {
            this.consumerKey = consumerKey;
        }

        public String getConsumerSecret() {
            return consumerSecret;
        }

        public void setConsumerSecret(String consumerSecret) {
            this.consumerSecret = consumerSecret;
        }

        public String getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(String accessToken) {
            this.accessToken = accessToken;
        }

        public String getAccessTokenSecret() {
            return accessTokenSecret;
        }

        public void setAccessTokenSecret(String accessTokenSecret) {
            this.accessTokenSecret = accessTokenSecret;
        }
    }
}
