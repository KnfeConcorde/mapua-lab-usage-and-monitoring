package dev.mapua;

import javafx.application.Application;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.layout.VBox;
import javafx.stage.Stage;

public class MainApp extends Application {
    @Override
    public void start(Stage stage) {
        Label label = new Label("Mapua Lab Usage & Monitoring");
        Button btn = new Button("Click me");
        btn.setOnAction(e -> label.setText("Hello from JavaFX!"));
        VBox root = new VBox(10, label, btn);
        root.setStyle("-fx-padding:20; -fx-alignment:center;");
        Scene scene = new Scene(root, 400, 200);
        stage.setTitle("Mapua Lab Monitor");
        stage.setScene(scene);
        stage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
