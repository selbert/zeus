package ch.puzzle.ln.zeus.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class InvalidOrderException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public InvalidOrderException() {
        super(ErrorConstants.INVALID_ORDER_TYPE, "Invalid order", Status.BAD_REQUEST);
    }
}
