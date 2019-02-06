package ch.puzzle.ln.zeus.web.rest;

import ch.puzzle.ln.zeus.service.LndService;
import com.codahale.metrics.annotation.Timed;
import org.lightningj.lnd.wrapper.message.GetInfoResponse;
import org.lightningj.lnd.wrapper.message.ListChannelsResponse;
import org.lightningj.lnd.wrapper.message.NodeInfo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.actuate.health.AbstractHealthIndicator;
import org.springframework.boot.actuate.health.Health;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/lnd")
public class LndResource extends AbstractHealthIndicator {

    private static final Logger LOGGER = LoggerFactory.getLogger(LndResource.class);

    private final LndService lndService;

    public LndResource(LndService lndService) {
        this.lndService = lndService;
    }

    @GetMapping(value = "")
    @Timed
    public GetInfoResponse getInfo() throws Exception {
        return lndService.getInfo();
    }

    @GetMapping("/channels")
    @Timed
    public ListChannelsResponse getChannels() throws Exception {
        return lndService.getChannels();
    }

    @GetMapping("/nodeinfo/{nodeId}")
    @Timed
    public NodeInfo getNodeInfo(@PathVariable String nodeId) throws Exception {
        return lndService.getNodeInfo(nodeId);
    }

    @Override
    protected void doHealthCheck(Health.Builder builder) throws Exception {
        try {
            GetInfoResponse info = lndService.getInfo();

            builder
                .withDetail("blockHeight", info.getBlockHeight())
                .withDetail("blockHash", info.getBlockHash())
                .up();
        } catch (Exception e) {
            LOGGER.error("Error in LND health check.", e);
            builder.down(e);
        }
    }
}
