package ch.puzzle.ln.zeus.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/management/liveness")
public class LivenessResource {

    /**
     * GET / : return Ok.
     *
     * @return a Response with status 200 (OK)
     */
    @GetMapping("")
    public ResponseEntity<String> getLiveness() {
        return new ResponseEntity<>("OK", null, HttpStatus.OK);
    }
}
