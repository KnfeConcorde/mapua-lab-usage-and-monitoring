module com.groupseven {
    requires javafx.controls;
    requires javafx.fxml;

    opens com.groupseven to javafx.fxml;
    exports com.groupseven;
}
