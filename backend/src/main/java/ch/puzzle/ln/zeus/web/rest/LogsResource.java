package ch.puzzle.ln.zeus.web.rest;

import ch.puzzle.ln.zeus.security.AuthoritiesConstants;
import ch.puzzle.ln.zeus.web.rest.vm.LoggerVM;
import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.LoggerContext;
import io.micrometer.core.annotation.Timed;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for view and managing Log Level at runtime.
 */
@RestController
@RequestMapping("/management")
@Timed
public class LogsResource {

    @GetMapping("/logs")
    @Secured(AuthoritiesConstants.ADMIN)
    public List<LoggerVM> getList() {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        return context.getLoggerList()
            .stream()
            .map(LoggerVM::new)
            .collect(Collectors.toList());
    }

    @PutMapping("/logs")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Secured(AuthoritiesConstants.ADMIN)
    public void changeLevel(@RequestBody LoggerVM jsonLogger) {
        LoggerContext context = (LoggerContext) LoggerFactory.getILoggerFactory();
        context.getLogger(jsonLogger.getName()).setLevel(Level.valueOf(jsonLogger.getLevel()));
    }
}
