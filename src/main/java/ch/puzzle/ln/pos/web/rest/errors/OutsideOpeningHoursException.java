package ch.puzzle.ln.pos.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class OutsideOpeningHoursException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public OutsideOpeningHoursException() {
        super(ErrorConstants.OUTSIDE_OPENING_HOURS_TYPE, "Order outside of opening hours", Status.BAD_REQUEST);
    }
}
