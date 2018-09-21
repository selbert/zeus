package ch.puzzle.ln.pos.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "dynamic_configuration")
public class DynamicConfiguration {

    @Id
    @NotNull
    private String key;

    @NotNull
    private String value;

    public DynamicConfiguration() {
    }

    public DynamicConfiguration(@NotNull String key, @NotNull String value) {
        this.key = key;
        this.value = value;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public Boolean getValueBoolean() {
        return Boolean.valueOf(value);
    }

    public void setValue(String value) {
        this.value = value;
    }
}
